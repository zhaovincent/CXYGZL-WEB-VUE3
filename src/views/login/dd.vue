<template>
	<div class="login-container">
		<h1>请使用钉钉扫码登录</h1>
		<div id="self_defined_element" class="self-defined-classname"></div>

	</div>
</template>

<script setup lang="ts">
import {useUserStore} from "@/store/modules/user";

const userStore = useUserStore();

import { getLoginParam,loginByTokenApi } from "@/api/auth";
import router from "@/router";
import {LocationQuery, LocationQueryValue, useRoute} from "vue-router";
const route = useRoute();




function init(p){
	// STEP3：在需要的时候，调用 window.DTFrameLogin 方法构造登录二维码，并处理登录成功或失败的回调。
	window.DTFrameLogin(
		{
			id: 'self_defined_element',
			width: 300,
			height: 300,
		},
			p
	,
		(loginResult) => {
			const {redirectUrl, authCode, state} = loginResult;
			// 这里可以直接进行重定向
			//window.location.href = redirectUrl;
			// 也可以在不跳转页面的情况下，使用code进行授权
			console.log(authCode);

		const query: LocationQuery = route.query;

		const redirect = (query.redirect as LocationQueryValue) ?? "/";

		userStore
			.loginByToken(authCode)
			.then(() => {


				const otherQueryParams = Object.keys(query).reduce(
					(acc: any, cur: string) => {
						if (cur !== "redirect") {
							acc[cur] = query[cur];
						}
						return acc;
					},
					{}
				);



				router.push({ path: redirect, query: otherQueryParams });
			})

		},
		(errorMsg) => {
			// 这里一般需要展示登录失败的具体原因
			alert(`Login Error: ${errorMsg}`);
		},
	);
}


onMounted(()=>{
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://g.alicdn.com/dingding/h5-dingtalk-login/0.21.0/ddlogin.js';
	document.body.appendChild(script);

	getLoginParam().then(res=>{
		init(res.data)
	})



})

</script>

<style lang="less" scoped>
.login-container{
  text-align: center;
  padding-top: 20vh;
}
.self-defined-classname {
  width: 300px;
  height: 300px;
  margin-left: calc(50vw - 150px);
}
</style>

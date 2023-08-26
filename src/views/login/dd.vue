<template>
	<div>
		<div style="display: flex;flex-direction: row">
			<div class="f1"></div>
			<div class="f2">
				<div class="login-container">
					<h1>请使用钉钉扫码登录</h1>
					<div id="self_defined_element" class="self-defined-classname"></div>

				</div>
			</div>
			<div class="f1">
				<div style="text-align: center;font-size: 30px;font-weight: bold;color: red;padding-top: 200px;">
					!!!需要体验的请先加入钉钉组织!!!
				</div>
				<div style="text-align: center;font-size: 20px;font-weight: bold;color: red;padding-top: 20px;">
					请用钉钉扫描下方二维码加入组织
				</div>

				<div style="text-align: center">
					<img src="@/assets/images/邀请二维码.png"/>
				</div>
				<div style="text-align: center;font-size: 20px;font-weight: bold;color: red;padding-top: 20px;">
						加入之后请添加作者微信<span style="color: blue">cxygzl666</span>处理，备注：<span style="color: blue">cxygzl</span>和<span style="color: blue">钉钉名字</span>
				</div>

			</div>
		</div>

	</div>

</template>

<script setup lang="ts">
import {useUserStore} from "@/store/modules/user";

const userStore = useUserStore();

import {getLoginParam, loginByTokenApi} from "@/api/auth";
import router from "@/router";
import {LocationQuery, LocationQueryValue, useRoute} from "vue-router";

const route = useRoute();


function init() {
	// STEP3：在需要的时候，调用 window.DTFrameLogin 方法构造登录二维码，并处理登录成功或失败的回调。
	window.DTFrameLogin(
			{
				id: 'self_defined_element',
				width: 300,
				height: 300,
			},
			loginParam.value
			,
			(loginResult) => {
				const {redirectUrl, authCode, state} = loginResult;
				// 这里可以直接进行重定向
				//window.location.href = redirectUrl;
				// 也可以在不跳转页面的情况下，使用code进行授权


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


							router.push({path: redirect, query: otherQueryParams});
						}).catch(err => {
					//	initQRCode();
				})

			},
			(errorMsg) => {
				// 这里一般需要展示登录失败的具体原因
				alert(`Login Error: ${errorMsg}`);
			},
	);
}

const loginParam = ref();


onMounted(() => {
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://g.alicdn.com/dingding/h5-dingtalk-login/0.21.0/ddlogin.js';
	document.body.appendChild(script);


	initQRCode();

})

function initQRCode() {
	getLoginParam().then(res => {
		loginParam.value = res.data;
		init()
	})

}

</script>

<style lang="less" scoped>
.login-container {
	text-align: center;
	padding-top: 20vh;
}

.self-defined-classname {
	width: 300px;
	height: 300px;
	margin-left: 50px;
}

.f2 {
	width: 400px;
}

.f1 {
	width: calc(50% - 200px);
}
</style>

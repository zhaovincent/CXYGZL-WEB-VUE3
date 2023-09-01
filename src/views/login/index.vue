<template>
	<div class="login-container">

	</div>
</template>

<script setup lang="ts">

import {getLoginUrl} from "@/api/auth";
import {LocationQuery, LocationQueryValue, useRoute} from "vue-router";
import router from "@/router";

import {useUserStore} from "@/views/cxygzl/stores/user";
import {getCurrentInstance} from "vue";

const userStore = useUserStore();
const route = useRoute();

function handleLogin() {
	getLoginUrl().then(res => {

		const query: LocationQuery = route.query;

		const otherQueryParams = Object.keys(query).reduce(
				(acc: any, cur: string) => {
					// if (cur !== "redirect") {
					acc[cur] = query[cur];
					// }
					return acc;
				},
				{}
		);

		let data = res.data;
		if (data.innerUrl) {
			router.push({path: data.url, query: otherQueryParams});

		} else {
			window.location.href = data.url
		}


	})
}

const {proxy} = getCurrentInstance();

onMounted(() => {

	const query: LocationQuery = route.query;

	const redirect = (query.redirect as LocationQueryValue) ?? "/";
	var token = (query.token as LocationQueryValue) ?? "";
	const authCode = (query.authCode as LocationQueryValue) ?? "";

	console.log(authCode, token)

	if (proxy.$isBlank(token)) {
		token = authCode;
	}


	if (proxy.$isNotBlank(token)) {


		userStore
				.loginByToken(token)
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
				});
	} else {
		handleLogin();

	}


})

</script>

<style lang="less" scoped>
.login-container {
	text-align: center;
	padding-top: 20vh;
}

</style>

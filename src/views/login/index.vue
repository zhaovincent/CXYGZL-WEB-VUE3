<template>
  <div class="login-container">

  </div>
</template>

<script setup lang="ts">

import { getLoginUrl } from "@/api/auth";
import {LocationQuery, LocationQueryValue, useRoute} from "vue-router";
import router from "@/router";
const route = useRoute();

function  handleLogin(){
	getLoginUrl().then(res=>{
		console.log(res)

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

	 router.push({ path: res.data, query: otherQueryParams });

	})
}

onMounted(()=>{


	handleLogin();

})

</script>

<style lang="less" scoped>
.login-container{
	text-align: center;
	padding-top: 20vh;
}

</style>

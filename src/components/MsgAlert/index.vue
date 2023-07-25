<script setup lang="ts">
import {useAppStore} from '@/store/modules/app';
import {getMessageUnreadNum} from "@/api/message/index";
import {useRouter} from "vue-router";

const appStore = useAppStore();

const unreadNum = ref(0)

function handleQuery() {
	getMessageUnreadNum().then(res => {
		const {data} = res;
		unreadNum.value = data;
	})
}
const router = useRouter();

setInterval(() => {
	handleQuery()
}, 5000)

onMounted(() => {
	handleQuery();
})

const goto=()=>{
		router.push("/system/message")
}

</script>

<template>
	<div @click="goto" style="cursor: pointer">
		<el-badge :value="unreadNum">
			<svg-icon icon-class="message"/>
		</el-badge>
	</div>

</template>

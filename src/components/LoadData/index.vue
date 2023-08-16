<script setup lang="ts">
import {useAppStore} from '@/store/modules/app';
import {getMessageUnreadNum} from "@/api/message/index";
import {useRouter} from "vue-router";
import {loadRemoteData} from '@/api/base/index'

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
	loadRemoteData().then(res=>{
			ElMessage.success('同步成功')
	})
}

</script>

<template>
	<div @click="goto" style="cursor: pointer">

			<svg-icon icon-class="download"/>

	</div>

</template>

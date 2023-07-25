<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { getMessageUnreadNum } from "@/api/message/index";

const appStore = useAppStore();

const unreadNum=ref(0)

function handleQuery() {
	getMessageUnreadNum().then(res => {
		const {data} = res;
		unreadNum.value = data;
	})
}

setInterval(()=>{
	handleQuery()
},5000)

onMounted(()=>{
	handleQuery();
})
</script>

<template>
		<div>
		<el-badge :value="unreadNum"  >
			<svg-icon icon-class="message" />
		</el-badge>
		</div>

</template>

<script setup lang="ts">

import StartFlowUi from './startFlowUI.vue'
import {ref} from "vue";
import {FormVO} from "@/api/form/types";
import {getFlowDetail, startFlow} from "@/api/flow";
import {getCurrentInstance } from "vue";


const currentOpenFlow = ref<FormVO[]>([]);

const handle = (row) => {


	currentOpenFlow.value = row;

	startProcess(row);
}

defineExpose({handle});

const startFlowUiRef = ref();


const startProcess = (f) => {


	getFlowDetail(f.flowId,true).then(res => {
		const {data} = res

		const {formItems} = data;

		let formIteamJsonArray = JSON.parse(formItems);



		startFlowUiRef.value.handle(f, formIteamJsonArray, data.selectUserNodeId)

    //

	})
}

const {proxy} = getCurrentInstance()


const submitProcess = (data) => {

	startFlow(data).then(res => {
		startFlowUiRef.value.complete(res);
	})


}

</script>

<template>
	<div>

		<start-flow-ui @complete="submitProcess" ref="startFlowUiRef"></start-flow-ui>


	</div>
</template>

<style scoped lang="less">

</style>

<script setup lang="ts">

import StartFlowUi from './startFlowUI.vue'
import {ref} from "vue";
import {FormVO} from "../../api/form/types";
import {queryTask} from "../../api/task";
import {getCurrentInstance} from "vue";
import {completeTask} from "../../api/task";


const currentOpenFlow = ref<FormVO[]>([]);

const handle = (flowId,taskId) => {

	var row={flowId:flowId,taskId:taskId}
	currentOpenFlow.value = row;

	startProcess(row);
}

defineExpose({handle});

const startFlowUiRef = ref();


const startProcess = (f) => {


	queryTask(f.taskId,false).then(res => {
		const {data} = res

		const {formItems,selectUserNodeId,nodeId} = data;
		currentOpenFlow.value.nodeId=nodeId


		startFlowUiRef.value.handle(f, formItems, selectUserNodeId)


	})
}



const submitProcess = (data) => {



	// startFlow(data).then(res => {
	// 	startFlowUiRef.value.complete(res);
	// })

	let paramMap = data.paramMap;
	paramMap.subProcessStartHandle=false
	paramMap['root_user_task_approve_condition']=true
	var param = {
		paramMap: paramMap,
		taskId: currentOpenFlow.value.taskId,
	  approveResult:true

	};

	completeTask(param).then(res => {
	  startFlowUiRef.value.complete(res);



	  emit("taskSubmitEvent")
	})

}
const emit = defineEmits(["taskSubmitEvent"]);


</script>

<template>
	<div>

		<start-flow-ui @complete="submitProcess" ref="startFlowUiRef"></start-flow-ui>


	</div>
</template>

<style scoped lang="less">

</style>

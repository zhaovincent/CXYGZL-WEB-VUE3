<script setup lang="ts">

import StartFlowUi from './startFlowUI.vue'
import {ref} from "vue";

import {completeTask} from "../../api/task";


const taskId = ref();

const handle = (flowId,taskId,processInstanceId) => {

	taskId.value = taskId;



	startFlowUiRef.value.handle(flowId,taskId,processInstanceId)

}

defineExpose({handle});

const startFlowUiRef = ref();





const submitProcess = (data) => {


	let paramMap = data.paramMap;
	paramMap.subProcessStartHandle=false
	paramMap['root_user_task_approve_condition']=true
	var param = {
		paramMap: paramMap,
		taskId: taskId.value,
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

<script setup lang="ts">

import TaskUIHandle from "./taskUi.vue"


import {
	queryTask
} from "@/api/task";

import {getCurrentInstance} from "vue";


const currentData = ref({});
/**
 * 点击开始处理
 */
const deal = (taskId) => {


	currentData.value.taskId = taskId;


	queryTask(taskId, false).then(res => {
		let data = res.data;
		currentData.value.processInstanceId = data.processInstanceId;
		currentData.value.flowId = data.flowId;
		currentData.value.processName = data.processName;
		currentData.value.nodeName = data.nodeName;
		currentData.value.nodeId = data.nodeId;
		currentData.value.taskExist = data.taskExist;
		currentData.value.starterAvatarUrl = data.starterAvatarUrl;
		currentData.value.starterName = data.starterName;
		currentData.value.startTime = data.startTime;
		currentData.value.processInstanceResult = data.processInstanceResult;


	  taskUiHandler.value.deal(taskId,currentData.value,data.subProcessStarterTask,
				data.taskExist,data.flowId,data.formItems,data.node,data.process,data.frontJoinTask)
	})

}

const {proxy} = getCurrentInstance()



defineExpose({deal});

const taskSubmitEvent = () => {

	emit('taskSubmitEvent')
}



onMounted(() => {

});
const emit = defineEmits(["taskSubmitEvent"]);

const taskUiHandler=ref();

</script>

<template>
	<div >

			<task-u-i-handle  @taskSubmitEvent="taskSubmitEvent" ref="taskUiHandler"></task-u-i-handle>

	</div>
</template>
<style scoped lang="less">

</style>

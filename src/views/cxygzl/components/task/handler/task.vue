<script setup lang="ts">

import TaskUIHandle from "./taskUi.vue"


import {
	queryTask
} from "../../../api/task";


/**
 * 点击开始处理
 */
const deal = (row) => {

	//
	// queryTask(row.taskId, false).then(res => {
	// 	let data = res.data;

	  taskUiHandler.value.deal(row.taskId, row.processInstanceId,row.flowId)
	// })

}




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

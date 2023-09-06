<script setup lang="ts">

import TaskUIHandle from "./taskUi.vue"



/**
 * 点击开始处理
 */
const deal = (row) => {



	  taskUiHandler.value.deal(row.taskId, row.processInstanceId,row.flowId,row.ccId)


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

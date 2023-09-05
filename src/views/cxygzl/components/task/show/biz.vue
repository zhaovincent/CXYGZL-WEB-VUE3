<script setup lang="ts">

import {onMounted, ref} from 'vue'


const taskId = ref();
const flowId = ref();
const processInstanceId = ref();

/**
 * 点击开始处理
 */
const deal = (row) => {

	console.log('任务显示数据', row)

	taskId.value = row.taskId;
	flowId.value = row.flowId;
	processInstanceId.value = row.processInstanceId;


}


defineExpose({deal});

const taskSubmitEvent = () => {

	emit('taskSubmitEvent')
}


onMounted(() => {

});
const emit = defineEmits(["taskSubmitEvent"]);


</script>

<template>
	<div>

	</div>
</template>
<style scoped lang="less">

</style>

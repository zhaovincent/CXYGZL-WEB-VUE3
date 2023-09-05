<script setup lang="ts">
import FlowNodeFormat from "./FlowNodeFormat.vue";
import {formatStartNodeShow} from "../../api/base";
import {defineExpose, onMounted, ref, watch} from "vue";
let props = defineProps({

	flowId: {
		type: String,
		default: ''
	},

	taskId: {
		type: String,
		default: ''
	},
	processInstanceId: {
		type: String,
		default: ''
	}

});
const row = ref([]);
const selectUserNodeIdList = ref([]);
const disableSelect = ref(true);

const queryData = (p) => {
	var data = {
		flowId: props.flowId,
		processInstanceId: props.processInstanceId,
		paramMap: p,
		taskId: props.taskId
	}
	formatStartNodeShow(data).then(res => {
		row.value = res.data.processNodeShowDtoList;
	  disableSelect.value=res.data.disableSelectUser
	  selectUserNodeIdList.value=res.data.selectUserNodeIdList
	})
}

onMounted(() => {

})

const validate = () => {


	for (var k of selectUserNodeIdList.value) {
		var d = nodeUser.value[k]
		if (d && d.length > 0) {

		} else {

		ElMessage.warning("请选择节点执行人");


		return false;
		}
	}

	return true;

}

const nodeUser = ref({})

const formatSelectNodeUser = () => {

	var obj = {}

	for (var k of selectUserNodeIdList.value) {
		var d = nodeUser.value[k]
		obj[k + '_assignee_select'] = d
	}

	return obj;
}

defineExpose({validate, formatSelectNodeUser,queryData});


</script>

<template>

	<flow-node-format :row="row" :node-user="nodeUser" :disableSelect="disableSelect"
										ref="flowNodeFormatRef"></flow-node-format>
</template>

<style scoped lang="less">

</style>

<script setup lang="ts">

import FlowNodeFormat from "../../flow/FlowNodeFormatData.vue";
import SubProcessStartFlow from "../../flow/subProcessStartFlow.vue";


import FormUI from "./formUI.vue";


import HeaderUI from "../show/header.vue";

import OperUI from "../show/oper.vue";


const rightDrawerVisible = ref(false)


/**
 * 点击开始处理
 */
const deal = (tId, pId,  fId,ccId) => {

	taskId.value = tId
	flowId.value = fId
	processInstanceId.value = pId
	copyId.value = ccId


	//////////////////////////////////////////////////////////////////

	// if (taskExist && subProcessStarterTask) {
	//
	// 	//子流程发起人任务
	// 	subProcessStartFlowRef.value.handle(fId, tId, pId)
	// } else {


		rightDrawerVisible.value = true;


	// }


}




import {ref} from "vue";




defineExpose({deal});

const taskSubmitEvent = () => {
	rightDrawerVisible.value = false;

	emit('taskSubmitEvent')
}

//验证表单
function validateForm(f) {
	formUIRef.value.validate(f)
}

const formUIRef=ref();

onMounted(() => {

});
const emit = defineEmits(["taskSubmitEvent"]);


const subProcessStartFlowRef = ref()



const formValueChange = (v) => {


	flowNodeFormatRef.value.queryData(v)

}
const flowNodeFormatRef = ref();
const operUIRef = ref();
const flowId = ref('');
const taskId = ref('');
const copyId = ref();
const processInstanceId = ref('');
</script>

<template>
	<div>

		<!--			右侧抽屉-->
		<el-drawer v-model="rightDrawerVisible" direction="rtl" size="500px">
			<template #header>
				<el-text size="large" tag="b" type="info">流程详情</el-text>
			</template>
			<template #default>
				<el-card style="margin-bottom: 20px">
					<header-u-i :cc-id="copyId" :task-id="taskId" :process-instance-id="processInstanceId" :flow-id="flowId"></header-u-i>
				</el-card>
				<el-card class="box-card">

					<form-u-i :cc-id="copyId" :task-id="taskId" :process-instance-id="processInstanceId" :flow-id="flowId"
										@formValueChange="formValueChange" ref="formUIRef"></form-u-i>


				</el-card>

				<flow-node-format :flow-id="flowId" :task-id="taskId" :process-instance-id="processInstanceId"
													ref="flowNodeFormatRef"></flow-node-format>


			</template>
			<template   #footer>

		  <oper-u-i ref="operUIRef" @taskSubmitEvent="taskSubmitEvent" @validateForm="validateForm" :flow-id="flowId" :task-id="taskId"
					:process-instance-id="processInstanceId"></oper-u-i>
			</template>
		</el-drawer>



		<!--			子流程发起人-->
		<sub-process-start-flow @taskSubmitEvent="taskSubmitEvent" ref="subProcessStartFlowRef"></sub-process-start-flow>
	</div>
</template>
<style scoped lang="less">

</style>

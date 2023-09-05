<script setup lang="ts">

import FlowNodeFormat from "./FlowNodeFormatData.vue";
import {ref} from "vue";


import FormUI from '../task/handler/formUI.vue'

const dialogTableVisible = ref<Boolean>(false);
const formUIRef = ref();
const submitProcess = () => {

	let validate = flowNodeFormatRef.value.validate();


	if (!validate) {
		return;
	}

	let param = flowNodeFormatRef.value.formatSelectNodeUser();


	formUIRef.value.validate(function (valid, fv) {

		if (valid) {

			var data = {
				flowId: flowId.value,
				paramMap: {...param, ...fv}
			}
			emit('complete', data)
		}
	})


}
const emit = defineEmits(["complete"])

const complete = () => {
	dialogTableVisible.value = false
}
const flowId = ref('');
const taskId = ref('');
const processInstanceId = ref('');
const handle = (fId,tId,pId) => {


	flowId.value = fId
	taskId.value = tId
	processInstanceId.value = pId


	dialogTableVisible.value = true

}

defineExpose({handle, complete});



const formValueChange = (v) => {


	flowNodeFormatRef.value.queryData(v)

}


const flowNodeFormatRef = ref();


</script>

<template>
	<div>
		<el-dialog v-model="dialogTableVisible" title="发起流程" width="800px" destroy-on-close>
			<el-row>
				<el-col :span="12">


					<form-u-i :task-id="taskId" :process-instance-id="processInstanceId" :flow-id="flowId" @formValueChange="formValueChange" ref="formUIRef"></form-u-i>

					<div style="text-align: center">
						<el-button @click="dialogTableVisible = false">取消</el-button>
						<el-button type="primary" @click="submitProcess">
							提交
						</el-button>
					</div>
				</el-col>
				<el-col :span="12">
					<flow-node-format   :flow-id="flowId" :task-id="taskId" :process-instance-id="processInstanceId"
														ref="flowNodeFormatRef"></flow-node-format>

				</el-col>
			</el-row>

		</el-dialog>

	</div>
</template>

<style scoped lang="less">

</style>

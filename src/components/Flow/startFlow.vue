<script setup lang="ts">

import FormRender from "@/views/flow/form/render/FormRender.vue";
import FlowNodeFormat from "@/components/Flow/FlowNodeFormatData.vue";
import {defineExpose, ref} from "vue";
import {FormVO} from "@/api/form/types";
import {getFlowDetail, startFlow} from "@/api/flow";

const dialogTableVisible = ref<Boolean>(false);
const currentOpenFlowForm = ref<FormVO[]>([]);
const currentOpenFlow = ref<FormVO[]>([]);
const formRenderRef = ref();
const submitProcess = () => {

	let validate = flowNodeFormatRef.value.validate();
	if (!validate) {
	  ElMessage.warning("请选择节点执行人");

		return;
	}

	let param = flowNodeFormatRef.value.formatSelectNodeUser();

	currentOpenFlowForm.value.forEach(res => param[res.id] = res.props.value)

	var data = {
		flowId: currentOpenFlow.value.flowId,
		paramMap: param
	}
	formRenderRef.value.validate(function (valid) {

		if (valid) {
			startFlow(data).then(res => {
				dialogTableVisible.value = false
			})
		}
	})


}

const handle = (row) => {

	currentOpenFlow.value = row;

	startProcess(row);
}

defineExpose({handle});

const selectUserNodeId = ref<String[]>([]);

const startProcess = (f) => {


	getFlowDetail(f.flowId).then(res => {
		const {data} = res

		const {formItems} = data;

		currentOpenFlowForm.value = JSON.parse(formItems);

		selectUserNodeId.value = data.selectUserNodeId;


		dialogTableVisible.value = true

	})
}

const formValue = computed(() => {
	var obj = {}

	for (var item of currentOpenFlowForm.value) {
		obj[item.id] = item.props.value
	}
	return obj;
})


const flowNodeFormatRef = ref();


</script>

<template>
	<div>
		<el-dialog v-model="dialogTableVisible" title="发起流程" width="800px" destroy-on-close>
			<el-row>
				<el-col :span="12">
					<el-form label-position="top">

						<form-render ref="formRenderRef" :form-list="currentOpenFlowForm"></form-render>

					</el-form>

					<div style="text-align: center">
						<el-button @click="dialogTableVisible = false">取消</el-button>
						<el-button type="primary" @click="submitProcess">
							提交
						</el-button>
					</div>
				</el-col>
				<el-col :span="12">
					<flow-node-format :formData="formValue" :selectUserNodeId="selectUserNodeId" :flow-id="currentOpenFlow.flowId"
														ref="flowNodeFormatRef"></flow-node-format>

				</el-col>
			</el-row>

		</el-dialog>

	</div>
</template>

<style scoped lang="less">

</style>

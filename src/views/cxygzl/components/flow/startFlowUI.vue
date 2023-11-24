<script setup lang="ts">

import FlowNodeFormat from "./FlowNodeFormatData.vue";
import {ref} from "vue";


import FormUI from '../task/handler/formUI.vue'
import {getFormList} from "../../api/form";
import * as util from "../../utils/objutil";

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
const handle = (fId, tId, pId) => {


	flowId.value = fId
	taskId.value = tId
	processInstanceId.value = pId

	getFormList({
		flowId: fId,
		processInstanceId: pId,
		taskId: tId,
		from: 'start'
	}, true).then(res => {
		let data = res.data;
		formUIRef.value.loadData(data, flowId.value, undefined)

	})

	dialogTableVisible.value = true

}

defineExpose({handle, complete});


const formValueChange = (v) => {


	flowNodeFormatRef.value.queryData(v, flowId.value, processInstanceId.value, taskId.value,'start')

}


const flowNodeFormatRef = ref();


</script>

<template>
	<div>
		<el-dialog v-model="dialogTableVisible" title="发起流程" width="800px" destroy-on-close>
			<el-row :gutter="10">
				<el-col :span="12">
          <div style="height: 55vh">
            <el-scrollbar  style="padding-right: 10px;">

              <form-u-i @formValueChange="formValueChange" ref="formUIRef"></form-u-i>


            </el-scrollbar>
          </div>


          <div style="text-align: center;margin-top: 10px;">
            <el-button type="danger" @click="dialogTableVisible = false">取消</el-button>
            <el-button type="primary" @click="submitProcess">
              提交
            </el-button>
          </div>
				</el-col>
				<el-col :span="12">
          <el-scrollbar height="60vh">
					<flow-node-format
							ref="flowNodeFormatRef"></flow-node-format>
          </el-scrollbar>
				</el-col>
			</el-row>

		</el-dialog>

	</div>
</template>

<style scoped lang="less">

</style>

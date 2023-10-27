<script setup lang="ts">

import FormRender from "@/views/flow/form/render/FormRender.vue";
import FlowNodeFormat from "@/components/Flow/FlowNodeFormatData.vue";
import { ref} from "vue";
import {FormVO} from "@/api/form/types";
import {getCurrentInstance} from "vue";

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

	{
		for (var item of currentOpenFlowForm.value) {
			param[item.id] = item.props.value
			if (item.type === 'Layout') {


				let subList = item.props.value;

				var d = []
				for (var array of subList) {
					var v = {}

					for (var subItem of array) {
						let value = subItem.props.value;
						v[subItem.id] = value;
					}
					d.push(v)

				}
				param[item.id] = d;

			}
		}
	}

	var data = {
		flowId: currentOpenFlow.value.flowId,
		paramMap: param
	}
	formRenderRef.value.validate(function (valid) {

		if (valid) {
			// startFlow(data).then(res => {
			// 	dialogTableVisible.value = false
			// })
				emit('complete',data)
		}
	})


}
const emit = defineEmits(["complete"])

const complete=()=>{
	dialogTableVisible.value = false
}

const handle = (row,formIteamJsonArray,t) => {


	currentOpenFlow.value = row;



	for (var fi of formIteamJsonArray) {
		if (fi.type === 'Layout') {
			var arr = [];
			let value = fi.props.value;
			arr.push(value);
			fi.props.value = arr;

      console.log("fi1-----------------",fi)

			 //fi.props.oriForm = proxy.$deepCopy(value);
		}
	}

  console.log("表单:",formIteamJsonArray)

	currentOpenFlowForm.value = formIteamJsonArray;


	selectUserNodeId.value = t;




	dialogTableVisible.value = true

}

defineExpose({handle,complete });

const selectUserNodeId = ref<String[]>([]);



const formValue = computed(() => {

	var obj = {}

	for (var item of currentOpenFlowForm.value) {
		obj[item.id] = item.props.value
	}
	return obj;
})

//明细的添加一个
const addLayoutOneItem = (id) => {

	for (var item of currentOpenFlowForm.value) {
		if (item.id !== id) {
			continue;
		}
		let value = item.props.value;
		let oriForm = item.props.oriForm;
		value.push(proxy.$deepCopy(oriForm));
		item.props.value=value;

	}
}
const deleteLayoutOneItem = (id,index) => {

	for (var item of currentOpenFlowForm.value) {
		if (item.id !== id) {
			continue;
		}

		item.props.value.splice(index,1);

	}
}
const {proxy} = getCurrentInstance()

const flowNodeFormatRef = ref();


</script>

<template>
	<div>
		<el-dialog v-model="dialogTableVisible" title="发起流程" width="800px" destroy-on-close>
			<el-row>
				<el-col :span="12">
					<el-form label-position="top">

						<form-render @addLayoutOneItem="addLayoutOneItem" ref="formRenderRef" @deleteLayoutOneItem="deleteLayoutOneItem"
												 :form-list="currentOpenFlowForm"></form-render>

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

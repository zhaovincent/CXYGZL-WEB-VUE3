<script setup lang="ts">
import FormRender from "@/views/flow/form/render/FormRender.vue";
import ViewProcessInstanceImage from "@/components/Task/ViewProcessInstanceImage.vue";
import AgreeHandle from "./handler/agree.vue"
import RefuseHandle from "./handler/refuse.vue"
import FlowNodeFormat from "@/components/Flow/FlowNodeFormatData.vue";


import {
	queryMineTask,
	queryTask
} from "@/api/task";

import {RoleQuery} from "@/api/role/types";
import {getCurrentInstance} from "vue";

const rightDrawerVisible = ref(false)

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<RoleQuery>({
	pageNum: 1,
	pageSize: 10,
});

const roleList = ref();


const currentData = ref();
/**
 * 点击开始处理
 * @param row
 */
const deal = (row) => {


	currentData.value = row;

	queryTask(row.taskId,false).then(res => {
		currentOpenFlowForm.value = res.data.formItems
		rightDrawerVisible.value = true;
	})

}
const currentOpenFlowForm = ref();
const viewImageRef = ref();
const addLayoutOneItem = (id) => {

	for (var item of currentOpenFlowForm.value) {
		if (item.id !== id) {
			continue;
		}
		let value = item.props.value;
		let oriForm = item.props.oriForm;
		value.push(proxy.$deepCopy(oriForm));
		item.props.value=value;

	}}
const deleteLayoutOneItem = (id,index) => {

	for (var item of currentOpenFlowForm.value) {
		if (item.id !== id) {
			continue;
		}
		item.props.value.splice(index,1);

	}
}
const {proxy} = getCurrentInstance()


/**
 * 点击查看流程图
 */
const viewImage = (row) => {
	viewImageRef.value.view(row)
}

const agreeHandler = ref();
const refuseHandler = ref();

/**
 * 查询
 */
function handleQuery() {
	loading.value = true;
	queryMineTask(queryParams)
			.then(({data}) => {
				roleList.value = data.records;
				total.value = data.total;
			})
			.finally(() => {
				loading.value = false;
			});
}

const taskSubmitEvent=()=>{
	rightDrawerVisible.value=false;
	handleQuery();
}

/**
 * 提交任务
 */
const submitTask = () => {

	agreeHandler.value.handle(currentData.value,currentOpenFlowForm.value);


}
/**
 * 拒绝任务
 */
const refuseTask = () => {

	refuseHandler.value.handle(currentData.value,currentOpenFlowForm.value);


}
onMounted(() => {
	handleQuery();
});

const formValue = computed(() => {
	var obj = {}

	for (var item of currentOpenFlowForm.value) {
		obj[item.id] = item.props.value
	}
	return obj;
})

</script>

<template>
	<div class="app-container">

		<el-card shadow="never">


			<el-table
					ref="dataTableRef"
					v-loading="loading"
					:data="roleList"
					highlight-current-row
					border
			>
				<el-table-column label="分组" prop="groupName" width="100"/>
				<el-table-column label="流程" prop="processName" width="150"/>
				<el-table-column label="发起人" prop="rootUserName" width="150"/>
				<el-table-column label="发起时间" prop="startTime" width="200"/>
				<el-table-column label="当前节点" prop="taskName" width="200"/>
				<el-table-column label="任务时间" prop="taskCreateTime" width="200"/>


				<el-table-column fixed="right" label="操作">
					<template #default="scope">
						<el-button
								type="primary"
								size="small"
								link
								@click="deal(scope.row)"
						>
							<i-ep-position/>
							开始处理
						</el-button>
						<el-button
								type="primary"
								size="small"
								link
								@click="viewImage(scope.row)"
						>
							<i-ep-picture/>
							流程图
						</el-button>

					</template>
				</el-table-column>
			</el-table>

			<pagination
					v-if="total > 0"
					v-model:total="total"
					v-model:page="queryParams.pageNum"
					v-model:limit="queryParams.pageSize"
					@pagination="handleQuery"
			/>
		</el-card>
		<!--			右侧抽屉-->
		<el-drawer v-model="rightDrawerVisible" direction="rtl" size="400px">
			<template #header>
				<h3>{{ currentData?.processName }}</h3>
			</template>
			<template #default>
				<el-card class="box-card">
					<form-render @addLayoutOneItem="addLayoutOneItem" @deleteLayoutOneItem="deleteLayoutOneItem" ref="formRenderRef" :form-list="currentOpenFlowForm"></form-render>

				</el-card>
		  <flow-node-format :disableSelect="true" :formData="formValue" :task-id="currentData.taskId" :processInstanceId="currentData.processInstanceId"  :flow-id="currentData.flowId"
							ref="flowNodeFormatRef"></flow-node-format>


			</template>
			<template #footer>
				<div style="flex: auto">
					<el-button size="large" type="danger" @click="refuseTask">拒绝</el-button>
					<el-button size="large" type="primary" @click="submitTask">提交</el-button>
				</div>
			</template>
		</el-drawer>

		<!--			查看流程图-->
		<view-process-instance-image ref="viewImageRef"/>

		<!--			同意提交处理-->
		<agree-handle @taskSubmitEvent="taskSubmitEvent" ref="agreeHandler"></agree-handle>

		<!--			拒绝审核处理-->
		<refuse-handle @taskSubmitEvent="taskSubmitEvent" ref="refuseHandler"></refuse-handle>
	</div>
</template>

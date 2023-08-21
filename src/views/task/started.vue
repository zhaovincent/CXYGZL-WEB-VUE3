<script setup lang="ts">
import FormRender from "@/views/flow/form/render/FormRender.vue";
import ViewProcessInstanceImage from "@/components/Task/ViewProcessInstanceImage.vue";
import FlowNodeFormat from "@/components/Flow/FlowNodeFormatData.vue";


import {
	queryMineStarted,
	stopProcessInstance
} from "@/api/task";


import {
	detail
} from "@/api/processInstance";

function stop(row){
	stopProcessInstance({
		processInstanceId:row.processInstanceId}).then(res=>{
		handleQuery();
	})
}

import {RoleQuery} from "@/api/role/types";

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
	detail({
	  processInstanceId:row.processInstanceId
	}).then(res=>{
		console.log(res)
	  	currentOpenFlowForm.value = res.data.formItems
	  	rightDrawerVisible.value = true;

	})


}
const currentOpenFlowForm = ref();
const viewImageRef = ref();


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
	queryMineStarted(queryParams)
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
				<el-table-column label="流程" prop="name" width="150"/>
				<el-table-column label="发起时间" prop="createTime" width="200"/>
				<el-table-column label="结束时间" prop="endTime" width="200"/>
					<el-table-column label="状态" prop="taskCreateTime" width="150">
			  <template #default="scope">
				<el-tag v-if="scope.row.status == 1" type="success">进行中</el-tag>
				<el-tag v-else>已结束</el-tag>

			  </template>
					</el-table-column>
					<el-table-column label="审批结果" prop="taskCreateTime" width="150">
			  <template #default="scope">
				<el-tag v-if="scope.row.result===true" type="success">通过</el-tag>
				<el-tag  v-if="scope.row.result===false" type="danger" >拒绝</el-tag>

			  </template>
					</el-table-column>


				<el-table-column fixed="right" label="操作">
					<template #default="scope">
						<el-button
								type="primary"
								size="small"
								link
								@click="deal(scope.row)"
						>
							<i-ep-position/>
							查看
						</el-button>
						<el-button
										:disabled="scope.row.status != 1"
								type="primary"
								size="small"
								link
								@click="stop(scope.row)"
						>
							<i-ep-lock/>
							终止流程
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
				<h3>{{ currentData?.name }}</h3>
			</template>
			<template #default>
				<el-card class="box-card">
					<form-render ref="formRenderRef" :form-list="currentOpenFlowForm"></form-render>

				</el-card>
				<flow-node-format :disableSelect="true" :formData="formValue" :processInstanceId="currentData.processInstanceId"  :flow-id="currentData.flowId"
								  ref="flowNodeFormatRef"></flow-node-format>


			</template>

		</el-drawer>

		<!--			查看流程图-->
		<view-process-instance-image ref="viewImageRef"/>

	</div>
</template>

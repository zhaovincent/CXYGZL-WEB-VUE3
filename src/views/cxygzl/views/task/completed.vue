<script setup lang="ts">
import ViewProcessInstanceImage from "../../components/ViewProcessInstanceImage.vue";


import {
	queryMineEndTask
} from "../../api/task";




import {RoleQuery} from "../../api/role/types";
import TaskHandle from "../../components/task/handler/task.vue";

import pagination from "../../components/pagination.vue";

const loading = ref(false);
const total = ref(0);

const queryParams = reactive<RoleQuery>({
	pageNum: 1,
	pageSize: 10,
});

const roleList = ref();


const taskHandler = ref();
/**
 * 点击开始处理
 * @param row
 */
const deal = (row) => {

	taskHandler.value.deal(row.taskId)




}
const viewImageRef = ref();


/**
 * 点击查看流程图
 */
const viewImage = (row) => {
	viewImageRef.value.view(row)
}


/**
 * 查询
 */
function handleQuery() {
	loading.value = true;
	queryMineEndTask(queryParams)
		.then(({data}) => {
			roleList.value = data.records;
			total.value = data.total;
		})
		.finally(() => {
			loading.value = false;
		});
}



onMounted(() => {
	handleQuery();
});



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
				<el-table-column label="任务名称" prop="taskName" width="200"/>
				<el-table-column label="任务开始时间" prop="taskCreateTime" width="200"/>
				<el-table-column label="任务结束时间" prop="taskEndTime" width="200"/>



				<el-table-column fixed="right" label="操作" width="200">
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

	  <task-handle ref="taskHandler"    ></task-handle>


	  <!--			查看流程图-->
		<view-process-instance-image ref="viewImageRef"/>

	</div>
</template>

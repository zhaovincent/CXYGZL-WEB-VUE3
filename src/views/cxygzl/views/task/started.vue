<script setup lang="ts">
import ViewProcessInstanceImage from "../../components/ViewProcessInstanceImage.vue";
import {ref,reactive,onMounted} from 'vue'

import {
	queryMineStarted
} from "../../api/task";
import {
	stopProcessInstance,urgeProcessInstance,exportDetail
} from "../../api/processInstance";


import pagination from "../../components/pagination.vue";

function stop({processInstanceId}) {
	stopProcessInstance(
		  processInstanceId
	).then(res => {
		handleQuery();
	})
}

/**
 * 催办
 * @param row
 */
function urge(row) {
	currentData.value = row;
	urgDialogVisible.value = true
}

const urgDialogVisible = ref(false);


import {RoleQuery} from "../../api/role/types";
import TaskHandle from "../../components/task/handler/task.vue";
import {isBlank} from "../../utils/objutil";


const loading = ref(false);
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

	taskHandler.value.deal(row)


}
const viewImageRef = ref();


/**
 * 点击查看流程图
 */
const viewImage = (row) => {
	viewImageRef.value.view(row)
}
/**
 * 发起流程
 */
const startFlow = (row) => {
    startRef.value.handle({
				flowId:row.flowId,
				processInstanceId:row.processInstanceId
		})

}

/**
 * 导出详情
 */
const exportDetailF = ({processInstanceId}) => {
	 console.log('导出',processInstanceId)
    exportDetail(processInstanceId).then(res=>{
        window.location.href=res.data;
		})

}


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


const taskHandler = ref();
onMounted(() => {
	handleQuery();
});

const urgeDesc = ref('')
const confirmSubmitUrge = () => {
	if(isBlank(urgeDesc.value)){
		ElMessage.warning("催办意见不能为空")
		return
	}
	urgeProcessInstance({
		processInstanceId: currentData.value.processInstanceId,
		approveDesc: urgeDesc.value,
	}).then(res => {
			urgDialogVisible.value=false
			urgeDesc.value='';

			ElMessage.success("已通知任务处理人尽快处理")
	})
}
const startRef=ref();
import Start from "../../components/flow/startFlow.vue";


</script>

<template>
	<div class="app-container">

	  <start ref="startRef"></start>
		<el-dialog width="500" v-model="urgDialogVisible" title="催办">
			<el-input
					v-model="urgeDesc"
					:rows="5"
					:maxlength="100"
					show-word-limit
					type="textarea"
					placeholder="输入催办意见"
			/>
			<template #footer>
      <span class="dialog-footer">
        <el-button @click="urgDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSubmitUrge">
          确定
        </el-button>
      </span>
			</template>
		</el-dialog>

		<el-card shadow="never">


			<el-table
					ref="dataTableRef"
					v-loading="loading"
					:data="roleList"
					highlight-current-row
					border
			>
				<el-table-column label="分组" prop="groupName" width="100"/>
				<el-table-column label="流程" prop="name" width="200"/>
        <el-table-column label="编码" prop="processInstanceBizCode" width="200"/>

				<el-table-column label="发起时间" prop="createTime" width="160"/>
				<el-table-column label="结束时间" prop="endTime" width="160"/>
				<el-table-column label="状态" prop="taskCreateTime" width="100">
					<template #default="scope">
						<el-tag v-if="scope.row.status == 1" type="success">进行中</el-tag>
						<el-tag v-else-if="scope.row.status == 3" type="danger">已撤销</el-tag>
						<el-tag v-else>已结束</el-tag>

					</template>
				</el-table-column>
				<el-table-column label="审批结果" prop="taskCreateTime" width="100">
					<template #default="scope">
						<el-tag v-if="scope.row.result == 1" type="success">同意</el-tag>
						<el-tag v-else-if="scope.row.result == 2" type="danger">拒绝</el-tag>
						<el-tag v-else-if="scope.row.result == 3" type="warning">撤销</el-tag>


					</template>
				</el-table-column>


				<el-table-column width="420" fixed="right" label="操作">
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


			  						<el-popconfirm @confirm="stop(scope.row)" :width="200" title="确定要撤销此流程吗?">
			  							<template #reference>
						  <el-button
								  :disabled="scope.row.status != 1"
								  type="primary"
								  size="small"
								  link
						  >
							  <i-ep-lock/>
							  撤销流程
						  </el-button>
			  							</template>
			  						</el-popconfirm>


						<el-button
								:disabled="scope.row.status != 1"
								type="primary"
								size="small"
								link
								@click="urge(scope.row)"
						>
							<i-ep-bell/>
							催办
						</el-button>

						<el-button
								type="primary"
								size="small"
								link
								@click="exportDetailF(scope.row)"
						>
							<i-ep-share/>
							导出
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

						<el-button
								type="primary"
								size="small"
								link
								@click="startFlow(scope.row)"
						>
							<i-ep-refresh/>
							重新发起
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


		<task-handle ref="taskHandler" @taskSubmitEvent="handleQuery"></task-handle>

		<!--			查看流程图-->
		<view-process-instance-image ref="viewImageRef"/>

	</div>
</template>
<style scoped>
.f11 {
	width: 70px;
}

.f22 {
	width: calc(100% - 70px);
}

.iconclass {
	width: 80px;
	height: 64px;
	position: absolute;
	top: 0px;
	right: 10px;
}
</style>

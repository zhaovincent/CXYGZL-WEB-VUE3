<script setup lang="ts">
import ViewProcessInstanceImage from "../../components/ViewProcessInstanceImage.vue";


import {
	queryList
} from "../../api/task";

import {
	queryGroupFlowList
} from "../../api/group";
import {
	exportDetail
} from "../../api/processInstance";


import pagination from "../../components/pagination.vue";


import TaskHandle from "../../components/task/handler/task.vue";
import moment from "moment";


const loading = ref(false);
const total = ref(0);

const queryParams = ref({
	pageNum: 1,
	pageSize: 10,
	flowIdList: [],
	status: '',
	starter: '',
	processBizCode: '',
	startTime: [],
	starterList: [],
	finishTime: [],
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
 * 导出详情
 */
const exportDetailF = ({processInstanceId}) => {
	console.log('导出', processInstanceId)
	exportDetail(processInstanceId).then(res => {
		window.location.href = res.data;
	})

}

/**
 * 转交
 * @param r
 */
function handOver(r) {
	console.log(r);
	handOverDialogRef.value.show(r.processInstanceId,r.name);
}

/**
 * 搜索
 */
function search() {
	queryParams.value.pageNum = 1;
	if (queryParams.value.flowIdList.length < 2) {
		ElMessage.warning("请选择流程")
		return
	}

	if (!queryParams.value.startTime || queryParams.value.startTime.length < 2) {
		ElMessage.warning("请选择发起时间")
		return
	}

	handleQuery();


}

/**
 * 查询
 */
function handleQuery() {
	loading.value = true;
	if (isBlank(queryParams.value.starter)) {
		queryParams.value.starterList = [];
	}
	queryList(queryParams.value)
			.then(({data}) => {
				roleList.value = data.records;
				total.value = data.total;
			})
			.finally(() => {
				loading.value = false;
			});
}

const queryFormRef = ref();

/**
 * 重置查询
 */
function resetQuery() {
	queryFormRef.value.resetFields();
	queryParams.value.pageNum = 1;
	handleQuery();
}

const taskHandler = ref();
onMounted(() => {
	let current = moment().format("YYYY-MM-DD");
	let tenDayBefore = moment().subtract(10, 'days').format("YYYY-MM-DD");
	queryParams.value.startTime = [tenDayBefore, current];

	//查询流程
	queryGroupFlowList(false).then(res => {
		let value = res.data;
		for (var k of value) {
			k.flowId = k.id;
		}
		processOptions.value = value;
		//初始化第一条流程
		if (value.length > 0) {
			let v0 = value[0];
			var arr = [];
			arr.push(v0.id);

			let items = v0.items;
			if (items.length > 0) {
				arr.push(items[0].flowId);
				queryParams.value.flowIdList = arr;
				handleQuery();
			}
		}

	});

	// handleQuery();
});

const processOptions = ref([])

const selectStarterDialog = () => {
	selectUserDialogVisible.value = true;
}
const selectUserDialogVisible = ref(false)
const afterSelectUser = (data) => {

	//选择人员变化
	selectUserDialogVisible.value = false;
	queryParams.value.starterList = data;
	if (data.length > 0) {
		queryParams.value.starter = data[0].name
	}
};
import employeesDialog from "../../components/orgselect/employeesDialog.vue";
import {isBlank} from "../../utils/objutil";

import HandOverDialog from "../../components/handOverDialog.vue";

const handOverDialogRef=ref()

</script>

<template>
	<div class="app-container">
			<hand-over-dialog ref="handOverDialogRef"></hand-over-dialog>
		<employees-dialog
				v-model:visible="selectUserDialogVisible"
				:data="queryParams.starterList"
				type="user"
				:multiple="false"
				:selectSelf="true"
				@change="afterSelectUser"
		/>
		<div class="search">
			<el-form ref="queryFormRef" :model="queryParams" :inline="true">
				<el-form-item label="流程名称" required prop="flowIdList">

					<el-cascader :props="{value:'flowId',label:'name',children:'items'}" v-model="queryParams.flowIdList"
											 :options="processOptions"/>
				</el-form-item>

				<el-form-item label="流程状态" prop="status">
					<el-select
							v-model="queryParams.status"
							placeholder="全部"
							clearable
							style="width: 200px"
					>
						<el-option label="进行中" value="1"/>
						<el-option label="已完成" value="2"/>
						<el-option label="已撤销" value="3"/>
					</el-select>
				</el-form-item>
				<el-form-item label="发起人" prop="starter">
					<el-input
							v-model="queryParams.starter"
							placeholder=""
							clearable
							style="width: 200px"
							@click="selectStarterDialog"
							@keyup.enter="search"
					/>

				</el-form-item>

				<el-form-item label="流程编号" prop="processBizCode">

					<el-input
							v-model="queryParams.processBizCode"
							placeholder=""
							clearable
							style="width: 200px"
							@keyup.enter="search"
					/>
				</el-form-item>
				<el-form-item label="发起时间" required prop="startTime">
					<el-date-picker
							v-model="queryParams.startTime"
							type="daterange"
							range-separator="~"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							start-placeholder="请选择日期"
							end-placeholder="请选择日期"

					/>
				</el-form-item>

				<el-form-item label="完成时间" prop="finishTime">
					<el-date-picker
							v-model="queryParams.finishTime"
							type="daterange"
							range-separator="~"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							start-placeholder="请选择日期"
							end-placeholder="请选择日期"

					/>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="search"
					>
						<i-ep-search/>
						搜索
					</el-button
					>
					<el-button @click="resetQuery">
						<i-ep-refresh/>
						重置
					</el-button
					>
				</el-form-item>
			</el-form>
		</div>


		<el-card shadow="never">


			<el-table
					ref="dataTableRef"
					v-loading="loading"
					:data="roleList"
					highlight-current-row
					border
			>
				<el-table-column label="发起人" prop="rootUserName" width="100"/>
				<el-table-column label="流程" prop="name" width="200"/>
				<el-table-column label="编号" prop="processInstanceBizCode" width="200"/>
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
								v-if="scope.row.status == 1"
								@click="handOver(scope.row)"
						>
							<i-ep-edit/>
							转交
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

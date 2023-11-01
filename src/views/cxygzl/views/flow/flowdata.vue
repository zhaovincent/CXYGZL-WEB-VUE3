<script setup lang="ts">

import pagination from "../../components/pagination.vue";
import flowDataComp from "../../components/flow/flowData.vue";


import {
	queryFlowDataList,exportDataList
} from "../../api/flow";

import {
	getLcmArray, isNotBlank
} from "../../utils/objutil";

import {RoleQuery} from "../../api/role/types";


const loading = ref(false);
const total = ref(0);

const queryParams = reactive<RoleQuery>({
	pageNum: 1,
	pageSize: 10,
});

const tempList = ref([]);
const headList = ref([]);


import {LocationQuery, LocationQueryValue, useRoute} from "vue-router";

const route = useRoute();


/**
 * 查询
 */
function handleQuery() {

	const query: LocationQuery = route.query;

	const flowId = (query.flowId as LocationQueryValue) ?? "/";
	queryParams.flowId = flowId;

	loading.value = true;
	queryFlowDataList(queryParams)
			.then(({data}) => {
				headList.value = data.headList;

				tempList.value = data.records;

				total.value = data.total;

			})
			.finally(() => {
				loading.value = false;
			});
}


onMounted(() => {
	handleQuery();
});

const exportData=()=>{


	loading.value = true;
	exportDataList(queryParams)
		.then(({data}) => {
			headList.value = data.headList;

			tempList.value = data.records;

			total.value = data.total;

		})
		.finally(() => {
			loading.value = false;
		});
}



</script>

<template>
	<div class="app-container">

		<el-card shadow="never">

				<el-button @click="exportData" style="margin-bottom: 20px;" type="primary">导出</el-button>

				<flow-data-comp :data-list="tempList" :head-list="headList"></flow-data-comp>


			<pagination
					v-if="total > 0"
					v-model:total="total"
					v-model:page="queryParams.pageNum"
					v-model:limit="queryParams.pageSize"
					@pagination="handleQuery"
			/>
		</el-card>


	</div>
</template>
<style scoped>

</style>

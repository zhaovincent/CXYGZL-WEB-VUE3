<script setup lang="ts">

import pagination from "../../components/pagination.vue";


import {
	queryFlowDataList
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

const roleList = ref([]);
const headList = ref([]);


import {LocationQuery, LocationQueryValue, useRoute} from "vue-router";

const route = useRoute();

const spanArray = ref([]);

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
				roleList.value = []

				var multipleIdArray = [];

				for (var item of data.headList) {
					if (item.type == 'SelectMultiUser' || item.type === 'UploadImage') {
						multipleIdArray.push(item.id);
					}
				}
				var dataRecordIndex = 0;
				for (var item of data.records) {

					var lengthArr = [1, 1];

					for (var k of multipleIdArray) {
						let itemElement = item[k];

						if (isNotBlank(itemElement)) {
							let length = JSON.parse(itemElement).length;
							lengthArr.push(length);
						}

					}

					let lcm = getLcmArray(lengthArr);

					var lcmIndex = 0;

					for (var l = 0; l < lcm; l++) {

						var obj = {}

						var spanColArray = [];


						for (var head of data.headList) {
							let val = item[head.id];
							if (head.type == 'SelectMultiUser' || head.type === 'UploadImage') {

								if (isNotBlank(val)) {
									let jsonVal = JSON.parse(val);
									let length = jsonVal.length;
									//每个值占几个格子
									let number = lcm / length;
									obj[head.id] = jsonVal[Math.floor(lcmIndex / number)]
									if (lcmIndex % number == 0) {
										spanColArray.push({
											rowspan: number,
											colspan: 1
										})
									} else {
										spanColArray.push({
											rowspan: 0,
											colspan: 0
										})
									}
								} else {
									obj[head.id] = {};
									if (lcmIndex == 0) {
										spanColArray.push({
											rowspan: lcm,
											colspan: 1
										})
									} else {
										spanColArray.push({
											rowspan: 0,
											colspan: 0
										})
									}
								}

							} else {
								obj[head.id] = val;

								if (lcmIndex == 0) {
									spanColArray.push({
										rowspan: lcm,
										colspan: 1
									})
								} else {
									spanColArray.push({
										rowspan: 0,
										colspan: 0
									})
								}


							}


						}

						spanArray.value[dataRecordIndex] = spanColArray


						roleList.value.push(obj)
						dataRecordIndex++;
						lcmIndex++;
					}
				}
				total.value = data.total;
			})
			.finally(() => {
				loading.value = false;
			});
}


onMounted(() => {
	handleQuery();
});


const objectSpanMethod = ({
														row,
														column,
														rowIndex,
														columnIndex,
													}) => {

	let spanArrayElement = spanArray.value[rowIndex][columnIndex];

	return spanArrayElement;
}
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
					:span-method="objectSpanMethod"
			>
				<template v-for="(item,index) in headList">
					<template v-if="item.type==='SingleSelect'||item.type==='MultiSelect'">
						<el-table-column :label="item.name" :prop="item.id">
							<template #default="scope">
								{{ JSON.parse(scope.row[item.id]).map(res => res.value).join(",") }}

							</template>
						</el-table-column>

					</template>
					<template v-else-if="item.type==='UploadImage'">
						<el-table-column :label="item.name" :prop="item.id">
							<template #default="scope">

								<el-image style="width: 50px; height: 50px" :src="scope.row[item.id].url"
													fit="contain"/>
							</template>
						</el-table-column>

					</template>
					<template v-else-if="item.type==='UploadFile'">
						<el-table-column :label="item.name" :prop="item.id">
							<template #default="scope">

								<el-link v-for="a in JSON.parse(scope.row[item.id])" style="width: 50px; height: 50px" :href="a.url"
												 target="_blank">{{ a.name }}
								</el-link>
							</template>
						</el-table-column>

					</template>
					<template v-else-if="item.type==='Area'">
						<el-table-column :label="item.name" :prop="item.id">
							<template #default="scope">
								{{ JSON.parse(scope.row[item.id]).name }}
							</template>
						</el-table-column>

					</template>
					<template
							v-else-if="item.type==='SelectMultiUser'||item.type==='SelectMultiDept'||item.type==='SelectUser'||item.type==='SelectDept'">
						<el-table-column :label="item.name" :prop="item.id">
							<template #default="scope">
								<el-tag
										style=" margin-right: 5px;margin-top: 5px;"
										:key="scope.row[item.id].id"
										:closable="false"
										:type="scope.row[item.id].type==='dept'?'primary':(scope.row[item.id].type==='user'?'warning':'success')"
										size="large"
								>
									{{ scope.row[item.id].name }}
								</el-tag>
							</template>
						</el-table-column>

					</template>
					<template v-else>
						<el-table-column :label="item.name" :prop="item.id" width="100"/>

					</template>

				</template>


			</el-table>

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

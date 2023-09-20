<script setup lang="ts">
import {getLcmArray, isNotBlank} from "../../utils/objutil";

import {onMounted, watch, ref} from 'vue'

let props = defineProps({
	dataList: {
		type: Array,
		default: () => [],
	},

	headList: {
		type: Array,
		default: () => [],
	},


});

onMounted(()=>{
	handleSpan()
})



watch(() => props.dataList, (v) => {
	handleSpan()
},{deep:true})

const spanArray = ref([]);

function handleSpan() {

	spanArray.value = [];
	roleList.value = [];

	var multipleIdArray = [];

	for (var item of props.headList) {
		if (item.type == 'SelectMultiUser'
				|| item.type === 'UploadImage'
				|| item.type === 'UploadFile'
				|| item.type === 'SingleSelect'
				|| item.type === 'MultiSelect'
				|| item.type === 'SelectDept'
				|| item.type === 'SelectUser'
				|| item.type === 'SelectMultiDept'
		) {
			multipleIdArray.push(item.id);
		}
	}
	var dataRecordIndex = 0;
	for (var item of props.dataList) {

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


			for (var head of props.headList) {
				let val = item[head.id];
				if (head.type == 'SelectMultiUser'
						|| head.type === 'UploadImage'
						|| head.type === 'UploadFile'
						|| head.type === 'SingleSelect'
						|| head.type === 'MultiSelect'
						|| head.type === 'SelectDept'
						|| head.type === 'SelectUser'
						|| head.type === 'SelectMultiDept'
				) {

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
}

const roleList = ref([])

const objectSpanMethod = ({
														row,
														column,
														rowIndex,
														columnIndex,
													}) => {


	let valueElement = spanArray.value[rowIndex];

	let spanArrayElement = valueElement[columnIndex];

	return spanArrayElement;
}
</script>

<template>

	<el-table
			ref="dataTableRef"

			:data="roleList"
			highlight-current-row
			border
			:span-method="objectSpanMethod"
	>
		<template v-for="(item,index) in headList">
			<template v-if="item.type==='SingleSelect'||item.type==='MultiSelect'">
				<el-table-column :label="item.name" :prop="item.id">
					<template #default="scope">
						{{ scope.row[item.id].value }}

					</template>
				</el-table-column>

			</template>
			<template v-else-if="item.type==='UploadImage'">
				<el-table-column :label="item.name" :prop="item.id">
					<template #default="scope">

						<el-image v-if="isNotBlank(scope.row[item.id].url)" style="width: 50px; height: 50px"
											:src="scope.row[item.id].url"
											fit="contain"/>
						<template v-else></template>
					</template>
				</el-table-column>

			</template>
			<template v-else-if="item.type==='UploadFile'">
				<el-table-column :label="item.name" :prop="item.id">
					<template #default="scope">
						<a :href="scope.row[item.id].url" target="_blank">{{ scope.row[item.id].name }}</a>

					</template>
				</el-table-column>

			</template>
			<template v-else-if="item.type==='Area'">
				<el-table-column :label="item.name" :prop="item.id">
					<template #default="scope">
						{{ scope.row[item.id] ? JSON.parse(scope.row[item.id]).name : '' }}
					</template>
				</el-table-column>

			</template>
			<template
					v-else-if="item.type==='SelectMultiUser'||item.type==='SelectMultiDept'||item.type==='SelectUser'||item.type==='SelectDept'">
				<el-table-column :label="item.name" :prop="item.id">
					<template #default="scope">
						<el-tag v-if="isNotBlank(scope.row[item.id].id)"
										style=" margin-right: 5px;margin-top: 5px;"
										:key="scope.row[item.id].id"
										:closable="false"
										:type="scope.row[item.id].type==='dept'?'primary':(scope.row[item.id].type==='user'?'warning':'success')"
										size="large"
						>
							{{ scope.row[item.id].name }}
						</el-tag>
						<template v-else></template>
					</template>
				</el-table-column>

			</template>
			<template
					v-else-if="item.type==='Layout'">
				<el-table-column :label="item.name" :prop="item.id">
					<template #default="scope">

							<flow-data :head-list="scope.row[item.id].headList" :data-list="scope.row[item.id].dataList"></flow-data>

					</template>
				</el-table-column>

			</template>
			<template v-else>
				<el-table-column :label="item.name" :prop="item.id"  />

			</template>

		</template>


	</el-table>

</template>

<style scoped lang="less">

</style>

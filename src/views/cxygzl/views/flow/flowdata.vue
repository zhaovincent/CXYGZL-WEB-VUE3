<script setup lang="ts">

import pagination from "../../components/pagination.vue";


import {
	queryFlowDataList
} from "../../api/flow";

import {RoleQuery} from "../../api/role/types";


const loading = ref(false);
const total = ref(0);

const queryParams = reactive<RoleQuery>({
	pageNum: 1,
	pageSize: 10,
});

const roleList = ref([]);
const headList = ref([]);




import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";

const route = useRoute();

/**
 * 查询
 */
function handleQuery() {

  const query: LocationQuery = route.query;

  const flowId = (query.flowId as LocationQueryValue) ?? "/";
  queryParams.flowId=flowId;

	loading.value = true;
	queryFlowDataList(queryParams)
		.then(({data}) => {
      headList.value = data.headList;
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
        <template  v-for="(item,index) in headList">
          <template v-if="item.type==='SingleSelect'||item.type==='MultiSelect'">
            <el-table-column  :label="item.name" :prop="item.id"  >
              <template #default="scope">
                {{JSON.parse(scope.row[item.id]).map(res=>res.value).join(",")}}

              </template>
            </el-table-column>

          </template>
          <template v-else-if="item.type==='UploadImage'">
            <el-table-column  :label="item.name" :prop="item.id"  >
              <template #default="scope">

                <el-image v-for="a in JSON.parse(scope.row[item.id])" style="width: 50px; height: 50px" :src="a.url" fit="contain" />
              </template>
            </el-table-column>

          </template>
          <template v-else-if="item.type==='UploadFile'">
            <el-table-column  :label="item.name" :prop="item.id"  >
              <template #default="scope">

                <el-link v-for="a in JSON.parse(scope.row[item.id])" style="width: 50px; height: 50px" :href="a.url" target="_blank" >{{a.name}}</el-link>
              </template>
            </el-table-column>

          </template>
          <template v-else-if="item.type==='Area'">
            <el-table-column  :label="item.name" :prop="item.id" >
              <template #default="scope">
 {{JSON.parse(scope.row[item.id]).name}}
              </template>
            </el-table-column>

          </template>
          <template v-else-if="item.type==='SelectMultiUser'||item.type==='SelectMultiDept'||item.type==='SelectUser'||item.type==='SelectDept'">
            <el-table-column  :label="item.name" :prop="item.id" >
              <template #default="scope">


                <el-tag
                    v-for="(item1, index) in JSON.parse(scope.row[item.id])" style=" margin-right: 5px;margin-top: 5px;"
                    :key="item1.id"
                    :closable="false"
                    :type="item1.type==='dept'?'primary':(item1.type==='user'?'warning':'success')" size="large"
                >
                  {{ item1.name }}
                </el-tag>
              </template>
            </el-table-column>

          </template>
          <template v-else>
            <el-table-column  :label="item.name" :prop="item.id" width="100"/>

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

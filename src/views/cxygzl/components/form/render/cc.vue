<script setup lang="ts">

import {defineExpose, onMounted} from "vue";

onMounted(()=>{
  handleQuery()
})
import {
  queryMineCC
} from "../../../api/task";
const loading = ref(false);
const total = ref(0);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
const roleList = ref();

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  queryMineCC(queryParams)
      .then(({data}) => {
        roleList.value = data.records;
        total.value = data.total;
      })
      .finally(() => {
        loading.value = false;
      });
}
const multipleSelection=ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const dataTableRef=ref()

const  clear=()=>{
  dataTableRef.value!.clearSelection()
}

const  getData=()=>{
  return multipleSelection.value
}
defineExpose({clear,getData});
</script>

<template>
<div>

  <el-table
      ref="dataTableRef"
      v-loading="loading"
      :data="roleList"
      highlight-current-row
      border
      @selection-change="handleSelectionChange"

  >
    <el-table-column type="selection" width="55" />
    <el-table-column label="分组" prop="groupName" width="100"/>
    <el-table-column label="流程" prop="processName" width="150"/>
    <el-table-column label="发起人" prop="startUserName" width="150"/>
    <el-table-column label="发起时间" prop="startTime" width="200"/>
    <el-table-column label="节点" prop="nodeName" width="200"/>
    <el-table-column label="抄送时间" prop="nodeTime" width="200"/>



  </el-table>

  <pagination
      v-if="total > 0"
      v-model:total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="handleQuery"
  />
</div>
</template>

<style scoped lang="less">

</style>

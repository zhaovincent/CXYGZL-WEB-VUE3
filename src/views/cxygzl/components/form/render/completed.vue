<script setup lang="ts">

import {defineExpose, onMounted} from "vue";

onMounted(()=>{
  handleQuery()
})
import {
  queryMineEndTask
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
  queryMineEndTask(queryParams)
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
    <el-table-column label="发起人" prop="rootUserName" width="150"/>
    <el-table-column label="发起时间" prop="startTime" width="200"/>
    <el-table-column label="任务名称" prop="taskName" width="200"/>
    <el-table-column label="任务开始时间" prop="taskCreateTime" width="200"/>



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

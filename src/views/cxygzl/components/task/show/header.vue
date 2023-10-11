<script setup lang="ts">

import {onMounted} from 'vue'
import {ref, defineExpose} from "vue";

import {Check, Plus, Printer} from "@element-plus/icons-vue";
import Print from "./print.vue";


defineExpose({loadData})


function loadData(d) {
    currentData.value=d;
}

const currentData = ref({})

onMounted(() => {

});

const openPrintDialog=()=>{
  console.log(currentData.value)
  printRef.value.show(currentData.value.processInstanceId);
}

const printRef=ref();

</script>

<template>
  <div style="position: relative">

<!--    打印表格-->


    <print ref="printRef"></print>


    <div style="display: flex;flex-direction: row">
      <div class="f11">
        <el-avatar shape="square" :size="50" :src="currentData.starterAvatarUrl">
          {{ currentData?.starterName?.substring(0, 1) }}
        </el-avatar>
      </div>
      <div class="f22">
        <div style="display: flex;flex-direction: row">
          <div class="f01"> <el-text tag="b" size="large" type="primary">{{ currentData?.processName }}</el-text> </div>
          <div class="f02">
            <el-icon @click="openPrintDialog"><Printer /></el-icon>
          </div>

        </div>
        <div>
          <el-text size="small">{{ currentData.startTime }}</el-text>
        </div>
      </div>
    </div>
    <img v-if="currentData.processInstanceResult==1" class="iconclass" src="../../../assets/images/pass.png"/>
    <img v-if="currentData.processInstanceResult==2" class="iconclass" src="../../../assets/images/refuse.png"/>

  </div>

</template>

<style scoped lang="less">
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
@f02_width:30px;

.f01{
  width: calc(100% - @f02_width);
}
.f02{
  width: @f02_width;
  cursor: pointer;
}
</style>

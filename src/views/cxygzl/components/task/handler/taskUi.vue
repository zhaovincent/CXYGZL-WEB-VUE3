<script setup lang="ts">

import FlowNodeFormat from "../../flow/FlowNodeFormatData.vue";
import SubProcessStartFlow from "../../flow/subProcessStartFlow.vue";


import FormUI from "./formUI.vue";


import HeaderUI from "../show/header.vue";

import OperUI from "../show/oper.vue";
import {
  queryHeaderShow
} from "../../../api/base";

import {getFormList} from '../../../api/form'


const rightDrawerVisible = ref(false)
const headerUIRef = ref();


/**
 * 点击开始处理
 */
const deal = (tId, pId, fId, ccId) => {

  taskId.value = tId
  flowId.value = fId
  processInstanceId.value = pId
  copyId.value = ccId


  //////////////////////////////////////////////////////////////////

  // if (taskExist && subProcessStarterTask) {
  //
  // 	//子流程发起人任务
  // 	subProcessStartFlowRef.value.handle(fId, tId, pId)
  // } else {

  queryHeaderShow({
    processInstanceId: pId,
    taskId: tId,
    flowId: fId,
    ccId: ccId
  }).then(res => {
    headerUIRef.value.loadData(res.data);


  });



  getFormList({
    flowId: fId,
    processInstanceId: pId,
    taskId: tId,
    ccId:ccId
  }, true).then(res => {
    let data = res.data;

    for (var fi of data) {
      if (fi.type === 'Layout') {
        var arr = [];
        let value = fi.props.value;
        arr.push(value);
        fi.props.value = arr;
        fi.props.oriForm = util.deepCopy(value);
      }
    }


    formUIRef.value.loadData(data)

    operUIRef.value.handle(tId);
  })

  rightDrawerVisible.value = true;


  // }


}


import {ref} from "vue";
import * as util from "../../../utils/objutil";


defineExpose({deal});

const taskSubmitEvent = () => {
  rightDrawerVisible.value = false;

  emit('taskSubmitEvent')
}

//验证表单
function validateForm(f) {

  let validate = flowNodeFormatRef.value.validate();
  if(!validate){
    f(false)
    return
  }
  let param = flowNodeFormatRef.value.formatSelectNodeUser();


  formUIRef.value.validate(function (a,b) {

    if(param){
      f(a,{...b,...param});

    }else{
      f(a,b);

    }
  })
}

const formUIRef = ref();

onMounted(() => {

});
const emit = defineEmits(["taskSubmitEvent"]);


const subProcessStartFlowRef = ref()


const formValueChange = (v) => {


  flowNodeFormatRef.value.queryData(v,flowId.value,processInstanceId.value,taskId.value)

}
const flowNodeFormatRef = ref();
const operUIRef = ref();
const flowId = ref('');
const taskId = ref('');
const copyId = ref();
const processInstanceId = ref('');
</script>

<template>
  <div>

    <!--			右侧抽屉-->
    <el-drawer v-model="rightDrawerVisible" direction="rtl" size="500px">
      <template #header>
        <el-text size="large" tag="b" type="info">流程详情</el-text>
      </template>
      <template #default>
        <el-card style="margin-bottom: 20px">
          <header-u-i ref="headerUIRef"></header-u-i>
        </el-card>
        <el-card class="box-card">

          <form-u-i
                    @formValueChange="formValueChange" ref="formUIRef"></form-u-i>


        </el-card>

        <flow-node-format
                          ref="flowNodeFormatRef"></flow-node-format>


      </template>
      <template #footer>

        <oper-u-i ref="operUIRef" @taskSubmitEvent="taskSubmitEvent" @validateForm="validateForm" :flow-id="flowId"
                  :task-id="taskId"
                  :process-instance-id="processInstanceId"></oper-u-i>
      </template>
    </el-drawer>


    <!--			子流程发起人-->
    <sub-process-start-flow @taskSubmitEvent="taskSubmitEvent" ref="subProcessStartFlowRef"></sub-process-start-flow>
  </div>
</template>
<style scoped lang="less">

</style>

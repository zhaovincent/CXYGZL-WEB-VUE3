<script setup lang="ts">
import $func from '../../../utils/index'

import CondtionGroup from "../../../components/drawer/components/conditionGroup.vue";
import {ref,computed} from "vue";
import * as util from "../../../utils/objutil";
import {Delete} from "@element-plus/icons-vue";
import getFormName from "../../../utils/getFormValueWidget";

let props = defineProps({

  currentForm: {
    type: Object,
    default: ()=>{}
  },
})

var formConfig=computed({
  get(){

    let c = props.currentForm;
    if(!c.dynamicFormConfig){
        c.dynamicFormConfig={
          list:[{
            value: undefined,

            contentConfig: ''
          }],
          condition:{
            groupRelationMode: true,
            mode: true,
            error: true,
            placeHolder: '',
            groupRelation: [],
            conditionList: []
          }
        }
    }
    return c;
  },
  set(t){
      console.log(t)
  }
})

const getFormWidget = (name: string) => {
  //写的时候，组件的起名一定要与dragList中的element名字一模一样，不然会映射不上
  return getFormName[name];
};

const addOneLine = () => {
  formConfig.value.dynamicFormConfig.list.push({
    value: undefined,

    contentConfig: ''
  })
}

</script>

<template>
<div>
  <el-divider content-position="left">配置条件</el-divider>

  <condtion-group v-model:data="formConfig.dynamicFormConfig.condition"></condtion-group>


  <el-divider content-position="left">配置节点</el-divider>
  <el-row style="width: 100%;" :gutter="20" v-for="(item,index) in formConfig.dynamicFormConfig.list">

    <el-col :span="9">
      <el-select v-model="item.contentConfig" placeholder="选择表单配置项" style="width: 100%">
        <el-option
            v-for="f in formConfig.dynamicForm"
            :key="f.id"
            :label="f.name"
            :value="f.id"
        />
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-form-item>

        <template v-if="item.contentConfig==='value'">
          <component style="width: 100%"
                     :is="getFormWidget(formConfig.type)"
                     :id="formConfig.id"
                     :valueConfig="item"
          ></component>
          
           
        </template>

        <template v-if="item.contentConfig==='perm'">
          <el-select v-model="item.value"    >
            <el-option

                key="H"
                label="隐藏"
                value="H"
            />
            <el-option

                key="E"
                label="编辑"
                value="E"
            />
            <el-option
                key="R"
                label="只读"
                value="R"
            />
          </el-select>
        </template>

        <template v-if="item.contentConfig==='required'">
          <el-switch
              v-model="item.value"
              active-text="必填"
              inactive-text="非必填"
          />
        </template>

        <template v-if="item.contentConfig==='options'">
          选项
        </template>


        <template v-if="item.contentConfig==='min'||item.contentConfig==='max'">

          <el-input-number v-model="item.value"  />

        </template>

        <template v-if="item.contentConfig==='minLength'||item.contentConfig==='maxLength'">

          <el-input-number :min="0" v-model="item.value"  />

        </template>

        <template v-if="item.contentConfig==='radixNum'">

          <el-input-number :min="0" :max="10" v-model="item.value"  />

        </template>

      </el-form-item>

    </el-col>


    <el-col :span="3">
      <el-button v-if="formConfig.dynamicFormConfig.list.length>1" @click="delOneLine('frontNotify','result',index)" text :icon="Delete"></el-button>
    </el-col>
  </el-row>
  <el-button text type="primary" @click="addOneLine" :icon="$icon['Plus']">添加一行
  </el-button>
</div>
</template>

<style scoped lang="less">

</style>

<template>
  <div>

    <el-select
        style="width: 100%"
        controls-position="right"
        v-if="mode==='D'"
        :disabled="true"
        :placeholder="!form?'':form.placeholder"
    />
    <template v-else>
      <el-button @click="showDialog" :disabled="form.perm === 'R'" >选择流程</el-button>
      <related-process-dialog ref="relatedProcessRef"></related-process-dialog>
    </template>

  </div>
</template>
<script lang="ts" setup>
import  RelatedProcessDialog from './render/RelatedProcess.vue'

const relatedProcessRef=ref()
const showDialog=()=>{
  relatedProcessRef.value.show(props.form.name,props.form.props.options);
}

let props = defineProps({

  mode: {
    type: String,
    default: 'D'
  },


  form: {
    type: Object, default: () => {

    }
  },


  formValue: {
    type: Object, default: () => {

    }
  }

});



import * as util from '../../utils/objutil'

import {computed, defineExpose} from "vue";


const getValidateRule = () => {

  var item = props.form;
  var itemProps = item.props


  var checkConfig = (rule: any, value: any, callback: any) => {

    if (item.required) {
      if (!(value)) {
        return callback(new Error("请填写" + item.name))
      }
    }
    if (!(value)) {
      return callback()
    }


    return callback()


  }
  let ruleArray = [{
    validator: checkConfig, trigger: 'blur'
  }];
  console.log('表单校验', item.required, props.form.required)
  if (item.required) {
    ruleArray.push(
        {required: true, message: '请填写' + item.name, trigger: 'blur'}
    )
  }
  return ruleArray


}
defineExpose({getValidateRule});
</script>
<style scoped lang="less"></style>

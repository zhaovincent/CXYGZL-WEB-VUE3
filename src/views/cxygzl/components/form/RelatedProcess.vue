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
      <el-button @click="showSelectDialog" :disabled="form.perm === 'R'" >选择流程</el-button>
      <related-process-dialog @ok="selectFinished" ref="relatedProcessRef"></related-process-dialog>
      <related-process-view-dialog @ok="selectFinished" ref="relatedProcessViewRef"></related-process-view-dialog>
				<template v-for="(item,index) in form.props.value"  >
						<div style="display: flex;flex-direction: row;margin-top: 5px;border: 1px solid lightgray;border-radius: 5px;padding: 5px 10px;background-color: #EEEEEE">
								<div style="width: 80%;font-size: 12px;"><el-link @click="showViewDialog(item.processInstanceId)" >{{ item.processName }}</el-link></div>
								<div v-if="form.perm != 'R'" style="width: 20%;text-align: right;cursor: pointer" @click="delSelectedProcess(index)"><el-icon><Close /></el-icon></div>
						</div>
				</template>
    </template>

  </div>
</template>
<script lang="ts" setup>
import  RelatedProcessDialog from './render/RelatedProcess.vue'
import  RelatedProcessViewDialog from './render/RelatedProcessView.vue'
import {Check, Plus, Close} from "@element-plus/icons-vue";

const relatedProcessRef=ref()
const relatedProcessViewRef=ref()
const showSelectDialog=()=>{
  relatedProcessRef.value.show(props.form.name,props.form.props.options,props.form.props.value);
}

const showViewDialog=(pid)=>{
    relatedProcessViewRef.value.show(pid);

}

const selectFinished=(d)=>{
	props.form.props.value=d;
}
const delSelectedProcess=(d)=>{
	 props.form.props.value.splice(d,1)
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
      if (!(value)||value.length<1) {
        return callback(new Error("请选择" + item.name))
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

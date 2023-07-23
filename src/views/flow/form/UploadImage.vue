<template>
  <div>

      <multi-upload 	 v-if="mode==='D'"
					  :disabled="true"/>
      <multi-upload v-else
					v-model="form.props.value"
										:limit="form.props.maxSize"
					:disabled="form.perm === 'R'"
			/>
  </div>
</template>
<script lang="ts" setup>

import {defineExpose} from "vue";

let props = defineProps({

	mode:{
		type:String,
		default:'D'
	},


	form: {
		type: Object, default: () => {

		}
	}

});




const {proxy} = getCurrentInstance();


const getValidateRule = () => {

	var item = props.form;

	var checkConfig = (rule: any, value: any, callback: any) => {


		if (item.required) {
			if (!value||value.length==0) {
				return callback(new Error("请上传" + item.name))
			}

		}
	  if (!value||value.length==0) {

		  return callback()
		}

	  if (value.length<item.props.min) {
		  return callback(new Error("上传数量不能小于" + item.props.min))
	  }
		return callback()


	}
	let ruleArray = [{
		validator: checkConfig, trigger: 'blur'
	}];
	if (item.required) {
		ruleArray.push(
			{required: true, message: '请上传' + item.name, trigger: 'blur'}
		)
	}
	return ruleArray


}
defineExpose({getValidateRule});
</script>
<style scoped lang="less">

</style>

<template>
	<div>


    <div 	v-if="mode==='D'" style="height: 50px;background-color: lightgrey;text-align: center;line-height: 50px;font-size: 10px;">
        待填写者录入
    </div>

    <template v-else>
      <el-button :disabled="form.perm === 'R'" @click="showDialog">点击签名</el-button>

      <img v-if="isNotBlank(form.props.value)" width="380" :src="form.props.value" />

      <signature-dialog  @signSuccess="signSuccess" ref="signatureDialogRef"></signature-dialog>

    </template>

	</div>
</template>
<script lang="ts" setup>
import {defineExpose,onMounted,ref} from "vue";

import  SignatureDialog from './render/Signature.vue'

const signatureDialogRef=ref();

const showDialog=()=>{
  signatureDialogRef.value.show(props.form.name);
}

const signSuccess=(url)=>{
  console.log("签名成功的图片",url)

  props.form.props.value=url
}


let props = defineProps({

	mode: {
		type: String,
		default: 'D'
	},


	form: {
		type: Object, default: () => {

		}
	}

});
import * as util from '../../utils/objutil'
import {isNotBlank} from "../../utils/objutil";


const getValidateRule = () => {

	var item = props.form;
	var itemProps = item.props


	var checkConfig = (rule: any, value: any, callback: any) => {
		if (item.required) {
			if (util.isBlank(value)) {
				return callback(new Error("请录入" + item.name))
			}
		}
		if (util.isBlank(value)) {
			return callback()
		}


		return callback()


	}
	let ruleArray = [{
		validator: checkConfig, trigger: 'blur'
	}];
	if (item.required) {
		ruleArray.push(
				{required: true, message: '请录入' + item.name, trigger: 'blur'}
		)
	}
	return ruleArray


}
defineExpose({getValidateRule});

</script>
<style scoped lang="less"></style>

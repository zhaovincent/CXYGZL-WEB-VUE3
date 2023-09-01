<template>
	<div>

	  <el-date-picker
					 class="formDate"
			v-if="mode==='D'"
			:disabled="true"
			  type="date"
		   value-format="YYYY-MM-DD"

		:placeholder="!form?'':form.placeholder"

	  />
	  <el-date-picker
		v-else
	class="formDate"
	value-format="YYYY-MM-DD"

	v-model="form.props.value"
	:disabled="form.perm === 'R'"
	:placeholder="form.placeholder"
			  type="date"

	  />


	</div>
</template>
<script lang="ts" setup>
import {defineExpose} from "vue";

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

const getValidateRule = () => {

	var item = props.form;
	var itemProps = item.props


	var checkConfig = (rule: any, value: any, callback: any) => {
		if (item.required) {
			if (util.isBlank(value)) {
				return callback(new Error("请填写" + item.name))
			}
		}
		if (util.isBlank(value)) {
			return callback()
		}

		if (itemProps.min) {
      let minDate = util.momentFunc(itemProps.min,"YYYY-MM-DD");
      let valueDate = util.momentFunc(value,"YYYY-MM-DD");
			if (valueDate.isBefore(minDate)) {
				return callback(new Error("不能小于" + itemProps.min))

			}
		}

		if (itemProps.max) {
      let maxDate = util.momentFunc(itemProps.max,"YYYY-MM-DD");
      let valueDate = util.momentFunc(value,"YYYY-MM-DD");
      if (maxDate.isBefore(valueDate)) {

        return callback(new Error("不能大于" + itemProps.max))

			}
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
<style scoped lang="less">

:deep( .formDate div.el-input__wrapper){
  width: 100% !important;
}
:deep( .formDate){
  width: 100% !important;
}

</style>

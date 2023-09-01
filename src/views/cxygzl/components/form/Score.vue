<template>
	<div>

	  <el-rate  v-if="mode==='D'" v-model="templateValue"

			  :disabled="true" style="width: 100%"
			    size="large" />
	  <el-rate v-else style="width: 100%" v-model="form.props.value" :allow-half="form.props.halfSelect" 	:disabled="form.perm === 'R'"
			  size="large" />
		<el-text size="small" type="info">{{form.placeholder}}</el-text>
	</div>
</template>
<script lang="ts" setup>
const templateValue = ref(3)

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

import {defineExpose,onMounted,computed} from "vue";



const getValidateRule = () => {

	var item = props.form;
	var itemProps = item.props


	var checkConfig = (rule: any, value: any, callback: any) => {

		if (item.required) {
			if (!(value)) {
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
			{required: true, message: '请选择' + item.name, trigger: 'blur'}
		)
	}
	return ruleArray


}
defineExpose({getValidateRule});
</script>
<style scoped lang="less"></style>

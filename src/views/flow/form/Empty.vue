<template>
	<div style="text-align: center;">


	  🍁请点击左侧组件拖拽到此处


	</div>
</template>
<script lang="ts" setup>
import {Check, Plus, Refresh} from "@element-plus/icons-vue";

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
const {proxy} = getCurrentInstance();


const getValidateRule = () => {

	var item = props.form;
	var itemProps = item.props


	var checkConfig = (rule: any, value: any, callback: any) => {
		if (item.required) {
			if (proxy.$isBlank(value)) {
				return callback(new Error("请填写" + item.name))
			}
		}
		if (proxy.$isBlank(value)) {
			return callback()
		}

		if (itemProps.minLength) {
			if (value.length < itemProps.minLength) {
				return callback(new Error("长度不能小于" + itemProps.minLength))

			}
		}

		if (itemProps.maxLength) {
			if (value.length > itemProps.maxLength) {
				return callback(new Error("长度不能大于" + itemProps.maxLength))

			}
		}
		if (proxy.$isNotBlank(itemProps.regex)) {
			let regExp = new RegExp(itemProps.regex);
			if (!regExp.test(value)) {
				return callback(new Error(itemProps.regexDesc))

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
<style scoped lang="less"></style>

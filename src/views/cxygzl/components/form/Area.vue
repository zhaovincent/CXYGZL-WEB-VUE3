<template>
	<div>

	  <el-cascader    v-if="mode==='D'"
					:disabled="true" style="width: 100%"
					:placeholder="!form?'':form.placeholder" />
	  <el-cascader v-else
			  style="width: 100%"
			  :options="dataList"

			  clearable
			  :props="{
			   checkStrictly:false,
			   		value:'code',label:'name'
					 }"
		v-model="areaValue"
		:disabled="form.perm === 'R'"
		:placeholder="form.placeholder"

	  />
	</div>
</template>
<script lang="ts" setup>

import {areaData} from "../../utils/area";


const dataList=areaData;

onMounted(()=>{

})

var areaValue = computed({
	get() {
		return props.form.props.value?.value;
	},
	set(t) {
	  props.form.props.value= getAreaValue(dataList,t);
	}
})

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
import {getAreaValue} from "../../utils/area/area";


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

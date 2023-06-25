<script setup lang="ts">
import getFormName from "../../utils/getFormWidget";
import {defineExpose, onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'

const getFormWidget = (name: string) => {
	//写的时候，组件的起名一定要与dragList中的element名字一模一样，不然会映射不上
	return getFormName[name];
};
const {proxy} = getCurrentInstance();

let props = defineProps({


	formList: {
		type: Object, default: () => {

		}
	}

});

onMounted(() => {
	let formList = props.formList;
	console.log("formList", formList)
	for (var item of formList) {
		let id = item.id;
		if( (proxy.$refs['form' + id])?.length>0){
		let validateRule = (proxy.$refs['form' + id])[0].getValidateRule();


		rules[id] = validateRule;
		}




	}

})

const ruleFormRef = ref();

const rules = reactive<FormRules>({})

const validate = (f) => {
	ruleFormRef.value.validate((valid) => {
		f(valid);
	})
}
defineExpose({validate});

const formValue = computed(() => {
	var obj = {}
	for (var item of props.formList) {
		obj[item.id] = item.props.value
	}
	return obj;
})


</script>

<template>
	<el-form label-position="top"
					 :rules="rules"
					 :model="formValue"
					 ref="ruleFormRef"
	>

			<template  v-for="item in formList">
		  <el-form-item v-if="item.perm!='H'"  :label="item.name+(item.props.unit?'('+item.props.unit+')':'')" :prop="!item?'':item.id" :required="!item?false:item.required">

			  <component style="width: 100%"
						 :is="getFormWidget(item.type)"
						 mode="RUN" :ref="'form'+item.id"
						 :form="item"
			  ></component>
		  </el-form-item>
			</template>


	</el-form>

</template>

<style scoped lang="less">

</style>

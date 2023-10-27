<script setup lang="ts">
import getFormName from "../../../utils/getFormWidget";
import {onMounted, reactive, ref} from 'vue'
import type {FormRules} from 'element-plus'
import {computed} from "vue";

const getFormWidget = (name: string) => {
	//写的时候，组件的起名一定要与dragList中的element名字一模一样，不然会映射不上
	return getFormName[name];
};
const {proxy} = getCurrentInstance();

let props = defineProps({


  index: {
    type: Number,
    default: -1
  },


  formList: {
		type: Object, default: () => {

		}
	}

});

onMounted(() => {
    handleFormRule();
})

const handleFormRule=()=>{

  let formList = props.formList;
  for (var item of formList) {
    let id = item.id;
    if ((proxy.$refs['form' + id])?.length > 0) {
      let validateRule = (proxy.$refs['form' + id])[0].getValidateRule();
      rules[id] = validateRule;
    }
  }
}

const emit = defineEmits(["addLayoutOneItem","deleteLayoutOneItem"])

const addLayoutOneItem=(id)=>{
	emit("addLayoutOneItem",id)
}
const deleteLayoutOneItem=(id,index)=>{
	emit("deleteLayoutOneItem",id,index)
}

const ruleFormRef = ref();

const rules = reactive<FormRules>({})

const validate = (f) => {
	ruleFormRef.value.validate((valid) => {
		f(valid);
	})
}
defineExpose({validate,handleFormRule});

const formValue = computed(() => {
	var obj = {}


	for (var item of props.formList) {
		obj[item.id] = item.props.value
		if (item.type === 'Layout') {
			let subList = item.props.value;

			var d = []
			for (var array of subList) {
				var v = {}



				for (var subItem of array) {
					let value = subItem.props.value;
					v[subItem.id] = value;
				}
				d.push(v)

			}
			obj[item.id] = d;
		}
	}
	return obj;
})


import {useFlowStore} from "../../../stores/flow";

let flowStore = useFlowStore();



watch(()=>formValue.value,(v)=>{
    flowStore.setFormValue(v)
})



</script>

<template>
	<el-form label-position="top"
					 :rules="rules"
					 :model="formValue"
					 ref="ruleFormRef"
	>


		<template v-for="(item,index) in formList">


			<el-form-item v-if="item.perm!='H'" :label="item.name+(item.props.unit?'('+item.props.unit+')':'')"
										:prop="!item?'':item.id" :required="!item?false:item.required">



				<component style="width: 100%" @addLayoutOneItem="addLayoutOneItem" :formValue="formValue"
									 @deleteLayoutOneItem="deleteLayoutOneItem"
									 :is="getFormWidget(item.type)" :index="props.index>=0?props.index:-1"
									 mode="RUN" :ref="'form'+item.id"
									 :form="item"
				></component>
			</el-form-item>
		</template>


	</el-form>

</template>

<style scoped lang="less">

</style>

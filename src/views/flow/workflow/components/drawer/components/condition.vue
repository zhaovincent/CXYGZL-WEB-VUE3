<script setup lang="ts">

import {useFlowStore} from '../../../stores/flow'
import {queryAll} from '@/api/userfield/index'
import {getCurrentInstance, watch} from "vue";
import {areaData} from "@/views/flow/workflow/utils/area";


let flowStore = useFlowStore();


const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
})


const {proxy} = getCurrentInstance();

//表单
const formList = computed(() => {
	let value = step2FormList.value;

	let $deepCopy = proxy.$deepCopy(value.filter(res =>
			res.type != 'MultiSelect' &&
			res.type != 'SelectMultiUser' &&
			res.type != 'SelectMultiDept' &&
			res.type != 'Description' &&
			res.type != 'Layout' &&
			res.type != 'UploadImage' &&
			res.type != 'UploadFile'
	));


	$deepCopy.push({
		id: 'root',
		name: '发起人',
		type: "SelectUser",
		typeName: "用户"
	})

	return $deepCopy;
})
let props = defineProps({
	condition: {
		type: Object,
		default: () => {
		},
	},
});


const formIdObj = computed(() => {
	var obj = {}
	for (var item of formList.value) {
		obj[item.id] = item;
	}
	return obj
})


import selectShow from "@/views/flow/workflow/components/dialog/selectAndShow.vue";

import {conditionExpression} from '../../../utils/const'
import {computed} from "vue";
import {getAreaValue} from "@/utils/area";

var areaList = areaData
var userFieldList = ref([])

onMounted(() => {
	queryAll().then(res => {
		userFieldList.value = res.data.filter(r => r.type != 'MultiSelect');
		userFieldList.value.push({
			key: 'range', type: 'SelectUser', name: '范围'
		})

		props.condition.userKeyFieldList = userFieldList.value;

	})


})
//第一个选项变化了
const firstSelectChangeEvent = () => {
	props.condition.expression = ''
	props.condition.value = undefined
	props.condition.userKey = ''
}
const userKeySelectChangeEvent = () => {
	props.condition.expression = ''
	props.condition.value = undefined
}

//处理第一个选项表单类型
const conditionTypeFirst = computed(() => {
	let type = formIdObj.value[props.condition.key]?.type;

	return type
})
//处理表单值类型
const conditionTypeObj = computed(() => {
	let type = formIdObj.value[props.condition.key]?.type;
	if (type != 'SelectUser') {
		return type;
	}
	if (proxy.$isBlank(props.condition.userKey)) {
		return ''
	}
	let filter = userFieldList.value.filter(res => res.key === props.condition.userKey);
	if (!filter || filter.length == 0) {
		return ''
	}
	return filter[0].type

})
//处理表单选项
const conditionOptionsObj = computed(() => {


	let type = formIdObj.value[props.condition.key]?.type;
	if (type != 'SelectUser') {
		let options = formIdObj.value[props.condition.key].props.options;

		return options;
	}

	if (proxy.$isBlank(props.condition.userKey)) {
		return []
	}

	let props1 = JSON.parse(userFieldList.value.filter(res => res.key === props.condition.userKey)[0].props);
	return props1.options;


})
//处理数字表单精度
const numberFormPrecision = computed(() => {


	let valueElement = formIdObj.value[props.condition.key];
	let type = valueElement?.type;
	if (type != 'SelectUser') {

		return valueElement.props.radixNum;
	}

	if (proxy.$isBlank(props.condition.userKey)) {
		return []
	}

	let props1 = JSON.parse(userFieldList.value.filter(res => res.key === props.condition.userKey)[0].props);
	return props1.radixNum;


})

var areaValue = computed({
	get() {
		return props.condition.value?.value;
	},
	set(t) {
		props.condition.value = getAreaValue(areaList, t);
	}
})

var conditionKey = computed({
	get() {
		return props.condition.key;
	},
	set(key) {
		props.condition.key = key
		if (key === 'root') {
			props.condition.keyType = 'SelectUser'
		} else {
			let ele = step2FormList.value.filter(res => res.id === key);
			if (ele.length > 0) {
				props.condition.keyType = ele[0].type;

			}
		}
	}
})

</script>

<template>
	<div>
		<el-select v-model="conditionKey" @change="firstSelectChangeEvent" placeholder="选择表单" style="width: 100%;">
			<el-option
					v-for="f in formList"
					:key="f.id"
					:label="f.name"
					:value="f.id"
			/>
		</el-select>

		<el-select v-if="conditionTypeFirst==='SelectUser'" @change="userKeySelectChangeEvent" v-model="condition.userKey"
							 placeholder="选择用户属性"
							 style="width: 100%;margin-top: 20px;">
			<el-option
					v-for="f in userFieldList"
					:key="f.key"
					:label="f.name"
					:value="f.key"
			/>
		</el-select>


		<el-select v-model="condition.expression" placeholder="选择关系" style="width: 100%;margin-top: 20px">

			<el-option
					v-for="f in conditionExpression[conditionTypeObj]"
					:key="f.key"
					:label="f.name"
					:value="f.key"
			/>
		</el-select>

		<el-input v-model="condition.value" v-if="conditionTypeObj==='Input'||
conditionTypeObj==='Textarea'
" style="margin-top: 20px;" placeholder="条件值"></el-input>


		<el-input-number v-model="condition.value"
										 v-if="conditionTypeObj==='Money'
										 ||
conditionTypeObj==='Number'			 ||
conditionTypeObj==='Score'
"
										 :precision="numberFormPrecision"
										 placeholder="条件值"
										 style="width: 100%;margin-top: 20px"
										 controls-position="right"
		/>


		<el-date-picker
				value-format="YYYY-MM-DD"
				type="date"
				class="formDate"

				v-model="condition.value"
				v-if="conditionTypeObj==='Date'
"
				placeholder="条件值"
				style="width: 100%;margin-top: 20px"

		/>
		<el-time-picker
				arrow-control
				value-format="HH:mm:ss"


				class="formDate"

				v-model="condition.value"
				v-if="conditionTypeObj==='Time'
"
				placeholder="条件值"
				style="width: 100%;margin-top: 20px"

		/>

		<el-date-picker
				value-format="YYYY-MM-DD HH:mm:ss"
				type="datetime"
				class="formDate"

				v-model="condition.value"
				v-if="conditionTypeObj==='DateTime'
"
				placeholder="条件值"
				style="width: 100%;margin-top: 20px"

		/>

		<el-cascader

				style="width: 100%;margin-top: 20px;"
				:options="areaList"
				v-if="conditionTypeObj==='Area'"

				clearable
				:props="{
			   checkStrictly:true,
			   		value:'code',label:'name'
					 }"
				v-model="areaValue"

		/>
		{{ condition.halfSelect }}


		<el-select v-model="condition.value"
							 v-if="conditionTypeObj==='SingleSelect'
"
							 style="width: 100%;margin-top: 20px"
							 multiple
							 collapse-tags
							 collapse-tags-tooltip

							 placeholder="请选择值">
			<el-option
					v-for="item in conditionOptionsObj"
					:key="item.key"
					:label="item.value"
					:value="item.key"
			/>
		</el-select>
		<div style="margin-top: 20px">
			<select-show v-if="conditionTypeObj==='SelectUser'
" v-model:orgList="condition.value" type="org" :multiple="true"></select-show>
		</div>
		<div style="margin-top: 20px">

			<select-show v-if="conditionTypeObj==='SelectDept'
" v-model:orgList="condition.value" type="dept" :multiple="true"></select-show>
		</div>

	</div>
</template>

<style scoped lang="less">

:deep( .formDate div.el-input__wrapper) {
	width: 100% !important;
}

:deep( .formDate) {
	width: 100% !important;
}
</style>

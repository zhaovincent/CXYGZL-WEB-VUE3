<script setup lang="ts">
import {computed, onMounted} from "vue";

let props = defineProps({
	id: {
		type: String,
		default: "",
	}
});

import {useFlowStore} from "../../workflow/stores/flow";
import {areaData} from "@/views/flow/workflow/utils/area";


import {getAreaValue} from "@/utils/area";

let flowStore = useFlowStore();

var config = computed(() => {
	let step2 = flowStore.step2;
	var idObjList = step2.filter(res => res.id === props.id);
	if (idObjList.length > 0) {
		return idObjList[0];
	}

	let list = step2.filter(res => res.type === 'Layout');
	for (var item of list) {
		let value = item.props.value;
		var valueList = value.filter(res => res.id === props.id);
		if (valueList.length > 0) {
			return valueList[0];
		}
	}

	return undefined;
});

const dataList = areaData;

onMounted(() => {

})

var areaValue = computed({
	get() {
		return config.value.props.value.value;
	},
	set(t) {
	  config.value.props.value= getAreaValue(dataList,t);
	}
})

</script>

<template>
	<div>
		<el-form-item label="默认值">

			<el-cascader
					style="width: 100%"
					:options="dataList"

					clearable
					:props="{
			   checkStrictly:false,
			   		value:'code',label:'name'
					 }"
					v-model="areaValue"

			/>

		</el-form-item>
	</div>
</template>

<style scoped lang="less">

</style>

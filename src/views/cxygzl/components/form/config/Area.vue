<script setup lang="ts">
import {computed, onMounted} from "vue";

let props = defineProps({
	id: {
		type: String,
		default: "",
	}
});

import {useFlowStore} from "../../../stores/flow";

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

onMounted(() => {

})


import ValueCom from './components/value/Area.vue'

</script>

<template>
	<div v-if="config">

		<el-form-item label="默认值">

      <value-com :id="id" :value-config="config.props"></value-com>


    </el-form-item>
	</div>
</template>

<style scoped lang="less">

</style>

<script setup lang="ts">
import {computed, defineExpose} from "vue";

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

</script>

<template>
	<div  v-if="config">
		<el-form-item label="方式">
      <el-radio-group v-model="config.props.lastContent">
        <el-radio :label="true">使用上次签名</el-radio>
        <el-radio :label="false">每次重新签名</el-radio>
      </el-radio-group>
		</el-form-item>


	</div>
</template>

<style scoped lang="less">

</style>

<script setup lang="ts">
import {computed, defineExpose} from "vue";

import FormulaRender from '../render/Formula.vue'

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

const formulaRenderRef = ref();

const toEdit = () => {
	formulaRenderRef.value.show("公式",config.value.props.expList);
}

const configOK = (t) => {
	console.log("配置的公式", t)
	config.value.props.expList = t;
}

</script>

<template>
	<div v-if="config">
		<formula-render @ok="configOK" ref="formulaRenderRef"></formula-render>

		<el-form-item label="单位">
			<el-input v-model="config.props.unit" style="width: 100%" maxlength="10"/>
		</el-form-item>
<!--		<el-form-item label="">-->
<!--      <el-checkbox v-model="config.props.readonly" label="不可编辑" size="large" />-->
<!--		</el-form-item>-->
		<el-form-item label="公式" required>

			<el-button @click="toEdit">点击编辑</el-button>

		</el-form-item>
	  <div style="font-size: 12px;;margin-bottom: 20px;color: red">
					<span v-for="item in config.props.expList">
							{{item.name}}
					</span>
	  </div>

	</div>
</template>

<style scoped lang="less">

</style>

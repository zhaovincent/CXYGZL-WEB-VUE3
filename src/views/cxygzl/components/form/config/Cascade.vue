<script setup lang="ts">
import {computed, defineExpose} from "vue";

let props = defineProps({
	id: {
		type: String,
		default: "",
	},
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

var options = computed(() => {
	return config.value.props.options;
});




const addOption = () => {
	cascadehandleRef.value.show("配置选项",options.value);
};




import CascadeConfigHandle from  '../render/Cascade.vue'
import {deepCopy} from "../../../utils/objutil";
const cascadehandleRef=ref();

const completeOptions=(items)=>{
	config.value.props.options=items;

}
import ValueCom from './components/value/Cascade.vue'

</script>

<template>
	<div v-if="config">

		<el-form-item label="选项" required>
				<cascade-config-handle @ok="completeOptions" ref="cascadehandleRef" ></cascade-config-handle>

			<el-link type="primary" @click.stop="addOption">添加选项</el-link>
		</el-form-item>

		<el-form-item label="默认值">

      <value-com :id="id" :value-config="config.props"></value-com>

		</el-form-item>
	</div>
</template>

<style scoped lang="less">
@f1_width: 150px;
@f3_width: 40px;
.class_option {
	display: flex;
	flex-direction: row;
	width: 100%;

	.f1 {
		width: @f1_width;
	}

	.f2 {
		margin-left: 5px;
		width: calc(100% - @f1_width - @f3_width - 5px);
	}

	.f3 {
		width: @f3_width;
		text-align: center;
		padding-top: 5px;
		height: 35.6px;
	}
}
</style>

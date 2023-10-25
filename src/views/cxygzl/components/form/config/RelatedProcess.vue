<script setup lang="ts">
import {computed, defineExpose,onMounted} from "vue";

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

import {

  queryGroupFlowList

} from "../../../api/group";

const options=ref([])
const selectProps=ref({
  multiple: true
})
onMounted(()=>{
  options.value=[]
  queryGroupFlowList(false).then(res=>{
    console.log(res)
    for(var it1 of res.data){

      let items = it1.items;
      var arr=[]
        for(var it2 of items){
          arr.push({
            label:it2.name,
            value:it2.flowId
          })
        }

        var v1 = {
          label:it1.name,
          value:it1.id,
          children:arr
        }
      options.value.push(v1)
    }
  })
})
</script>

<template>
	<div v-if="config">
		<formula-render @ok="configOK" ref="formulaRenderRef"></formula-render>



		<el-form-item label="指定关联审批单类型"  >

      <el-cascader clearable  style="width: 100%"  placeholder="不设置时默认可选择所有任意类型的审批单"  collapse-tags
                       collapse-tags-tooltip
                       :props="selectProps" v-model="config.props.options" :options="options"   />
		</el-form-item>


	</div>
</template>

<style scoped lang="less">

</style>

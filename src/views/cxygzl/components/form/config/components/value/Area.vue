<script setup lang="ts">
import {computed, defineExpose} from "vue";
import {areaData} from "../../../../../utils/area";
import {getAreaValue} from "../../../../../utils/area/area";

let props = defineProps({
	id: {
		type: String,
		default: "",
	}
  ,
  valueConfig:{
    type:Object,
    dafault:()=>{}
  }
});
const dataList = areaData;

var areaValue = computed({
  get() {
    return props.valueConfig.value.value;
  },
  set(t) {
    props.valueConfig.value= getAreaValue(dataList,t);
  }
})
</script>

<template>
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
</template>

<style scoped lang="less">

</style>

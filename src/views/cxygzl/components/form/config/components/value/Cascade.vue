<script setup lang="ts">
import {computed, defineExpose} from "vue";
import {deepCopy} from "@/views/cxygzl/utils/objutil";

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
var formValue = computed({
  get() {
    let value = props.valueConfig.value;
    return value?.value
  },
  set(t) {
    if(!t){
      props.valueConfig.value = undefined
      return
    }
    let treeData = getTreeData(t[t.length-1],options.value);
    let d = deepCopy(treeData);
    d.value=t;

    var arr=[]
    for(var k of t){
      arr.push(getTreeData(k, options.value).label)
    }
    d.labelList=arr;

    props.valueConfig.value = d
  }
})
var options = computed(() => {
  return props.valueConfig.options;
});

const getTreeData = (key, arr) => {

  for (var item of arr) {

    if (item.key === key) {
      return item;
    }
    let treeData = getTreeData(key, item.children);
    if (treeData) {
      return treeData
    }
  }
  return undefined;
}
</script>

<template>
  <el-cascader clearable style="width: 100%" :props="{value:'key'}" v-model="formValue" :options="options"   />


</template>

<style scoped lang="less">

</style>

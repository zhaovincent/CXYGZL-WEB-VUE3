<script setup lang="ts">
import {computed, defineExpose} from "vue";

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
import selectShow from "../../../../orgselect/selectAndShow.vue";

var defaultValue = computed({
  get: () => {
    return (props.valueConfig.value);
  },
  set: (s: any[]) => {
    props.valueConfig.value = s
  },
});

</script>

<template>
  <select-show
      :disabled="false" v-model:orgList="defaultValue" type="user" :multiple="true"
      :selectSelf="valueConfig.self"></select-show>
</template>

<style scoped lang="less">

</style>

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


</script>

<template>
  <el-rate v-model="valueConfig.value" :allow-half="valueConfig.halfSelect"/>


</template>

<style scoped lang="less">

</style>

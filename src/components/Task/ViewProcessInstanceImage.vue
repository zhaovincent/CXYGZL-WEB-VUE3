<script setup lang="ts">

import {showImage} from '@/api/task/index'

import {defineExpose} from "vue";

const dialogVisible=ref(false);

const view=(row)=>{

	showImage(row.processInstanceId).then(res=>{
	  imgBase64.value='data:image/png;base64,'+res.data


	  dialogVisible.value=true

	})

}
defineExpose({view});


const imgBase64=ref()

</script>

<template>
<div>
	<el-dialog
			v-model="dialogVisible"
			title="查看流程图"
			width="80%"
	>
	  <img :src="imgBase64" style="width: 100%;"/>

	</el-dialog>
</div>
</template>

<style scoped lang="less">

</style>

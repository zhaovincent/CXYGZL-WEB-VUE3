<script setup lang="ts">

import {setWebVersion} from '../../api/base/index'

const version = ref('')
const onSubmit=()=>{
		setWebVersion(version.value).then(res=>{
		ElMessage.success("提交成功！");

		})
}
</script>

<template>
<div style="width: 300px;">
	<el-form  label-width="120px" >
		<el-form-item label="前端版本号">
			<el-input v-model="version" placeholder="2.0.8" />
		</el-form-item>
	  <el-form-item>
		  <el-button type="primary" @click="onSubmit">提交</el-button>

	  </el-form-item>
	</el-form>
</div>
</template>

<style scoped lang="less">

</style>

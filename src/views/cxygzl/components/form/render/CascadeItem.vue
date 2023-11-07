<script setup lang="ts">

import {onMounted, ref} from "vue";

import {isBlank} from "../../../utils/objutil";



const dialogTableVisible = ref(false);

const show = (title1,f) => {

	if(f!=undefined){
		form.value=f;
	}


	title.value = title1;



	dialogTableVisible.value = true;

}


defineExpose({show});


const opened = () => {


}
const close = () => {
	form.value={
	  key:'',
	  label:''
  }
}

const title = ref('')

onMounted(() => {


});
let emits = defineEmits(['ok']);

const confirm = () => {
	let f = form.value;
	if(isBlank(f.key)){
		ElMessage.warning("请输入编码")
		return
	}
	if(isBlank(f.label)){
		ElMessage.warning("请输入名称")
		return
	}

	emits('ok', form.value)
	dialogTableVisible.value = false;
}

 const form = ref({
		 key:'',
	 label:''
 })

</script>

<template>
	<el-dialog :width="300" v-model="dialogTableVisible" @close="close" :title="title" @opened="opened">

		<div class="custom-tree-container">
		<el-form :model="form" label-width="120px">
			<el-form-item label="编码" required>
				<el-input :maxlength="20" v-model="form.key" />
			</el-form-item>
			<el-form-item label="名称" required>
				<el-input :maxlength="20"  v-model="form.label" />
			</el-form-item>
		</el-form>
		</div>
		<template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </span>
		</template>
	</el-dialog>
</template>

<style scoped lang="less">


</style>

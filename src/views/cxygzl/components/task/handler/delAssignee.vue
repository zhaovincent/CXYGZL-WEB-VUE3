<script setup lang="ts">

import {defineExpose} from "vue";
import {delAssigneeTask} from "../../../api/task";
import selectShow from "../../orgselect/selectAndShow.vue";

const dialogVisible = ref(false);


const currentOpenFlowForm = ref();



const  dialogTitle=ref("");

const processInstanceId = ref("");
const taskId = ref("");

const handle = (pid,tid, formData, dialogTitle1) => {
	dialogTitle.value=dialogTitle1;

	currentOpenFlowForm.value = formData;

	processInstanceId.value = pid
	taskId.value = tid

	dialogVisible.value = true;
}

defineExpose({handle});
const emit = defineEmits(["taskSubmitEvent"]);


const submit = () => {

	if(userList.value.length==0){
	  ElMessage.warning("请选择人员");

		return;
	}


	let value = currentOpenFlowForm.value;




	var param = {
		paramMap: value,
		taskId:  taskId.value,

	  targetUserIdList:userList.value.map(res=>res.id),
	  processInstanceId:  processInstanceId.value

	};
  param={...param,...commentContent.value};


	delAssigneeTask(param).then(res => {
		dialogVisible.value = false;


		emit("taskSubmitEvent")
	})
}

const userList=ref([])

const dialogClosed=()=>{
  commentContent.value={}
  userList.value=[]
}


const  commentContent=ref({})

import  CommentHandle from './components/comment.vue'
</script>

<template>
	<div>
		<el-dialog
				v-model="dialogVisible"
				:title="dialogTitle"
				width="400px"
        destroy-on-close
        @closed="dialogClosed"
		>
		<template #header="{ close, titleId, titleClass }">
			<div style="text-align: left;font-size: 20px;font-weight: bold">
				{{ dialogTitle }}
			</div>
		</template>
		<div style="text-align: left">
				<el-text type="primary"  >选择人员</el-text>

		<select-show
				v-model:orgList="userList" :select-self="false" type="user" :multiple="true"></select-show>
		</div>
      <comment-handle :content="commentContent"></comment-handle>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">
          确定
        </el-button>
      </span>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped lang="less">

</style>

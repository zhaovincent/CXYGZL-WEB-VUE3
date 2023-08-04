<script setup lang="ts">

import {defineExpose, getCurrentInstance} from "vue";
import {backJoinTask} from "@/api/task";
import selectShow from "@/views/flow/workflow/components/dialog/selectAndShow.vue";

const dialogVisible = ref(false);

const submitDesc = ref("");


const currentData = ref();
const currentOpenFlowForm = ref();


const  nodeId=ref("");
const  process=ref("");
const  dialogTitle=ref("");

const {proxy} = getCurrentInstance()


const handle = (row, formData,n,p,dialogTitle1) => {

	dialogTitle.value=dialogTitle1;

	currentData.value = row;
	currentOpenFlowForm.value = formData;
	nodeId.value=n
	process.value=p

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



	var formData = {}
	for (var item of value) {
		formData[item.id] = item.props.value;

	  if (item.type === 'Layout') {


		  let subList = item.props.value;

		  var d = []
		  for (var array of subList) {
			  var v = {}

			  for (var subItem of array) {
				  let value = subItem.props.value;
				  v[subItem.id] = value;
			  }
			  d.push(v)

		  }
		  formData[item.id] = d;

	  }
	}


	var param = {
		paramMap: formData,
		taskId: currentData.value.taskId,
	  nodeId: nodeId.value,
	  approveDesc:submitDesc.value,
	  targetUserId:userList.value[0].id,
	  processInstanceId: currentData.value.processInstanceId


	};

	console.log(param)

	backJoinTask(param).then(res => {
		dialogVisible.value = false;


		emit("taskSubmitEvent")
	})
}

const userList=ref([])


</script>

<template>
	<div>
		<el-dialog
				v-model="dialogVisible"
				:title="dialogTitle"
				width="400px"

		>

				<el-text type="primary"  >选择人员</el-text>

		<select-show
				v-model:orgList="userList" type="user" :multiple="false"></select-show>

			<el-input

							style="margin-top: 20px;"

			  v-model="submitDesc"
							type="textarea"
								maxlength="100"
								:rows="5"
								placeholder="审核意见"
								show-word-limit/>
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

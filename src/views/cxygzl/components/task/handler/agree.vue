<script setup lang="ts">

import {defineExpose} from "vue";
import {completeTask, resolveTask} from "../../../api/task";

const dialogVisible = ref(false);

const submitDesc = ref("");

const frontJoinTask = ref(false);
const formValue = ref();
const dialogTitle = ref("");
const processInstanceId = ref("");
const taskId = ref("");

const handle = (pid, tid,  formData, dt, dialogTitle1) => {
	dialogTitle.value = dialogTitle1;
	frontJoinTask.value = dt;

	formValue.value = formData;

	processInstanceId.value = pid
	taskId.value = tid

	dialogVisible.value = true;
}

defineExpose({handle});
const emit = defineEmits(["taskSubmitEvent"]);


const submit = () => {
	var param = {
		paramMap: formValue.value,
		approveResult: true,
		processInstanceId: processInstanceId.value,
		approveDesc: submitDesc.value,
		taskId: taskId.value

	};

	if (frontJoinTask.value) {
		//前加签
		resolveTask(param).then(res => {
			dialogVisible.value = false;


			emit("taskSubmitEvent")
		})
	} else {
		completeTask(param).then(res => {
			dialogVisible.value = false;


			emit("taskSubmitEvent")
		})
	}

}

</script>

<template>
	<div>
		<el-dialog
				v-model="dialogVisible"
				:title="dialogTitle"
				width="400px"

		>
			<el-input

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

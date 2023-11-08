<script setup lang="ts">

import {queryTaskListInProgress} from '../api/processInstance/index'
import {setAssigneeByAdmin} from '../api/task/index'

const visible = ref(false);
const processInstanceId = ref()
const processName = ref();

const taskList = ref([])
const show = (pid, name) => {
	processInstanceId.value = pid
	processName.value = name;
	queryTaskListInProgress(pid).then(res => {
		console.log(res)

		let data = res.data;
		if (data.length < 1) {
			ElMessage.warning("暂无待办任务，无法转交")
			return
		}
		for(var it of data){
			it.checked=false
		}
		taskList.value = data;
		visible.value = true;

	})
}

import selectShow from "./orgselect/selectAndShow.vue";

const toUser=ref([])

defineExpose({show})

const confirm=()=>{
		let list = taskList.value.filter(r=>r.checked);


    setAssigneeByAdmin({
        taskDtoList:list,user:toUser.value[0],processInstanceId:processInstanceId.value
		}).then(res=>{
				visible.value=false;
		})
}

const closed = () => {
  toUser.value=[]
}

</script>

<template>
	<el-dialog
					@closed="closed"
			v-model="visible"
			:title="'转交['+processName+']'"
			width="800"
			align-center
	>
		<el-row :gutter="20">
			<el-col :span="12">
					<div style="border: 1px solid lightgrey;padding: 10px 5px;min-height: 100px;">
							<h3>
									选择任务
							</h3>
			  <div v-for="item in taskList">

				  <el-checkbox v-model="item.checked" :label="item.userName+' - '+item.taskName" size="large" />

			  </div>
					</div>

			</el-col>
			<el-col :span="12">
		  <div style="border: 1px solid lightgrey;padding: 10px 5px;min-height: 100px;">
		  <h3>
			  选择任务执行人
		  </h3>
		  <select-show
				  v-model:orgList="toUser" type="user" :multiple="false"></select-show>

			</div>
			</el-col>
		</el-row>
		<template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
						确定
        </el-button>
      </span>
		</template>
	</el-dialog>

</template>

<style scoped lang="less">

</style>

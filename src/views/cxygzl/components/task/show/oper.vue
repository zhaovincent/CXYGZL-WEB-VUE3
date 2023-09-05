<script setup lang="ts">

import {ArrowDown} from "@element-plus/icons-vue";

import {ref, onMounted} from 'vue'
import DelAssigneeHandle from "../handler/delAssignee.vue";
import BackJoinHandle from "../handler/backJoin.vue";
import RefuseHandle from "../handler/refuse.vue";
import FrontJoinHandle from "../handler/frontJoin.vue";
import AgreeHandle from "../handler/agree.vue";
import AddAssigneeHandle from "../handler/addAssignee.vue";
import RejectHandle from "../handler/reject.vue";
import {queryTask} from "../../../api/task";

const delegationTask = ref(false);
let props = defineProps({

	flowId: {
		type: String,
		default: ''
	},

	taskId: {
		type: String,
		default: ''
	},
	processInstanceId: {
		type: String,
		default: ''
	}

});

onMounted(() => {
	queryTask(props.taskId, true).then(res => {

		let data = res.data;
		nodeId.value = data.nodeId;
		process.value = data.process;
	  let parse = JSON.parse(data.node);
	  if (parse.operList) {
		  operList.value = parse.operList?.filter(res => res.checked);

	  }
	  process.value = JSON.parse(data.process)

	})
})

const nodeId = ref();
const process = ref();

/**
 * 提交任务
 */
const submitTask = (name,fv) => {


	agreeHandler.value.handle(props.processInstanceId, props.taskId, fv, delegationTask.value, name);


}

/**
 * 前加签
 */
const frontJoinTask = (name,fv) => {

	frontJoinHandler.value.handle(props.processInstanceId, props.taskId, fv, name);

}
/**
 * 加签
 */
const addAssigneeTask = (name,fv) => {

	addAssigneeHandler.value.handle(props.processInstanceId, props.taskId, fv, name);

}
/**
 * 减签
 */
const delAssigneeTask = (name,fv) => {

	delAssigneeHandler.value.handle(props.processInstanceId, props.taskId, fv, name);

}
/**
 * 后加签
 */
const backJoinTask = (name,fv) => {

	backJoinHandler.value.handle(props.processInstanceId, props.taskId, fv, name);


}
/**
 * 驳回
 */
const rejectTask = (name,fv) => {

	rejectHandler.value.handle(props.processInstanceId, props.taskId, fv, nodeId.value, process.value, name);


}
/**
 * 拒绝任务
 */
const refuseTask = (name,fv) => {


	refuseHandler.value.handle(props.processInstanceId, props.taskId,fv, name);


}


const operList = ref([]);
const executeOperMethod = (op) => {

	emit('validateForm', function (valid,fv) {
		if (valid) {

			let name = operList.value.filter(res => res.key === op)[0].name;

			if (op === 'frontJoin') {
				frontJoinTask(name,fv);
				return
			}
			if (op === 'backJoin') {
				backJoinTask(name,fv);
				return
			}
			if (op === 'reject') {
				rejectTask(name,fv);
				return
			}
			if (op === 'refuse') {
				refuseTask(name,fv);
				return
			}
			if (op === 'pass') {
				submitTask(name,fv);
				return
			}
			if (op === 'addAssignee') {
				addAssigneeTask(name,fv);
				return
			}
			if (op === 'delAssignee') {
				delAssigneeTask(name,fv);
				return
			}
		}
	})

}
const emit = defineEmits(["taskSubmitEvent", "validateForm"]);


const taskSubmitEvent = () => {


	emit('taskSubmitEvent')
}


const agreeHandler = ref();
const refuseHandler = ref();
const rejectHandler = ref();
const frontJoinHandler = ref();
const addAssigneeHandler = ref();
const delAssigneeHandler = ref();
const backJoinHandler = ref();
</script>

<template>
	<div>

		<!--			同意提交处理-->
		<agree-handle @taskSubmitEvent="taskSubmitEvent" ref="agreeHandler"></agree-handle>

		<!--			拒绝审核处理-->
		<refuse-handle @taskSubmitEvent="taskSubmitEvent" ref="refuseHandler"></refuse-handle>

		<!--			驳回-->
		<reject-handle @taskSubmitEvent="taskSubmitEvent" ref="rejectHandler"></reject-handle>
		<!--			前加签-->
		<front-join-handle @taskSubmitEvent="taskSubmitEvent" ref="frontJoinHandler"></front-join-handle>
		<!--			加签-->
		<add-assignee-handle @taskSubmitEvent="taskSubmitEvent" ref="addAssigneeHandler"></add-assignee-handle>
		<!--			减签-->
		<del-assignee-handle @taskSubmitEvent="taskSubmitEvent" ref="delAssigneeHandler"></del-assignee-handle>
		<!--			后加签-->
		<back-join-handle @taskSubmitEvent="taskSubmitEvent" ref="backJoinHandler"></back-join-handle>

		<div style="flex: auto">

			<template v-if="delegationTask">
				<el-button size="large" color="#9933FF" @click="executeOperMethod('pass')">
					完成
				</el-button>
			</template>
			<template v-else>

				<template v-if="operList.length>2">

					<el-dropdown style="margin-right: 20px" @command="executeOperMethod">
						<el-button :dark="true">
							更多
							<el-icon class="el-icon--right">
								<arrow-down/>
							</el-icon>
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>

								<template v-for="(item,index) in operList">

									<el-dropdown-item :command="item.key" :icon="$icon[item.icon]" v-if="index>1">{{ item.name }}
									</el-dropdown-item>
								</template>

							</el-dropdown-menu>
						</template>
					</el-dropdown>

					<template v-for="(item,index) in operList">
						<!--									{{item}}-->
						<el-button v-if="index<=1" :type="item.type" :dark="true" @click="executeOperMethod(item.key)">
							{{ item.name }}
						</el-button>
					</template>
				</template>

				<template v-else>
					<template v-for="(item,index) in operList">
						<el-button :type="item.type" :dark="true" @click="executeOperMethod(item.key)">
							{{ item.name }}
						</el-button>
					</template>
				</template>

			</template>

		</div>

	</div>
</template>

<style scoped lang="less">

</style>
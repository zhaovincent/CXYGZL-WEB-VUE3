<script setup lang="ts">
import FormRender from "@/views/flow/form/render/FormRender.vue";
import AgreeHandle from "./agree.vue"
import RefuseHandle from "./refuse.vue"
import RejectHandle from "./reject.vue"
import FrontJoinHandle from "./frontJoin.vue"
import BackJoinHandle from "./backJoin.vue"
import FlowNodeFormat from "@/components/Flow/FlowNodeFormatData.vue";
import SubProcessStartFlow from "@/components/Flow/subProcessStartFlow.vue";


import {
	queryTask
} from "@/api/task";

import {getCurrentInstance} from "vue";
import {ArrowDown, Plus} from '@element-plus/icons-vue'

const rightDrawerVisible = ref(false)
const operList = ref([])


const currentData = ref({});
/**
 * 点击开始处理
 */
const deal = (taskId) => {


	currentData.value.taskId = taskId;


	queryTask(taskId, false).then(res => {
		let data = res.data;
		currentData.value.processInstanceId = data.processInstanceId;
		currentData.value.flowId = data.flowId;
		currentData.value.processName = data.processName;
		currentData.value.nodeName = data.nodeName;
		currentData.value.nodeId = data.nodeId;
		currentData.value.taskExist = data.taskExist;
		currentData.value.starterAvatarUrl = data.starterAvatarUrl;
		currentData.value.starterName = data.starterName;
		currentData.value.startTime = data.startTime;
		if (data.subProcessStarterTask && data.taskExist) {

			//子流程发起人任务
			subProcessStartFlowRef.value.handle(data.flowId, taskId)
		} else {
			currentOpenFlowForm.value = data.formItems
			let parse = JSON.parse(data.node);
			if (parse.operList) {
				operList.value = parse.operList?.filter(res => res.checked);

			}
			nodeId.value = parse.id;
			process.value = JSON.parse(data.process)

			rightDrawerVisible.value = true;

			delegationTask.value = data.delegationTask;
		}


	})

}

//是否是前加签
const delegationTask = ref(false);

const currentOpenFlowForm = ref();
const addLayoutOneItem = (id) => {

	for (var item of currentOpenFlowForm.value) {
		if (item.id !== id) {
			continue;
		}
		let value = item.props.value;
		let oriForm = item.props.oriForm;
		value.push(proxy.$deepCopy(oriForm));
		item.props.value = value;

	}
}
const deleteLayoutOneItem = (id, index) => {

	for (var item of currentOpenFlowForm.value) {
		if (item.id !== id) {
			continue;
		}
		item.props.value.splice(index, 1);

	}
}
const {proxy} = getCurrentInstance()


const agreeHandler = ref();
const refuseHandler = ref();
const rejectHandler = ref();
const frontJoinHandler = ref();
const backJoinHandler = ref();


defineExpose({deal});

const taskSubmitEvent = () => {
	rightDrawerVisible.value = false;

	emit('taskSubmitEvent')
}

/**
 * 提交任务
 */
const submitTask = (name) => {

	formRenderRef.value.validate(function (valid) {

		if (valid) {

			agreeHandler.value.handle(currentData.value, currentOpenFlowForm.value, delegationTask.value,name);

		}
	})


}
/**
 * 拒绝任务
 */
const refuseTask = (name) => {

	formRenderRef.value.validate(function (valid) {

		if (valid) {
			refuseHandler.value.handle(currentData.value, currentOpenFlowForm.value,name);
		}
	})

}

const nodeId = ref('');
const process = ref({});
const formRenderRef = ref();
/**
 * 驳回
 */
const rejectTask = (name) => {
	formRenderRef.value.validate(function (valid) {

		if (valid) {
			rejectHandler.value.handle(currentData.value, currentOpenFlowForm.value, nodeId.value, process.value,name);
		}
	});


}
/**
 * 前加签
 */
const frontJoinTask = (name) => {
	formRenderRef.value.validate(function (valid) {

		if (valid) {
			frontJoinHandler.value.handle(currentData.value, currentOpenFlowForm.value, nodeId.value, process.value,name);
		}
	});
}
/**
 * 后加签
 */
const backJoinTask = (name) => {
	formRenderRef.value.validate(function (valid) {

				if (valid) {
					backJoinHandler.value.handle(currentData.value, currentOpenFlowForm.value, nodeId.value, process.value,name);
				}
			}
	)
	;

}

onMounted(() => {

});
const emit = defineEmits(["taskSubmitEvent"]);

const formValue = computed(() => {
	var obj = {}

	for (var item of currentOpenFlowForm.value) {
		obj[item.id] = item.props.value
	}
	return obj;
})
const subProcessStartFlowRef = ref()

const executeOperMethod = (op) => {

	let name = operList.value.filter(res=>res.key===op)[0].name;

	if (op === 'frontJoin') {
		frontJoinTask(name);
		return
	}
	if (op === 'backJoin') {
		backJoinTask(name);
		return
	}
	if (op === 'reject') {
		rejectTask(name);
		return
	}
	if (op === 'refuse') {
		refuseTask(name);
		return
	}
	if (op === 'pass') {
		submitTask(name);
		return
	}
}

</script>

<template>
	<div class="app-container">

		<!--			右侧抽屉-->
		<el-drawer v-model="rightDrawerVisible" direction="rtl" size="500px">
			<template #header>
				<el-text size="large" tag="b" type="info">流程详情</el-text>
			</template>
			<template #default>
					<el-card style="margin-bottom: 20px">
							<div style="display: flex;flex-direction: row">
									<div class="f11">
                    <el-avatar shape="square" :size="50" :src="currentData.starterAvatarUrl" >{{currentData.starterName.substring(0,1)}}</el-avatar>
									</div>
									<div class="f22">
											<div><el-text tag="b" size="large" type="primary">{{ currentData?.processName }}</el-text> </div>
											<div><el-text size="small">{{ currentData.startTime }}</el-text></div>
									</div>
							</div>
					</el-card>
				<el-card class="box-card">
					<form-render @addLayoutOneItem="addLayoutOneItem" @deleteLayoutOneItem="deleteLayoutOneItem"
											 ref="formRenderRef" :form-list="currentOpenFlowForm"></form-render>

				</el-card>
				<flow-node-format :disableSelect="true" :formData="formValue" :task-id="currentData.taskId"
													:processInstanceId="currentData.processInstanceId" :flow-id="currentData.flowId"
													ref="flowNodeFormatRef"></flow-node-format>


			</template>
			<template v-if="currentData.taskExist" #footer>
				<div style="flex: auto">

					<template v-if="delegationTask">
						<el-button size="large" color="#9933FF" @click="submitTask('完成任务')">
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
			</template>
		</el-drawer>


		<!--			同意提交处理-->
		<agree-handle @taskSubmitEvent="taskSubmitEvent" ref="agreeHandler"></agree-handle>

		<!--			拒绝审核处理-->
		<refuse-handle @taskSubmitEvent="taskSubmitEvent" ref="refuseHandler"></refuse-handle>

		<!--			驳回-->
		<reject-handle @taskSubmitEvent="taskSubmitEvent" ref="rejectHandler"></reject-handle>
		<!--			前加签-->
		<front-join-handle @taskSubmitEvent="taskSubmitEvent" ref="frontJoinHandler"></front-join-handle>
		<!--			后加签-->
		<back-join-handle @taskSubmitEvent="taskSubmitEvent" ref="backJoinHandler"></back-join-handle>

		<!--			子流程发起人-->
		<sub-process-start-flow @taskSubmitEvent="taskSubmitEvent" ref="subProcessStartFlowRef"></sub-process-start-flow>
	</div>
</template>
<style scoped lang="less">
	.f11{
		width: 70px;
	}
	.f22{
		width: calc(100% - 70px);
	}
</style>

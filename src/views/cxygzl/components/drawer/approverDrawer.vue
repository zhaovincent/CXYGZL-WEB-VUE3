<template>
	<el-drawer :append-to-body="true" v-model="visible" :show-close="false" :size="550"
						 @open="openEvent"
						 :before-close="saveApprover">
		<!--			标题-->
		<template #header="{ close, titleId, titleClass }">

			<el-text style="cursor: pointer" v-if="!input" tag="b" size="large" @click="titleTextClickEvent">
				{{ approverConfig.nodeName }}
				<el-icon>
					<EditPen/>
				</el-icon>

			</el-text>
			<el-input

					ref="titleInputRef"

					@blur="titleInputBlurEvent"

					maxlength="10"

					v-if="input" v-model="approverConfig.nodeName"></el-input>

		</template>


		<el-tabs type="border-card">
			<el-tab-pane label="设置审批人">

        <user-config :approver-config="approverConfig"></user-config>


				<template
						v-if="
						approverConfig.assignedType===4

">

					<h4>选择方式</h4>
					<el-radio-group v-model="approverConfig.multiple" class="ml-4">
						<el-radio :label="false" size="large">单选</el-radio>
						<el-radio :label="true" size="large">多选</el-radio>
					</el-radio-group>
				</template>
				<template v-if="(
					(approverConfig.multiple===true&&	approverConfig.assignedType===4)||
				(approverConfig.assignedType===1)||
				(approverConfig.assignedType===9)||
				(approverConfig.assignedType===10)||
				(approverConfig.assignedType===3)||
				(approverConfig.assignedType===7&&approverConfig.deptLeaderLevel>1)||
				(approverConfig.assignedType===8)
				)
				&&(approverConfig.assignedType!=5&&approverConfig.assignedType!=2)">

					<h4>多人审批时采用的审批方式</h4>
					<el-radio-group v-model="approverConfig.multipleMode" class="ml-4">
						<p style="display: block;width: 100%">
							<el-radio :label="1" size="large">会签(默认需要所有审批人同意)</el-radio>

						</p>
						<p style="display: block;width: 100%">
							<el-radio :label="2" size="large">或签(一名审批人同意即可)</el-radio>
						</p>
						<p style="display: block;width: 100%">


							<el-radio :label="3" size="large">依次审批(按顺序依次审批)</el-radio>
						</p>
					</el-radio-group>
					<el-form v-if="approverConfig.multipleMode==1" label-width="180px">
						<el-form-item label="会签审核通过比例(%)">
							<el-input-number v-model="approverConfig.completeRate" :min="1" :precision="2" value-on-clear="max"
															 controls-position="right" :max="100"/>

						</el-form-item>
					</el-form>
				</template>



				<template v-if="approverConfig.sameAsStarter?.handler&&approverConfig.assignedType!=11">
					<h4>审批人包含发起人时（审批人可能是多个）</h4>
					<el-radio-group v-model="approverConfig.sameAsStarter.handler">

						<el-radio style="width: 50%" label="TO_CONTINUE" size="large">发起人继续处理</el-radio>
						<el-radio style="width: 30%" label="TO_PASS" size="large">发起人不用处理</el-radio>

						<el-radio style="width: 50%" label="TO_DEPT_LEADER" size="large">转交给发起人部门主管处理</el-radio>
						<el-radio style="width: 30%" label="TO_ADMIN" size="large">转交给管理员处理</el-radio>


					</el-radio-group>
				</template>

				<template v-if="approverConfig.assignedType!=11">
					<h4>审批人为空时</h4>
					<el-radio-group v-model="approverConfig.nobody.handler" class="ml-4">
						<el-radio label="TO_PASS" size="large">自动通过</el-radio>
						<!--					<el-radio label="TO_END" size="large">自动结束</el-radio>-->
						<el-radio label="TO_REFUSE" size="large">自动拒绝</el-radio>
						<el-radio label="TO_ADMIN" size="large">转交给管理员</el-radio>
						<el-radio label="TO_USER" size="large">指定人员</el-radio>
					</el-radio-group>
					<select-show v-if="approverConfig.nobody.handler==='TO_USER'"
											 v-model:orgList="approverConfig.nobody.assignedUser" type="user"
											 :multiple="false"></select-show>
				</template>

				<template v-if="approverConfig.refuse?.handler">
					<h4>审批被拒绝</h4>
					<el-radio-group v-model="approverConfig.refuse.handler" class="ml-4">
						<el-radio label="TO_END" size="large">直接结束流程</el-radio>
						<el-radio label="TO_NODE" size="large">驳回到指定节点</el-radio>
					</el-radio-group>
					<el-select v-if="approverConfig.refuse.handler==='TO_NODE'" v-model="approverConfig.refuse.nodeId"
										 placeholder="驳回节点" style="width: 100%;margin-bottom: 20px;">
						<el-option
								v-for="item in rejectNodeList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
						/>
					</el-select>
				</template>

				<template v-if="approverConfig.needSignature!=undefined">
					<h4>是否需要签名</h4>
			<el-switch
					v-model="approverConfig.needSignature"
					size="large"
					active-text="需要"
					inactive-text="不需要"
			/>
				</template>

			</el-tab-pane>
			<el-tab-pane label="操作权限">
				<ul>
					<li>
						<el-row>
							<el-col :span="12">
								<el-text tag="b">权限名字</el-text>
							</el-col>
							<el-col :span="12">
								<el-text tag="b">按钮名字</el-text>
							</el-col>
						</el-row>
					</li>
					<li v-for="(item,index) in approverConfig.operList">
						<el-row>
							<el-col :span="12">
								<el-checkbox v-model="item.checked" size="large">
									{{ item.defaultName }}
								</el-checkbox>
							</el-col>
							<el-col :span="12">
								<el-text v-if="!item.edit" @click="clickOperBtnName(item,index)">
									{{ item.name }}
									<el-icon>
										<EditPen/>
									</el-icon>
								</el-text>
								<template v-else>
									<el-input :id="'btnNameRef'+index" @blur="operInputBlur(item)" v-model="item.name"
														placeholder="请输入按钮名字"/>
								</template>
							</el-col>
						</el-row>


					</li>

				</ul>


			</el-tab-pane>
			<el-tab-pane label="表单权限">

				<form-perm :form-perm="approverConfig.formPerms"></form-perm>


			</el-tab-pane>

			<el-tab-pane label="动态表单">
				<dynamic-form-config :config="approverConfig"></dynamic-form-config>


			</el-tab-pane>

		</el-tabs>


	</el-drawer>
</template>

<script setup type="ts">


import {Check, Plus, EditPen} from "@element-plus/icons-vue";

import {ref, watch, computed, reactive, nextTick} from 'vue'
import $func from '../../utils/index'
import {placeholderList, setTypes} from '../../utils/const'
import {useStore} from '../../stores/index'
import {useFlowStore} from '../../stores/flow'

import * as util from '../../utils/objutil'

import DynamicFormConfig from "./components/dynamicFormConfig.vue";

import UserConfig from './components/userConfig.vue'

var rejectNodeList = computed(() => {

	//驳回节点列表
	let values = []
	const excType = [0, 1]

	var arr = {}
	var obj = {}


	produceSerialNodeList(undefined, flowStore.step3, arr, obj, true)


	var k = arr[approverConfig.value.id];

	if (k == undefined) {
		return []
	}

	for (var item of k) {
		var type = obj[item].type;
		// if(type===5||type===8){
		// 	values=[];
		// }
		if (excType.indexOf(type) > -1 && obj[item].id != approverConfig.value.id) {
			values.push({id: obj[item].id, name: obj[item].nodeName})
		}
	}


	return values
})


function produceSerialNodeList(parentId, process, nodeArr, nodeObj, noBranch) {


	if (!util.isNode(process)) {
		return;
	}


	var nodeId = process.id;

	nodeObj[nodeId] = process;


	if (!util.isNotBlank(parentId)) {
		var arr = []
		arr.push(nodeId)
		nodeArr[nodeId] = arr;
	} else {
		var p = nodeArr[parentId];

		let parentType = nodeObj[parentId].type;

		if ((parentType == 5 || parentType == 8) && !noBranch) {

			nodeArr[nodeId] = [];
		} else {
			var arr1 = util.deepCopy(p);
			arr1.push(nodeId)
			nodeArr[nodeId] = arr1;
		}

	}


	var type = process.type;

	var children = process.childNode;

	if (type === 5 || type === 8 || type === 4) {

		var branchs = process.conditionNodes;


		for (var item of branchs) {

			produceSerialNodeList(nodeId, item, nodeArr, nodeObj, false)

		}

		if (util.isNode(children)) {

			produceSerialNodeList(nodeId, children, nodeArr, nodeObj, true)

		}

	} else {
		if (util.isNode(children)) {
			produceSerialNodeList(nodeId, children, nodeArr, nodeObj, true)
		}
	}

}


let flowStore = useFlowStore();

const input = ref(false)

import FormPerm from './components/formPerm.vue'

const clickOperBtnName = (item, index) => {

	item.edit = true;

	nextTick(() => {
		document.getElementById("btnNameRef" + index)?.focus();

	})


}
let defaultText = computed(() => {
	return placeholderList[approverConfig.value.type]
});
const titleInputRef = ref()
const titleTextClickEvent = () => {
	input.value = true
	nextTick(() => {
		titleInputRef.value.focus()
	})
}
const titleInputBlurEvent = () => {

	input.value = false
	approverConfig.value.nodeName = approverConfig.value.nodeName || defaultText

};
const operInputBlur = (item) => {

	item.edit = false;
	if (util.isBlank(item.name)) {
		item.name = item.defaultName
	}
}

const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
})



const openEvent = () => {
	let value = step2FormList.value;
	var arr = {};
	let formPerms = approverConfig.value.formPerms;

	for (var item of value) {
		arr[item.id] = "R"
		if (item.type === 'Layout') {
			arr[item.id] = "E"
		}
		if (formPerms[item.id]) {
			arr[item.id] = formPerms[item.id]
		}
		if (item.type === 'Layout') {
			let value1 = item.props.value;
			for (var it of value1) {
				arr[it.id] = "R"
				if (formPerms[it.id]) {
					arr[it.id] = formPerms[it.id]
				}
			}
		}
	}
	approverConfig.value.formPerms = arr;
}

import selectShow from "../orgselect/selectAndShow.vue";


let approverConfig = ref({})


let store = useStore()
let {setApproverConfig, setApprover} = store
let approverConfigData = computed(() => store.approverConfigData)
let approverDrawer = computed(() => store.approverDrawer)
let visible = computed({
	get() {
		return approverDrawer.value
	},
	set() {
		closeDrawer()
	}
})
watch(approverConfigData, (val) => {
	approverConfig.value = val.value
})






const saveApprover = () => {

	approverConfig.value.error = !$func.checkApproval(approverConfig.value);
	setApproverConfig({
		value: approverConfig.value,
		flag: true,
		id: approverConfigData.value.id
	})
	closeDrawer()
}
const closeDrawer = () => {
	setApprover(false)
}
</script>
<style lang="less" scoped>
</style>

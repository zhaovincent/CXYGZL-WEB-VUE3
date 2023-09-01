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
				<el-radio-group v-model="approverConfig.assignedType" @change="assignedTypeChangeEvent" class="ml-4">
					<el-row>
						<el-col :span="8" v-for="({value, label}) in setTypes" :key="value">
							<el-radio :label="value">{{ label }}</el-radio>
						</el-col>
					</el-row>
				</el-radio-group>


				<template v-if="approverConfig.assignedType===3">
					<h4>选择角色</h4>

					<select-show v-model:orgList="approverConfig.nodeUserList" type="role" :multiple="true"></select-show>

				</template>
				<template v-if="approverConfig.assignedType===1">
					<h4>选择成员</h4>

					<select-show v-model:orgList="approverConfig.nodeUserList" type="org" :multiple="true"></select-show>

				</template>
				<template v-if="approverConfig.assignedType===8">
					<h4>人员控件</h4>
					<el-select v-model="formUserIdComputed" clearable class="m-2" placeholder="请选择审批表单"
										 size="large">
						<el-option
								v-for="item in step2FormUserList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
						/>
					</el-select>
				</template>
				<template v-if="approverConfig.assignedType===9">
					<h4>部门控件</h4>
					<el-select v-model="formDeptIdComputed" clearable class="m-2" placeholder="请选择审批表单"
										 size="large">
						<el-option
								v-for="item in step2FormDeptList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
						/>
					</el-select>

			<el-radio-group v-model="approverConfig.deptUserType" class="ml-4">
				<el-radio label="allUser" size="large">部门人员</el-radio>
				<el-radio label="leader" size="large">部门主管</el-radio>
			</el-radio-group>

				</template>
				<template v-if="approverConfig.assignedType===10">
					<h4>选择部门</h4>
			<select-show v-model:orgList="approverConfig.nodeUserList" type="dept" :multiple="true"></select-show>

				</template>
				<template v-if="approverConfig.assignedType===7">

					<h4>审批终点</h4>
					<span style="font-size: 14px;margin-right: 5px;">到第</span>
					<el-input-number v-model="approverConfig.deptLeaderLevel" :step="1" :min="1" :max="20" step-strictly
													 size="small"/>
					<span style="font-size: 14px;margin-left: 5px;">级部门主管终止</span>
				</template>
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
				<template v-if="approverConfig.assignedType===2">

					<h4>指定审批层级</h4>
					<span style="font-size: 14px;margin-right: 5px;">第</span>
					<el-input-number v-model="approverConfig.deptLeaderLevel" :step="1" :min="1" :max="20" step-strictly
													 size="small"/>
					<span style="font-size: 14px;margin-left: 5px;">级部门主管</span>
				</template>


				<template v-if="approverConfig.sameAsStarter?.handler">
					<h4>审批人与发起人是同一人时</h4>
					<el-radio-group v-model="approverConfig.sameAsStarter.handler">

						<el-radio style="width: 30%" label="TO_CONTINUE" size="large">继续处理</el-radio>
						<el-radio style="width: 30%" label="TO_PASS" size="large">自动通过</el-radio>

						<el-radio style="width: 30%" label="TO_DEPT_LEADER" size="large">转交给部门负责人处理</el-radio>
						<el-radio style="width: 30%" label="TO_ADMIN" size="large">转交给管理员处理</el-radio>


					</el-radio-group>
				</template>

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

		</el-tabs>


	</el-drawer>
</template>

<script setup type="ts">


import {Check, Plus, EditPen} from "@element-plus/icons-vue";

import {ref, watch, computed, onMounted, nextTick} from 'vue'
import $func from '../../utils/index'
import {placeholderList, setTypes} from '../../utils/const'
import {useStore} from '../../stores/index'
import {useFlowStore} from '../../stores/flow'
import {ElTable} from 'element-plus'


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


	if (!proxy.$isNode(process)) {
		return;
	}


	var nodeId = process.id;

	nodeObj[nodeId] = process;


	if (!proxy.$isNotBlank(parentId)) {
		var arr = []
		arr.push(nodeId)
		nodeArr[nodeId] = arr;
	} else {
		var p = nodeArr[parentId];

		let parentType = nodeObj[parentId].type;

		if ((parentType == 5 || parentType == 8) && !noBranch) {

			nodeArr[nodeId] = [];
		} else {
			var arr1 = proxy.$deepCopy(p);
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

		if (proxy.$isNode(children)) {

			produceSerialNodeList(nodeId, children, nodeArr, nodeObj, true)

		}

	} else {
		if (proxy.$isNode(children)) {
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
	if (proxy.$isBlank(item.name)) {
		item.name = item.defaultName
	}
}

const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
})

const step2FormUserList = computed(() => {


	return step2FormList.value.filter(res => res.type === 'SelectUser' || res.type === 'SelectMultiUser');
})

const step2FormDeptList = computed(() => {


	return step2FormList.value.filter(res => res.type === 'SelectDept' || res.type === 'SelectMultiDept');
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

import selectShow from "@/views/flow/workflow/components/dialog/selectAndShow.vue";

const {proxy} = getCurrentInstance();


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
//用户表单是否是多选
const isMultiUserForm = (id) => {
	if (proxy.$isBlank(id)) {
		return false
	}
	let t = step2FormUserList.value.filter(res => res.id === id)[0].props.multi;
	return t;
}

var formUserIdComputed = computed({
	get() {
		return approverConfig.value.formUserId;
	},
	set(val) {
		approverConfig.value.formUserName = step2FormUserList.value.filter(res => res.id === val)[0].name
		approverConfig.value.formUserId = val

	}
})


var formDeptIdComputed = computed({
	get() {
		return approverConfig.value.formUserId;
	},
	set(val) {
		approverConfig.value.formUserId = val
		approverConfig.value.formUserName = step2FormDeptList.value.filter(res => res.id === val)[0].name

	}
})


//审批人类型变化
const assignedTypeChangeEvent = (e) => {
	approverConfig.value.nodeUserList = [];
	approverConfig.value.formUserId = ''
	approverConfig.value.formUserName = ''
}

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

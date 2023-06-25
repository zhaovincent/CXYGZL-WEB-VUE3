<template>
	<el-drawer :append-to-body="true" title="审批人设置" v-model="visible" :show-close="false" :size="550"
						 @open="openEvent"
						 :before-close="saveApprover">

		<el-tabs type="border-card">
			<el-tab-pane label="设置审批人">
				<el-radio-group v-model="approverConfig.assignedType" class="ml-4">
					<el-row>
						<el-col :span="8" v-for="({value, label}) in setTypes" :key="value">
							<el-radio :label="value">{{ label }}</el-radio>
						</el-col>
					</el-row>
				</el-radio-group>

				<el-divider/>
				<template v-if="approverConfig.assignedType===1">
					<h4>添加成员</h4>

					<select-show v-model:orgList="approverConfig.nodeUserList" type="user" :multiple="true"></select-show>

				</template>
				<template v-if="approverConfig.assignedType===8">
					<h4>人员控件</h4>
					<el-select v-model="approverConfig.formUserId" clearable  class="m-2" placeholder="请选择审批表单" size="large">
						<el-option
								v-for="item in step2FormUserList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
						/>
					</el-select>
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
				(approverConfig.assignedType===1&&approverConfig.nodeUserList.length>1)||
				(approverConfig.assignedType===7&&approverConfig.deptLeaderLevel>1)||
				(approverConfig.assignedType===8&&isMultiUserForm(approverConfig.formUserId))
				)
				&&(approverConfig.assignedType!=5&&approverConfig.assignedType!=2)">

					<h4>多人审批时采用的审批方式</h4>
					<el-radio-group v-model="approverConfig.multipleMode" class="ml-4">
						<p style="display: block;width: 100%">
							<el-radio :label="1" size="large">会签(需要所有审批人同意)</el-radio>

						</p>
						<p style="display: block;width: 100%">
							<el-radio :label="2" size="large">或签(一名审批人同意即可)</el-radio>
						</p>
						<p style="display: block;width: 100%">


							<el-radio :label="3" size="large">依次审批(按顺序依次审批)</el-radio>
						</p>
					</el-radio-group>
				</template>
				<template v-if="approverConfig.assignedType===2">

					<h4>指定审批层级</h4>
					<span style="font-size: 14px;margin-right: 5px;">第</span>
					<el-input-number v-model="approverConfig.deptLeaderLevel" :step="1" :min="1" :max="20" step-strictly
													 size="small"/>
					<span style="font-size: 14px;margin-left: 5px;">级部门主管</span>
				</template>

				<el-divider/>

				<h4>审批人为空时</h4>
				<el-radio-group v-model="approverConfig.nobody.handler" class="ml-4">
					<el-radio label="TO_PASS" size="large">自动通过</el-radio>
					<el-radio label="TO_END" size="large">自动结束</el-radio>
					<el-radio label="TO_ADMIN" size="large">转交给管理员</el-radio>
					<el-radio label="TO_USER" size="large">指定人员</el-radio>
				</el-radio-group>
				<select-show v-if="approverConfig.nobody.handler==='TO_USER'" v-model:orgList="approverConfig.nobody.assignedUser" type="user"
										 :multiple="false"></select-show>

			</el-tab-pane>
			<el-tab-pane label="表单权限">

					<div style="display: flex;flex-direction: row;background-color: var(--el-fill-color-light)" effect="dark">
							<div class="f1">表单字段</div>
							<div class="f2">只读</div>
							<div class="f3">编辑</div>
							<div class="f4">隐藏</div>
					</div>

					<div v-if="step2FormList.length==0">
			  <el-empty description="暂无表单" />
					</div>
					<div style="display: flex;flex-direction: row;" v-for="item in step2FormList">
			  <div class="f1">	<span v-if="item.required" style="color: #c75450"> * </span>
			<span>{{ item.name }}</span></div>
			  <el-radio-group v-model="approverConfig.formPerms[item.id]" size="large"  >


							<div class="f2"> <el-radio size="large" label="R"  ><span></span></el-radio></div>
							<div class="f3"><el-radio size="large" label="E" ><span></span></el-radio></div>
							<div class="f4"><el-radio size="large" label="H"  ><span></span></el-radio></div>
		</el-radio-group>

		  </div>

			</el-tab-pane>
		</el-tabs>


	</el-drawer>
</template>
<script setup type="ts">
import {ref, watch, computed, onMounted} from 'vue'
import $func from '../../utils/index'
import {setTypes, selectModes, selectRanges} from '../../utils/const'
import {useStore} from '../../stores/index'
import {useFlowStore} from '../../stores/flow'
import { ElTable } from 'element-plus'
let flowStore = useFlowStore();


const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
})

const step2FormUserList = computed(() => {


	return step2FormList.value.filter(res => res.type === 'SelectUser');
})

const  openEvent=()=>{
	let value = step2FormList.value;
	var arr={};
	let formPerms = approverConfig.value.formPerms;

	for(var item of value){
		arr[item.id]="R"
			if(formPerms[item.id]){
				arr[item.id]=formPerms[item.id]
			}
	}
	approverConfig.value.formPerms=arr;
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
//监听用户选择表单值变化
watch(() => approverConfig.value.formUserId, (val) => {
	approverConfig.value.multiple = false
	approverConfig.value.multipleMode = 1
	if (proxy.$isNotBlank(val)) {
		approverConfig.value.formUserName = step2FormUserList.value.filter(res => res.id === val)[0].name

	}


})


const saveApprover = () => {
	let approverStr = $func.setApproverStr(approverConfig.value);


	approverConfig.value.error =proxy.$isBlank(approverStr)||(approverConfig.value.nobody.handler==='TO_USER'&&approverConfig.value.nobody.assignedUser.length==0)
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
@width2:80px;
@width3:80px;
@width4:80px;

.f1{
	width: calc(100% - @width2 - @width3 - @width4);
  padding: 10px;
}
.f2{
	width: @width2;
  padding: 10px;

}
.f3{
	width: @width3;
  padding: 10px;

}
.f4{
	width: @width4;
  padding: 10px;

}
</style>

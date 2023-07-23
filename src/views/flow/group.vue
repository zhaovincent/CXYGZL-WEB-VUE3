<template>
	<div class="app-container">
		<div style="width: 80%;margin-left: 10%;text-align: right;margin-bottom: 20px">
			<el-button class="button" @click="addOneGroupShow">新建分组</el-button>
			<el-button class="button" @click.stop="toCreateFlow(undefined)" type="primary" :icon="Plus">创建流程</el-button>
		</div>
		<el-card class="box-card" v-if="addGroupCardShow">
			<div class="item additem" style="height: 40px">
				<div style="height: 40px;line-height: 40px">
					<el-input ref="addGroupRef" :key="addGroupKey" maxlength="20" minlength="2" v-model="addGroupName"
							  @blur.stop="addGroupInputBlur"
							  placeholder="分组名称"   clearable/>

				</div>
				<div class="last">
					<el-tooltip
							class="box-item"
							effect="dark"
							content="删除"
							placement="top"

					>
						<el-button text :icon="Delete" circle @click.stop="deleteAddGroup"/>
					</el-tooltip>
				</div>
			</div>
		</el-card>
		<el-card class="box-card" v-for="item in successGroupList">
			<template #header>
				<div class="card-header">
					<span>{{ item.name }}</span>
					<span>
			  <el-tooltip

				class="box-item"
				effect="dark"
				content="创建流程"
				placement="top"
		>
			  <el-button @click.stop="toCreateFlow(item.id)" text :icon="Plus" circle/>
				</el-tooltip>
			  <el-tooltip

				class="box-item"
				effect="dark"
				content="删除"
				placement="top"
		>
			  <el-button text :icon="Delete" @click.stop="deleteGroup(item.id)"  circle :disabled="item.items?.length>0"/>
				</el-tooltip>
						</span>

				</div>
			</template>
			<div v-for="(flow,index1) in item.items" :key="index1" class="item">
				<div>
					<el-avatar shape="square" :size="50"
							   :src="flow.logo"/>
				</div>
				<div style="margin-left: 20px;width: 200px;" v-if="flow.remark?.length>0">
					<div>{{ flow.name }}  <el-tag v-if="flow.stop" type="danger">已停用</el-tag></div>
					<div>{{flow.remark}}</div>
				</div>
				<div style="margin-left: 20px;width: 200px;" v-else>
					<div style="height: 60px;line-height: 60px;">{{ flow.name }}  <el-tag v-if="flow.stop" type="danger">已停用</el-tag></div>
				</div>
				<div style="margin-left: 50px;height: 60px;line-height: 60px;width: 250px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
					{{flow.updated}}
				</div>
				<div style="margin-left: 50px;height: 60px;line-height: 60px;width: 300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
					{{(flow.rangeShow&&flow.rangeShow.length>0)?flow.rangeShow:'所有人'}}
				</div>
				<div class="last">
					<el-tooltip
							class="box-item"
							effect="dark"
							content="编辑"
							placement="top"
					>
						<el-button text @click="toEditFlow(flow)" :icon="Edit" circle/>
					</el-tooltip>
					<el-tooltip
							class="box-item"
							effect="dark"
							content="复制"
							placement="top"
					>
						<el-button text @click="toCopyFlow(flow)"  :icon="DocumentCopy" circle/>
					</el-tooltip>

			  <el-tooltip v-if="!flow.stop"
					  class="box-item"
					  effect="dark"
					  content="停用"
					  placement="top"
			  >
						<el-button @click="showDisableConfirm(flow)" text :icon="Hide" circle/>
		</el-tooltip>

			  <el-tooltip v-else
					  class="box-item"
					  effect="dark"
					  content="启用"
					  placement="top"
			  >
						<el-button @click="showEnableConfirm(flow)" text :icon="View" circle/>
		</el-tooltip>


					<el-tooltip
							class="box-item"
							effect="dark"
							content="删除"
							placement="top"
					>
						<el-button text @click="showDeleteConfirm(flow)" :icon="Delete" circle/>
					</el-tooltip>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import {
	Plus,
	Delete,
	Edit,
	DocumentCopy,
	Hide,
	View,
	Search,
	Star,
} from '@element-plus/icons-vue'

import {
	addGroup,
	delGroup,
	queryGroupFlowList
} from "@/api/group";
import {
	disableFlow,
	enableFlow,
	deleteFlow
} from "@/api/flow";

import {ref, getCurrentInstance,onMounted} from 'vue'
import {GroupVO} from "@/api/group/types";
// proxy相当于 vue2的this，从getCurrentInstance 实例中获取，proxy对象
const {proxy} = getCurrentInstance()
//新增分组名称
const addGroupName = ref<String>("");
const addGroupCardShow = ref<Boolean>(false);
const addGroupKey = ref<Number>(0);
const addGroupRef = ref();
const successGroupList=ref<GroupVO[]>([]);

function addGroupInputBlur() {
	if (proxy.$isBlank(addGroupName.value)) {
		addGroupCardShow.value = false

	}else{
		addGroup({groupName:addGroupName.value}).then(() => {
			ElMessage.success("新增成功");
			addGroupCardShow.value = false
			handleQuery();
		});
	}

}

import {useRouter} from 'vue-router'
const router=useRouter()

function toCreateFlow(id){
	let to = "/flow/create";
	if(!!id){
		to=to+"?groupId="+id
	}
	router.push(to)

}
function toEditFlow(flow){
	let to = "/flow/create?flowId="+flow.flowId;

	router.push(to)

}
function toCopyFlow(flow){
	let to = "/flow/create?cp=1&flowId="+flow.flowId;

	router.push(to)

}
function  showDisableConfirm(flow){
	ElMessageBox.confirm(
		'确定要停用该流程吗?',
		'提示',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}
	)
		.then(() => {
		 		disableFlow(flow.flowId).then(res=>{
					 handleQuery();
				})
		})
}
function  showEnableConfirm(flow){
	ElMessageBox.confirm(
		'确定要启用该流程吗?',
		'提示',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}
	)
		.then(() => {
		 		enableFlow(flow.flowId).then(res=>{
					 handleQuery();
				})
		})
}
function  showDeleteConfirm(flow){
	ElMessageBox.confirm(
		'确定要删除该流程吗?',
		'提示',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}
	)
		.then(() => {
		 		deleteFlow(flow.flowId).then(res=>{
					 handleQuery();
				})
		})
}
onMounted(() => {
	handleQuery()
})
function handleQuery(){
	queryGroupFlowList(false).then(res=>{

		const  {data} = res;
		successGroupList.value=data
	})
}
function  deleteAddGroup(){
	addGroupCardShow.value = false;
	addGroupName.value = "";
	addGroupKey.value = new Date().getTime()
}
function addOneGroupShow() {
	addGroupName.value = "";
	addGroupKey.value = new Date().getTime()
	addGroupCardShow.value = true;
	nextTick(()=>{
		addGroupRef.value.focus()

	})
}
function deleteGroup(id){
	delGroup(id).then(()=>{
		ElMessage.success("删除成功");

		handleQuery();
	})
}
</script>
<style scoped lang="less">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  display: flex;
  flex-direction: row;
  height: 60px;
  padding-top: 5px;
  margin-bottom: 10px;


  div:nth-child(2) div:first-child {
	font-size: 15px;
	height: 30px;
	font-weight: bolder;
	line-height: 30px;
  }

  div:nth-child(2) div:last-child {
	font-size: 12px;
	height: 20px;
	line-height: 20px;

  }

  .last {
	width: calc(100% - 70px - 200px - 200px - 50px);
	height: 60px;
	line-height: 60px;
	text-align: right;

  }
}

.additem {
  .last {
	width: calc(100% - 200px);
	height: 40px;
	line-height: 40px;
	text-align: right;
  }
}

.box-card {
  width: 80%;
  margin-left: 10%;
  margin-top: 10px;
}
</style>

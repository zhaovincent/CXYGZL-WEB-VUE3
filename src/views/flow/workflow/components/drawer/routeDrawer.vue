<template>
	<el-drawer :append-to-body="true" title="路由" v-model="visible"


						 @open="openEvent"

						 class="set_copyer" :show-close="false" :size="550" :before-close="saveDelay">


		<el-card class="box-card" v-for="(item,index) in config.list" style="margin-bottom: 20px">
			<template #header>
				<div class="card-header">
					<span>路由{{ index + 1 }}</span>

		  <el-select v-model="item.nodeId"   placeholder="选择节点" >
			  <el-option
				v-for="item in rejectNodeList"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id"
			  />
		  </el-select>

					<el-button class="button" type="danger" text @click="deleteRoute(index)">删除</el-button>
				</div>
			</template>
			<div>
				<el-text tag="b">{{ item.placeHolder }}</el-text>
			</div>
			<div style="margin-top: 20px">

				<el-button type="danger" @click="addCondition(index)">添加条件</el-button>
			</div>
		</el-card>

		<el-button text type="primary" @click="addRoute">添加路由</el-button>

		<el-dialog
				v-model="dialogVisible"
				width="500px"
		>
			<condtion-group v-model:data="conditionDialogConfigTemp"></condtion-group>

			<template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCondition">
          确定
        </el-button>
      </span>
			</template>
		</el-dialog>
	</el-drawer>
</template>
<script setup lang="ts">

import CondtionGroup from './components/conditionGroup.vue'
import {useFlowStore} from "../../stores/flow";

let flowStore = useFlowStore();




//计算节点列表
var rejectNodeList=computed(()=>{

	//驳回节点列表
	let values = []
	const excType = [0,1]

	var arr = {

	}
	var obj = {}




	produceSerialNodeList(undefined,flowStore.step3, arr, obj,true)


	var k = arr[config.value.id];

	if(k==undefined){
		return []
	}

	for (var item of k) {
		var type = obj[item].type;
		if (excType.indexOf(type)>-1&&obj[item].id!=config.value.id) {
			values.push({ id: obj[item].id, name: obj[item].nodeName })
		}
	}

	return values
})

//递归数据查找节点
function produceSerialNodeList(parentId, process, nodeArr, nodeObj,noBranch) {



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

		if((parentType==5||parentType==8)&&!noBranch){

			nodeArr[nodeId] = [];
		}else{
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

			produceSerialNodeList(nodeId, item, nodeArr, nodeObj,false)

		}

		if (proxy.$isNode(children)) {

			produceSerialNodeList(nodeId, children, nodeArr, nodeObj,true)

		}

	} else {
		if (proxy.$isNode(children)) {
			produceSerialNodeList(nodeId, children, nodeArr, nodeObj,true)
		}
	}

}



import $func from '../../utils/index'
import {useStore} from '../../stores/index'
import {ref, watch, computed, reactive} from 'vue'

let config = ref({})

var dialogVisible = ref(false)
// 对话框条件
var conditionDialogConfigTemp = ref();

var currentIndex = ref()

//删除路由
var deleteRoute = (index) => {
	config.value.list.splice(index, 1);
}
//添加路由
var addRoute = () => {
	config.value.list.push({
		groupRelationMode: true,
		mode: true,
		error: true,
		nodeId: '',
		placeHolder: '',
		groupRelation: [],
		conditionList: []
	})
}
//点击添加条件
var addCondition = (index) => {

	dialogVisible.value = true;
	currentIndex.value = index;
	conditionDialogConfigTemp.value = proxy.$deepCopy(config.value.list[index])

}
//对话框确定条件
var confirmCondition = () => {
	conditionDialogConfigTemp.value.error = !$func.checkCondition({conditionNodes: [conditionDialogConfigTemp.value, {}]}, 0);
	if(!$func.checkCondition({conditionNodes: [conditionDialogConfigTemp.value, {}]}, 0)){
	  ElMessage.warning("请完善条件");

	  return

	}

	console.log("条件数据",conditionDialogConfigTemp.value)
	dialogVisible.value = false
	//提示语
	let conditionStr = $func.conditionStr({conditionNodes: [conditionDialogConfigTemp.value, {}]}, 0);
	conditionDialogConfigTemp.value.placeHolder = conditionStr
	//是否错误
	config.value.list[currentIndex.value] = conditionDialogConfigTemp.value

}

let store = useStore()
let {setRouteConfig, setRoute} = store
let delayDrawer = computed(() => store.routeDrawer)
let delayConfigData = computed(() => store.routeConfigData)
let visible = computed({
	get() {
		return delayDrawer.value
	},
	set() {
		closeDrawer()
	}
})
watch(delayConfigData, (val) => {
	console.log("路由数据变化了", val)
	config.value = val.value;


}, {deep: true})

const {proxy} = getCurrentInstance();


const openEvent = () => {

}


const saveDelay = () => {


	config.value.error =false
	setRouteConfig({
		value: config.value,
		flag: true,
		id: delayConfigData.value.id
	})
	closeDrawer();
}
const closeDrawer = () => {
	setRoute(false)
}
</script>

<style lang="less" scoped>
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.text {
	font-size: 14px;
}

.item {
	margin-bottom: 18px;
}

.box-card {
	width: 480px;
}
</style>

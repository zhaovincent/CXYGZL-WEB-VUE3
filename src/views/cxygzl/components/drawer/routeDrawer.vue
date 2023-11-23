<template>
	<el-drawer :append-to-body="true" title="动态路由" v-model="visible"


						 @open="openEvent"

						 class="set_copyer" :show-close="false" :size="550" :before-close="saveDelay">
    <template #header="{ close, titleId, titleClass }">

      <title-handler :node-config="config"></title-handler>


    </template>


		<el-card class="box-card" v-for="(item,index) in config.list" style="margin-bottom: 20px">
			<template #header>
				<div class="card-header">
					<span>路由{{ index + 1 }}</span>

					<el-select v-model="item.nodeId" placeholder="选择节点">
						<el-option
								v-for="item in rejectNodeList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
						/>
					</el-select>

					<el-button   class="button" type="danger" text @click="deleteRoute(index)">删除</el-button>
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
var rejectNodeList = computed(() => {

	//驳回节点列表
	let values = []
	const excType = [10,3]

	var arr = {}
	var childArr = []
	var obj = {}
	var childNodeArr = {}


	produceSerialNodeList(undefined, flowStore.step3, arr, obj, true, childNodeArr)

	queryChildrenNode(config.value.id, childNodeArr, childArr);

	var k = arr[config.value.id];


	if (k == undefined) {
		k = []
	}
	k = k.concat(childArr);
	console.log("-----------",k)

	for (var item of k) {
		var type = obj[item].type;
		if (excType.indexOf(type) == -1 && obj[item].id != config.value.id) {
			values.push({id: obj[item].id, name: obj[item].nodeName})
		}
	}

	return values
})

//查询下级节点
function queryChildrenNode(curNodeId, childNodeArr, arr) {
	let childNodeArrElement = childNodeArr[curNodeId];
	if (util.isBlank(childNodeArrElement)) {
		return
	}
	arr.push(childNodeArrElement);
	queryChildrenNode(childNodeArrElement, childNodeArr, arr)
}

//递归数据查找节点
function produceSerialNodeList(parentId, process, nodeArr, nodeObj, noBranch, childNodeArr) {


	if (!util.isNode(process)) {
		return;
	}


	var nodeId = process.id;

	nodeObj[nodeId] = process;

	//子级


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

	if (util.isNode(children)) {
		childNodeArr[nodeId] = children.id;

	}
	if (type === 5 || type === 8 || type === 4) {

		var branchs = process.conditionNodes;


		for (var item of branchs) {

			produceSerialNodeList(nodeId, item, nodeArr, nodeObj, false, childNodeArr)

		}

		if (util.isNode(children)) {

			produceSerialNodeList(nodeId, children, nodeArr, nodeObj, true, childNodeArr)

		}

	} else {
		if (util.isNode(children)) {
			produceSerialNodeList(nodeId, children, nodeArr, nodeObj, true, childNodeArr)
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

  if(config.value.list.length<=1){
    ElMessage.warning("路由不能为空")
    return
  }

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
	conditionDialogConfigTemp.value = util.deepCopy(config.value.list[index])

}
//对话框确定条件
var confirmCondition = () => {
	conditionDialogConfigTemp.value.error = !$func.checkCondition({conditionNodes: [conditionDialogConfigTemp.value, {}]}, 0).ok;
	if (!$func.checkCondition({conditionNodes: [conditionDialogConfigTemp.value, {}]}, 0).ok) {
		ElMessage.warning("请完善条件");

		return

	}

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
	config.value = val.value;


}, {deep: true})


import * as util from '../../utils/objutil'
import TitleHandler from "./components/titleHandler.vue";

const openEvent = () => {

}


const saveDelay = () => {
	// config.value.error = !$func.routeOk(config.value)



  config.value.error = !$func.routeOk(config.value).ok
  config.value.errorMsg = $func.routeOk(config.value).msg

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

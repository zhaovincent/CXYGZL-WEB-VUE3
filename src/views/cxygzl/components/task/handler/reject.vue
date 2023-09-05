<script setup lang="ts">

import {defineExpose, getCurrentInstance} from "vue";
import {rejectTask} from "../../../api/task";

const dialogVisible = ref(false);

const submitDesc = ref("");
const rejectNodeId = ref("");


const currentOpenFlowForm = ref();

const processInstanceId = ref("");
const taskId = ref("");
const  nodeId=ref("");
const  process=ref("");
const  dialogTitle=ref("");

import * as util from "../../../utils/objutil";


var rejectNodeList=computed(()=>{

	//驳回节点列表
	let values = []
	const excType = [0,1]

	var arr = {

	}
	var obj = {}




	produceSerialNodeList(undefined,process.value, arr, obj,true)




	var k = arr[nodeId.value];

	if(k==undefined){
		return []
	}

	for (var item of k) {
		var type = obj[item].type;
		// if(type===5||type===8){
		// 	values=[];
		// }
		if (excType.indexOf(type)>-1&&obj[item].id!=nodeId.value) {
			values.push({ id: obj[item].id, name: obj[item].nodeName })
		}
	}


	return values
})

function produceSerialNodeList(parentId, process, nodeArr, nodeObj,noBranch) {



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

	  if((parentType==5||parentType==8)&&!noBranch){

		nodeArr[nodeId] = [];
		}else{
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

			produceSerialNodeList(nodeId, item, nodeArr, nodeObj,false)

		}

		if (util.isNode(children)) {

			produceSerialNodeList(nodeId, children, nodeArr, nodeObj,true)

		}

	} else {
		if (util.isNode(children)) {
			produceSerialNodeList(nodeId, children, nodeArr, nodeObj,true)
		}
	}

}

const handle = (pid,tid, formData,n,p,dialogTitle1) => {

	dialogTitle.value=dialogTitle1;

	processInstanceId.value = pid
	taskId.value = tid

	currentOpenFlowForm.value = formData;
	nodeId.value=n
	process.value=p

	dialogVisible.value = true;
}

defineExpose({handle});
const emit = defineEmits(["taskSubmitEvent"]);


const submit = () => {


	let value = currentOpenFlowForm.value;



	var formData = {}
	for (var item of value) {
		formData[item.id] = item.props.value;

	  if (item.type === 'Layout') {


		  let subList = item.props.value;

		  var d = []
		  for (var array of subList) {
			  var v = {}

			  for (var subItem of array) {
				  let value = subItem.props.value;
				  v[subItem.id] = value;
			  }
			  d.push(v)

		  }
		  formData[item.id] = d;

	  }
	}


	var param = {
		paramMap: formData,
		taskId: taskId.value,
	  nodeId: nodeId.value,
	  targetNodeId: rejectNodeId.value,
	  processInstanceId: processInstanceId.value,
	  approveDesc: submitDesc.value



	};

	rejectTask(param).then(res => {
		dialogVisible.value = false;


		emit("taskSubmitEvent")
	})
}

</script>

<template>
	<div>
		<el-dialog
				v-model="dialogVisible"
				:title="dialogTitle"
				width="400px"

		>

		<el-select  v-model="rejectNodeId"  placeholder="驳回节点"   style="width: 100%;margin-bottom: 20px;">
			<el-option
					v-for="item in rejectNodeList"
					:key="item.id"
					:label="item.name"
					:value="item.id"
			/>
		</el-select>

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

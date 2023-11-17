<script setup lang="ts">

import {computed, getCurrentInstance, onMounted, ref, watch} from "vue";

import {bgColors} from "../../../utils/const";

import addNode from "../addNode.vue"
import nodeWrap from "../nodeWrap.vue"

import $func from "../../../utils";
import {useStore} from "../../../stores";
import * as util from "../../../utils/objutil";


let isInputList = ref([]);
let props = defineProps({


	nodeConfig: {
		type: Object, default: () => {

		}
	}

});
let emits = defineEmits(['updateData']);

const readOnly = inject('readOnlyAtFlow') // 导入


const updateParentData = (d) => {
	emits("updateData", d);

}
const resetConditionNodesErr = () => {


	for (var i = 0; i < props.nodeConfig.conditionNodes.length; i++) {

		let conditionNode = props.nodeConfig.conditionNodes[i];

		conditionNode.error = false;

		if (i != props.nodeConfig.conditionNodes.length - 1) {


			conditionNode.error = !$func.checkCondition(props.nodeConfig, i);

		} else {
			conditionNode.conditionList = [{
				mode: true,
				conditionList: [{
					key: '',
					expression: ''

				}]
			}]
		}
    if(!readOnly){
      conditionNode.placeHolder = $func.conditionStr(props.nodeConfig, i);

    }


	}
}

const arrTransfer = (index, type = 1) => {
	//向左-1,向右1
	props.nodeConfig.conditionNodes[index] = props.nodeConfig.conditionNodes.splice(
			index + type,
			1,
			props.nodeConfig.conditionNodes[index]
	)[0];
	props.nodeConfig.conditionNodes.map((item, index) => {
		item.priorityLevel = index + 1;
	});
	resetConditionNodesErr()
	updateParentData(props.nodeConfig);
};

const blurEvent = (index) => {

	isInputList.value[index] = false;
	props.nodeConfig.conditionNodes[index].nodeName = props.nodeConfig.conditionNodes[index].nodeName || "条件";

};
const clickEvent = (index) => {

	isInputList.value[index] = true;

};
const reData = (data, addData) => {
	if (!data.childNode) {
		data.childNode = addData;
	} else {
		reData(data.childNode, addData);
	}
};

const delTerm = (index) => {
	props.nodeConfig.conditionNodes.splice(index, 1);
	props.nodeConfig.conditionNodes.map((item, index) => {
		item.priorityLevel = index + 1;
		item.nodeName = `条件${index + 1}`;
	});
	resetConditionNodesErr()
	updateParentData(props.nodeConfig);
	if (props.nodeConfig.conditionNodes.length == 1) {
		if (props.nodeConfig.childNode) {
			if (props.nodeConfig.conditionNodes[0].childNode) {
				reData(props.nodeConfig.conditionNodes[0].childNode, props.nodeConfig.childNode);
			} else {
				props.nodeConfig.conditionNodes[0].childNode = props.nodeConfig.childNode;
			}
		}
		updateParentData(props.nodeConfig.conditionNodes[0].childNode);
	}
};


let store = useStore();
let {

	//TODO 2
	setCondition,

	setConditionsConfig,

} = store;

let conditionsConfig1 = computed(() => store.conditionsConfig1)


watch(conditionsConfig1, (condition) => {
	if (condition.flag && condition.id === _uid) {
		updateParentData(condition.value);
	}
});

let _uid = getCurrentInstance().uid;

const openConfigDrawer = (priorityLevel,index) => {


  if(readOnly){
    return;
  }

	if(index>=props.nodeConfig.conditionNodes.length-1){
		return
	}


	setConditionsConfig({
		value: JSON.parse(JSON.stringify(props.nodeConfig)),
		priorityLevel,
		flag: false,
		id: _uid,
	});

	setCondition(true);
};

const addTerm = () => {
  if(readOnly){
    return
  }


	let len = props.nodeConfig.conditionNodes.length + 1;
	props.nodeConfig.conditionNodes.push({
		nodeName: "条件" + len,
		type: 3,
		parentId: props.nodeConfig.id,
		mode: true,
		"groupRelationMode": true,
		"groupRelation": [],
		id: util.getRandomId(),
		priorityLevel: len,
		conditionList: [{
			mode: true,
			conditionList: [{
				key: '',

				expression: ''
			}]
		}],
		nodeUserList: [],
		childNode: null,
	});
	resetConditionNodesErr()
	updateParentData(props.nodeConfig);
};
onMounted(() => {

	resetConditionNodesErr()

});

import {useFlowStore} from '../../../stores/flow'

let flowStore = useFlowStore();


const step2FormList = computed(() => {
	let step2 = flowStore.step2;
	return step2;
})

watch(() => step2FormList.value, (val) => {

	let nodeConfig = props.nodeConfig;


	//条件分支
	var index = 0;
	var len = nodeConfig.conditionNodes.length
	for (var node of nodeConfig.conditionNodes) {
		if (index >= len - 1) {
			break
		}
		for (var item1 of node.conditionList) {
			for (var item2 of item1.conditionList) {
					if(item2.key==='root'){
						continue
					}
				let length = val.filter(res => res.id === item2.key).length;
				if (length == 0) {
					item2.key = ''
					item2.expression = ''
					item2.keyType = ''
					item2.value = ''
					node.error = true;
				}
			}
		}
		index++;

	}
})

//节点状态
const nodeStatusMap = inject('nodeStatusMapAtFlow') // 导入
//边框颜色
const outBorder = computed(() => {

  console.log(nodeStatusMap)

  if (readOnly&&nodeStatusMap&&nodeStatusMap.d) {
    let nodeStatusMapElement = nodeStatusMap.d[props.nodeConfig.id];
    if (!nodeStatusMapElement) {
      return ''
    }
    if (nodeStatusMapElement == 1) {
      return 'active being'

    }
    if (nodeStatusMapElement == 2) {
      return 'active finished'

    }
    if (nodeStatusMapElement == 3) {
      return 'active canceled'

    }

  } else if (props.nodeConfig.error) {
    return 'active error'
  }
  return ''
})
</script>

<template>
	<div class="branch-wrap">
		<div class="branch-box-wrap">
			<div class="branch-box">
				<button class="add-branch" :style="`color: rgb(${bgColors[nodeConfig.type]});`" @click="addTerm">添加条件
				</button>
				<div class="col-box" v-for="(item, index) in nodeConfig.conditionNodes" :key="index">

					<div class="condition-node">
						<div class="condition-node-box">
							<div class="auto-judge" :class=" item.error ? 'error active' : ''">
								<div class="sort-left" v-if="index != 0&&!readOnly" @click="arrTransfer(index, -1)">&lt;</div>
								<div class="title-wrapper">
									<input
											style="width: 50%"
											v-if="isInputList[index] && !readOnly"
											type="text"
											class="ant-input editable-title-input"
											@blur="blurEvent(index)"
											@focus="$event.currentTarget.select()"
											v-focus
											v-model="item.nodeName"
									/>
									<span v-else class="editable-title" :style="`color: rgb(${bgColors[nodeConfig.type]});`"
												@click="clickEvent(index)">{{ item.nodeName }}</span>
									<span class="priority-title" @click="openConfigDrawer(item.priorityLevel,index)">优先级{{
											item.priorityLevel
										}}</span>
									<i v-if="!readOnly" class="anticon anticon-close close" @click="delTerm(index)"></i>
								</div>
								<div class="sort-right" v-if="!readonly&&index != nodeConfig.conditionNodes.length - 1"
										 @click="arrTransfer(index)">&gt;
								</div>

								<div class="content"
										 @click="openConfigDrawer(item.priorityLevel,index)">{{readonly?nodeConfig.conditionNodes[index].placeHolder: $func.conditionStr(nodeConfig, index) }}
								</div>
								<div class="error_tip" v-if="item.error">
									<i class="anticon anticon-exclamation-circle"></i>
								</div>
							</div>
							<addNode v-model:childNodeP="item.childNode" :current-node="item"/>
						</div>
					</div>
					<nodeWrap v-if="item.childNode" v-model:nodeConfig="item.childNode"/>
					<template v-if="index == 0">
						<div class="top-left-cover-line"></div>
						<div class="bottom-left-cover-line"></div>
					</template>
					<template v-if="index == nodeConfig.conditionNodes.length - 1">
						<div class="top-right-cover-line"></div>
						<div class="bottom-right-cover-line"></div>
					</template>
				</div>
			</div>
			<addNode v-model:childNodeP="nodeConfig.childNode" :current-node="nodeConfig"/>
		</div>
	</div>

</template>

<style scoped lang="less">
@import "../../../css/workflow.css";

.error_tip {
	position: absolute;
	top: 0px;
	right: 0px;
	transform: translate(150%, 0px);
	font-size: 24px;
}

.promoter_person .el-dialog__body {
	padding: 10px 20px 14px 20px;
}

.selected_list {
	margin-bottom: 20px;
	line-height: 30px;
}

.selected_list span {
	margin-right: 10px;
	padding: 3px 6px 3px 9px;
	line-height: 12px;
	white-space: nowrap;
	border-radius: 2px;
	border: 1px solid rgba(220, 220, 220, 1);
}

.selected_list img {
	margin-left: 5px;
	width: 7px;
	height: 7px;
	cursor: pointer;
}
</style>

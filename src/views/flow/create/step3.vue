<template>
	<div class="app-container">

		<div class="fd-nav-content">
			<section class="dingflow-design">
				<div class="zoom">
					<div class="zoom-out" :class="nowVal == 50 && 'disabled'" @click="zoomSize(1)"></div>
					<span>{{ nowVal }}%</span>
					<div class="zoom-in" :class="nowVal == 300 && 'disabled'" @click="zoomSize(2)"></div>
				</div>
				<div class="box-scale" :style="`transform: scale(${ nowVal / 100});`">
					<nodeWrap v-model:nodeConfig="nodeConfig"/>
					<div class="end-node">
						<div class="end-node-circle"></div>
						<div class="end-node-text">流程结束</div>
					</div>
				</div>
			</section>
		</div>
		<promoterDrawer/>
		<approverDrawer/>
		<copyerDrawer/>
		<conditionDrawer/>
	</div>
</template>

<script setup>
import nodeWrap from "../workflow/components/nodeWrap.vue"
import {ref, onMounted, defineExpose} from "vue";
import promoterDrawer from "../workflow/components/drawer/promoterDrawer.vue";
import approverDrawer from "../workflow/components/drawer/approverDrawer.vue";
import copyerDrawer from "../workflow/components/drawer/copyerDrawer.vue";
import conditionDrawer from "../workflow/components/drawer/conditionDrawer.vue";


let tipList = ref([]);
let nowVal = ref(100);
let nodeConfig = ref({

	"nodeName": "发起人",
	"type": 0,
	"id": "root",
	"formPerms": {},
	"nodeUserList": [],
	"childNode": {}
});

let props = defineProps({


	nodeConfigObj: {
		type: String,
		default: ''
	}
});


watch(() => props.nodeConfigObj, (val) => {
	nodeConfig.value = val
})

const reErr = ({childNode}) => {
	if (childNode) {

		let {type, error, nodeName, conditionNodes} = childNode;
		if (type == 1 || type == 2) {
			if (error) {

				tipList.value.push(nodeName + " 未设置人员");
			}
			reErr(childNode);
		} else if (type == 3) {
			reErr(childNode);
		} else if (type == 4) {
			reErr(childNode);
			for (var i = 0; i < conditionNodes.length; i++) {
				if (conditionNodes[i].error) {
					tipList.value.push('请设置'+conditionNodes[i].nodeName+'的条件');
				}
				reErr(conditionNodes[i]);
			}
		}
	} else {
		childNode = null;
	}
};
import {useFlowStore} from "../workflow/stores/flow";

let store = useFlowStore();


watch(() => nodeConfig.value, (v) => {
	store.setStep3(v)
}, {deep: true})
const getProcessData = async () => {

	return nodeConfig.value
};
const zoomSize = (type) => {
	if (type == 1) {
		if (nowVal.value == 50) {
			return;
		}
		nowVal.value -= 10;
	} else {
		if (nowVal.value == 300) {
			return;
		}
		nowVal.value += 10;
	}
};
const validate = (f) => {


	tipList.value = [];

	if(nodeConfig.value.childNode==undefined||nodeConfig.value.childNode.id===undefined){
			tipList.value=['请完善流程节点']
	}


	reErr(nodeConfig.value);
	if (tipList.value.length != 0) {
		f(false, tipList.value)
		return
	}
	f(true)
}
defineExpose({validate, getProcessData});

</script>
<style scoped>
@import "../workflow/css/workflow.css";

.error-modal-list {
	width: 455px;
}
</style>

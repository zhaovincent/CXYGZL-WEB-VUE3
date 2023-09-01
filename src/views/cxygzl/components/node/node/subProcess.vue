<script setup lang="ts">
import {getCurrentInstance, onMounted, ref, watch} from "vue";

const {proxy} = getCurrentInstance();
let isInput = ref(false);

let props = defineProps({


	nodeConfig: {
		type: Object, default: () => {

		}
	}

});

onMounted(() => {
		props.nodeConfig.error = !$func.subProcessOK(props.nodeConfig);

});
const blurEvent = (index) => {

	isInput.value = false;
	props.nodeConfig.nodeName = props.nodeConfig.nodeName || defaultText

};
import {bgColors, placeholderList} from "@/views/flow/workflow/utils/const";
import {computed} from "vue";
import addNode from "../addNode.vue"

import $func from "@/views/flow/workflow/utils";
import {useStore} from "@/views/flow/workflow/stores";

let defaultText = computed(() => {
	return placeholderList[props.nodeConfig.type]
});


var placeHolder = computed(() => {

	//TODO 1
	return $func.subProcessStr(props.nodeConfig)

})

const clickEvent = (index) => {
	if (index || index === 0) {
		isInputList.value[index] = true;
	} else {
		isInput.value = true;
	}
};
let isInputList = ref([]);

let emits = defineEmits(['updateData']);


const updateParentData = (d) => {
	emits("updateData", d);

}

const delNode = () => {
	updateParentData(props.nodeConfig.childNode);
};

let store = useStore();
let {

	//TODO 2
	setSubProcess,

	setSubProcessConfig,

} = store;


let _uid = getCurrentInstance().uid;

//TODO 3
//审批数据
let approverConfigData = computed(() => store.subProcessConfigData)
watch(approverConfigData, (approver) => {
	if (approver.flag && approver.id === _uid) {
		updateParentData(approver.value);
	}
});
//打开右侧抽屉
const openConfigDrawer = () => {
	//TODO 4
	//子流程
	setSubProcess(true);
	setSubProcessConfig({
		value: JSON.parse(JSON.stringify(props.nodeConfig)),
		flag: false,
		id: _uid,
	});
};


</script>

<template>
	<div class="node-wrap">
		<div class="node-wrap-box"
				 :class="(nodeConfig.type == 0 ? 'start-node ' : '') +( nodeConfig.error ? 'active error' : '')">

			<div class="title" :style="`background: rgb(${bgColors[nodeConfig.type]});`">

				<input
						v-if="isInput"
						type="text"
						class="ant-input editable-title-input"
						@blur="blurEvent()"
						@focus="$event.currentTarget.select()"
						v-focus
						v-model="nodeConfig.nodeName"
						:placeholder="defaultText"
				/>
				<span v-else class="editable-title" @click="clickEvent()">{{ nodeConfig.nodeName }}</span>
				<i class="anticon anticon-close close" @click="delNode"></i>

			</div>
			<div class="content" @click="openConfigDrawer">
				<div class="text">
					{{ placeHolder?.length > 0 ? placeHolder : '请选择' + defaultText }}
				</div>
				<i class="anticon anticon-right arrow"></i>
			</div>


			<div class="error_tip" v-if="nodeConfig.error">
				<i class="anticon anticon-exclamation-circle"></i>
			</div>
		</div>
		<addNode :current-node="nodeConfig" v-model:childNodeP="nodeConfig.childNode"/>
	</div>

</template>

<style scoped lang="less">
@import "@/views/flow/workflow/css/workflow.css";

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

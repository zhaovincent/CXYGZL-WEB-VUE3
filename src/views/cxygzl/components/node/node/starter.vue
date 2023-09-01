<script setup lang="ts">
import {getCurrentInstance, ref, watch} from "vue";


let props = defineProps({


	nodeConfig: {
		type: Object, default: () => {

		}
	}

});

import {bgColors, placeholderList} from "../../../utils/const";
import {computed} from "vue";
import addNode from "../addNode.vue"

import $func from "../../../utils";
import {useStore} from "../../../stores";

let defaultText = computed(() => {
	return placeholderList[props.nodeConfig.type]
});


var placeHolder = computed(() => {

	return $func.arrToStr(props.nodeConfig.nodeUserList) || '所有人'

})


let emits = defineEmits(['updateData']);


const updateParentData = (d) => {
	emits("updateData", d);

}


let store = useStore();
let {

	setPromoter,

	setStarterConfig,

} = store;


let _uid = getCurrentInstance().uid;

//审批数据
let approverConfigData = computed(() => store.starterConfigData)
watch(approverConfigData, (approver) => {
	if (approver.flag && approver.id === _uid) {
		updateParentData(approver.value);
	}
});
//打开右侧抽屉
const openConfigDrawer = () => {

	setPromoter(true);
	setStarterConfig({
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


				<span     >{{ nodeConfig.nodeName }}</span>

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

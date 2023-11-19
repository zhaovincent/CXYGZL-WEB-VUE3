<script setup lang="ts">
import {getCurrentInstance, onMounted, ref, watch} from "vue";

let isInput = ref(false);

let props = defineProps({


	nodeConfig: {
		type: Object, default: () => {

		}
	}

});
const readOnly = inject('readOnlyAtFlow') // 导入

import {isNotBlank} from "../../../utils/objutil";

onMounted(() => {
  let checkApproval = $func.checkTrigger(props.nodeConfig);

  props.nodeConfig.error = !(checkApproval.ok);
  props.nodeConfig.errorMsg = (checkApproval.msg);

});
const blurEvent = (index) => {

	isInput.value = false;
	props.nodeConfig.nodeName = props.nodeConfig.nodeName || defaultText

};
import {bgColors, placeholderList} from "../../../utils/const";
import {computed} from "vue";
import addNode from "../addNode.vue"

import $func from "../../../utils";
import {useStore} from "../../../stores";

let defaultText = computed(() => {
	return placeholderList[props.nodeConfig.type]
});


var placeHolder = computed(() => {
  if(props.nodeConfig.error){
    return props.nodeConfig.errorMsg;
  }
	return $func.triggerStr(props.nodeConfig)

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

	setAsynTrigger,

	setAsynTriggerConfig,

} = store;


let _uid = getCurrentInstance().uid;

//审批数据
let configData = computed(() => store.asynTriggerConfigData)
watch(configData, (approver) => {
	if (approver.flag && approver.id === _uid) {
		updateParentData(approver.value);
	}
});
//打开右侧抽屉
const openConfigDrawer = () => {

  if(readOnly){
    return
  }

	//触发器
	setAsynTrigger(true);
	setAsynTriggerConfig({
		value: JSON.parse(JSON.stringify(props.nodeConfig)),
		flag: false,
		id: _uid,
	});
};
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
	<div class="node-wrap">
		<div class="node-wrap-box"
				 :class="(nodeConfig.type == 0 ? 'start-node ' : '') +( outBorder)">

			<div class="title" :style="`background: rgb(${bgColors[nodeConfig.type]});`">

				<input
						v-if="isInput&&!readOnly"
						type="text"
						class="ant-input editable-title-input"
						@blur="blurEvent()"
						@focus="$event.currentTarget.select()"
						v-focus
						v-model="nodeConfig.nodeName"
						:placeholder="defaultText"
				/>
				<span v-else class="editable-title" @click="clickEvent()">{{ nodeConfig.nodeName }}</span>
				<i v-if="!readOnly" class="anticon anticon-close close" @click="delNode"></i>

			</div>
			<div class="content" @click="openConfigDrawer">
				<div class="text">
          <div v-if="nodeConfig.error" class="placeholderError">!</div> {{isNotBlank(placeHolder) ? placeHolder : '请选择' + defaultText }}

        </div>
				<i v-if="!readOnly" class="anticon anticon-right arrow"></i>
			</div>


			<div class="error_tip" v-if="nodeConfig.error">

        <el-popover
            placement="top-start"
            :width="200"
            trigger="hover"
            :content="nodeConfig.errorMsg"
        >
          <template #reference>
            <i class="anticon anticon-exclamation-circle"></i>

          </template>
        </el-popover>
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

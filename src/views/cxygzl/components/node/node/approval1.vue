<script setup lang="ts">
import {getCurrentInstance, computed, onMounted, ref, watch} from "vue";

let isInput = ref(false);

let props = defineProps({

  nodeConfig: {
    type: Object, default: () => {

    }
  }

});

const readOnly = inject('readOnlyAtFlow') // 导入


onMounted(() => {

  //TODO 5
  let checkApproval = $func.checkApproval(props.nodeConfig);
  props.nodeConfig.error = !(checkApproval.ok);
  props.nodeConfig.errorMsg = (checkApproval.msg);

});


//TODO 7
import {useFlowStore} from '../../../stores/flow'

let flowStore = useFlowStore();


const step2FormList = computed(() => {
  let step2 = flowStore.step2;
  return step2;
})

//TODO 6
watch(() => step2FormList.value, (val) => {

  let nodeConfig = props.nodeConfig;

  if (nodeConfig.type == 1) {
    //审批人

    if (nodeConfig.assignedType == 8) {
      //表单人员
      let formUserId = nodeConfig.formUserId;
      let length = val.filter(res => res.id === formUserId).length;
      if (length == 0) {
        nodeConfig.formUserId = ''
        nodeConfig.formUserName = ''
        nodeConfig.error = true;
        nodeConfig.errorMsg = '请选择表单人员';
      }

    }
  }
})


const blurEvent = () => {

  isInput.value = false;
  props.nodeConfig.nodeName = props.nodeConfig.nodeName || defaultText

};
import {bgColors, placeholderList} from "../../../utils/const";
import addNode from "../addNode.vue"

import $func from "../../../utils";
import {useStore} from "../../../stores";
import {isNotBlank} from "../../../utils/objutil";

let defaultText = computed(() => {
  return placeholderList[props.nodeConfig.type]
});


var placeHolder = computed(() => {

  //TODO 1
  if(props.nodeConfig.error){
    return props.nodeConfig.errorMsg;
  }
  return $func.setApproverStr(props.nodeConfig)

})

const clickEvent = () => {

  isInput.value = true;

};

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
  setApprover,

  setApproverConfig,

} = store;


let _uid = getCurrentInstance().uid;

//TODO 3
//审批数据
let approverConfigData = computed(() => store.approverConfigData)
watch(approverConfigData, (approver) => {
  if (approver.flag && approver.id === _uid) {
    updateParentData(approver.value);
  }
});
//打开右侧抽屉
const openConfigDrawer = () => {

  if (readOnly) {
    return
  }

  //TODO 4
  setApprover(true);
  setApproverConfig({
    value: {
      ...JSON.parse(JSON.stringify(props.nodeConfig)),
      ...{assignedType: props.nodeConfig.assignedType ? props.nodeConfig.assignedType : 1},
      ...{multiple: props.nodeConfig.multiple},
    },
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
         :class="(nodeConfig.type == 0 ? 'start-node ' : '') +(outBorder)">
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

<script setup lang="ts">
import {getCurrentInstance, computed, onMounted, ref, watch} from "vue";


let props = defineProps({

  nodeConfig: {
    type: Object, default: () => {

    }
  }

});




import {useFlowStore} from '../../../stores/flow'

let flowStore = useFlowStore();


const step2FormList = computed(() => {
  let step2 = flowStore.step2;
  return step2;
})

//TODO
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




import {useStore} from "../../../stores";



let emits = defineEmits(['updateData']);


const updateParentData = (d) => {
  emits("updateData", d);

}


//TODO
let store = useStore();
let {


  setApprover,

  setApproverConfig,

} = store;


let _uid = getCurrentInstance().uid;

//TODO
//审批数据
let approverConfigData = computed(() => store.approverConfigData)
watch(approverConfigData, (approver) => {
  if (approver.flag && approver.id === _uid) {
    updateParentData(approver.value);
  }
});


function open(){

	//TODO
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
}

import NodeTemplate from "./node-template.vue";

</script>

<template>
<node-template @updateData="updateParentData" place-holder-method-name="setApproverStr" check-method-name="checkApproval" @open="open"   :node-config="nodeConfig"></node-template>
</template>

<style scoped lang="less">
</style>

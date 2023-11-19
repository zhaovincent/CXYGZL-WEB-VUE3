<script setup lang="ts">
import {getCurrentInstance, computed, onMounted, ref, watch} from "vue";


let props = defineProps({

	nodeConfig: {
		type: Object, default: () => {

		}
	}

});






import {useStore} from "../../../stores";



let emits = defineEmits(['updateData']);


const updateParentData = (d) => {
	emits("updateData", d);

}


//TODO
let store = useStore();
let {


	setTrigger,

	setTriggerConfig,

} = store;


let _uid = getCurrentInstance().uid;

//TODO
//审批数据
let configDataAtStore = computed(() => store.triggerConfigData)
watch(configDataAtStore, (approver) => {
	if (approver.flag && approver.id === _uid) {
		updateParentData(approver.value);
	}
});


function open(){

	//TODO
	setTrigger(true);
	setTriggerConfig({
		value: JSON.parse(JSON.stringify(props.nodeConfig)),
		flag: false,
		id: _uid,
	});
}

import NodeTemplate from "./node-template.vue";

</script>

<template>
	<node-template @updateData="updateParentData" place-holder-method-name="triggerStr" check-method-name="checkTrigger" @open="open"   :node-config="nodeConfig"></node-template>
</template>

<style scoped lang="less">
</style>

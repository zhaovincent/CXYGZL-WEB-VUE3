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


  setRoute,

  setRouteConfig,

} = store;


let _uid = getCurrentInstance().uid;


function open(){

  //TODO
  setRoute(true);
  setRouteConfig({
    value: JSON.parse(JSON.stringify(props.nodeConfig)),
    flag: false,
    id: _uid,
  });
}

import NodeTemplate from "./node-template.vue";

</script>

<template>
  <node-template :uid="_uid" store-data-key="routeConfigData" @updateData="updateParentData" place-holder-method-name="routeStr" check-method-name="routeOk" @open="open"   :node-config="nodeConfig"></node-template>
</template>

<style scoped lang="less">
</style>

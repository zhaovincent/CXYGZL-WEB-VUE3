<script setup lang="ts">

let props = defineProps({

  nodeUser: {
    type: Object,
    dafault: () => {
    }
  },
  row: {
    type: Array,
    dafault: () => []
  },
  disableSelect: {
    type: Boolean,
    default: false
  }

});



import FlowNodeFormatContent from "./FlowNodeFormatContent.vue";

</script>

<template>
  <div style="padding: 10px">

    <el-timeline :reverse="false">
      <flow-node-format-content :disable-select="disableSelect"
      :node-user="nodeUser"
                                :row="row"
      ></flow-node-format-content>
    </el-timeline>


  </div>
</template>

<style scoped lang="less">
.f1 {
  width: 40px;
  text-align: center;

  padding-top: 5px;
}

.f2 {
  height: 50px;
  font-size: 10px;
  margin-left: 5px;
  width: calc(100% - 45px);
  padding-top: 5px;

}

.f211{
  font-weight: bold;
  font-size: 15px;
}
.f212{
  font-size: 10px;
}

.f00 {
  width: 10px;
  height: 10px;
  display: inline-block;
  background-color: green;
  position: fixed;
  top: 62px;

}
.f21{
  width: calc(100% - 100px);
}
.f22{
  width: 100px;
  text-align: right;
}
</style>

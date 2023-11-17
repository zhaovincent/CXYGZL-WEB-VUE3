<script setup lang="ts">


import {showImage} from '../api/task/index'

import {ref, defineExpose, provide, watch} from "vue";


const dialogVisible = ref(false);

const nodeStatuMap=reactive({
  d:{}
})
provide("nodeStatusMapAtFlow",nodeStatuMap);

const view = (row) => {
	dialogVisible.value = true

	showImage(row.processInstanceId).then(res => {


		nodeConfig.value=res.data.node;
     nodeStatuMap.d=res.data.nodeStatuMap;
   // Object.assign(res.data.nodeStatuMap,nodeStatuMap)


	})


}


import Step3 from "@/views/cxygzl/components/flow/step3.vue";

let nodeConfig = ref({

	"nodeName": "发起人",
	"type": 0,
	"id": "root",
	"error": false,
	"formPerms": {},
	"nodeUserList": [],
	"childNode": {},
	multipleMode: 1,
	"dynamicFormConfig": {
		"url": '',
		"header": [],
		"body": [],
		"result": [
			{
				"field": '',
				"contentConfig": '',
				"value": ''
			}
		]
	},
	"operList": [
		{
			"key": "pass",
			"checked": true,
			"edit": false,
			"name": "完成",
			"defaultName": "完成"
		}
	]
});
watch(()=>nodeStatuMap.value,(v)=>{
  console.log("状态集合变化了",v)
})



//表示流程图只读
provide("readOnlyAtFlow",true);

defineExpose({view});



</script>

<template>
	<div>
		<el-dialog
				v-model="dialogVisible"
				title="查看流程图"
				width="80%"
		>
      <div style="background-color: #f5f5f7">
        <el-scrollbar height="70vh">
          <step3 :read-only="true" :nodeConfigObj="nodeConfig" ref="step3Ref"/>

        </el-scrollbar>

      </div>



		</el-dialog>
	</div>
</template>

<style scoped lang="less">


</style>

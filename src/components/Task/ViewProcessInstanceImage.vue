<script setup lang="ts">
import LogicFlow from '@logicflow/core';
import '@logicflow/core/dist/style/index.css';
import {NodeResize} from '@logicflow/extension';
import '@logicflow/extension/lib/style/index.css'

LogicFlow.use(NodeResize);
import {showImage} from '@/api/task/index'

import {defineExpose} from "vue";

const dialogVisible = ref(false);

const lf =ref();
const zoomFunc=(v)=>{
	lf.value.zoom(v)
}

const view = (row) => {
	dialogVisible.value = true

	showImage(row.processInstanceId).then(res => {
		// imgBase64.value = 'data:image/png;base64,' + res.data.base64
		nodeData.value = res.data;


		  lf.value = new LogicFlow({
			container: document.querySelector('#container'),
			// stopScrollGraph: true,
			// stopZoomGraph: true,
			width: screen.width*0.8-100,
			height: screen.height*0.6,
			grid: true,
			isSilentMode: true

		});
	  lf.value.setTheme({
		  nodeText: { // 节点文本样式
			  fontSize: 10,
			  color: 'green'
		  },

		  rect: {
			  width: 50,
			  height: 40,
			  radius: 6
		  },
	  })
		lf.value.render(nodeData.value);


	})


}
defineExpose({view});

const nodeData = ref({nodes: [], edges: []});


</script>

<template>
	<div>
		<el-dialog
				v-model="dialogVisible"
				title="查看流程图"
				width="80%"
		>
				<el-button @click="zoomFunc(false)">缩小</el-button>
				<el-button @click="zoomFunc(true)">放大</el-button>
			<div style="display: block" id="container"></div>
		</el-dialog>
	</div>
</template>

<style scoped lang="less">

</style>

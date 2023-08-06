<script setup lang="ts">
import LogicFlow from '@logicflow/core';
import '@logicflow/core/dist/style/index.css';
import {showImage} from '@/api/task/index'

import {defineExpose} from "vue";

const dialogVisible = ref(false);

const view = (row) => {

	showImage(row.processInstanceId).then(res=>{
	  imgBase64.value='data:image/png;base64,'+res.data


	  dialogVisible.value=true

	})
	dialogVisible.value = true
	setTimeout(() => {
		const lf = new LogicFlow({
			container: document.querySelector('#container'),
			stopScrollGraph: true,
			stopZoomGraph: true,
			width: 800,
			height: 500,
			grid: false,
			isSilentMode: true
		});
		lf.setTheme({
			circle: {
				r: 30,
		  stroke:'red'
			}
		})
		lf.render(data);
	}, 2000)


}
defineExpose({view});


const imgBase64 = ref()
const data = {
	// 节点
	nodes: [
		{
			id: 1,
			type: 'circle',
			text: '开始',
			x: 100,
			y: 150,
		},
		{
			id: 2,
			type: 'rect',
			x: 300,
			y: 150,
			text: '你好',
		},
		{
			id: 3,
			type: 'diamond',
			x: 500,
			y: 150,
			text: '条件分支',
		},
		{
			id: 4,
			type: 'rect',
			x: 700,
			y: 100,
			text: '审批人1',
		},
		{
			id: 5,
			type: 'rect',
			x: 700,
			y: 200,
			text: '审批人2',
		},
	],
	// 边
	edges: [
		{
			type: 'polyline',
			sourceNodeId: 1,
			targetNodeId: 2,
		},
		{
			type: 'polyline',
			sourceNodeId: 2,
			targetNodeId: 3,
		},
		{
			type: 'polyline',
			sourceNodeId: 3,
			targetNodeId: 4,
		},
		{
			type: 'polyline',
			sourceNodeId: 3,
			targetNodeId: 5,
		},
	],
};


</script>

<template>
	<div>
		<el-dialog
				v-model="dialogVisible"
				title="查看流程图"
				width="850px"
		>
				  <img :src="imgBase64" style="width: 100%;"/>
			<div style="display: none" id="container"></div>
		</el-dialog>
	</div>
</template>

<style scoped lang="less">

</style>

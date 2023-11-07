<script setup lang="ts">

import {onMounted, ref} from "vue";

import {useFlowStore} from '../../../stores/flow'


const dialogTableVisible = ref(false);

const show = (title1, itemList) => {
	console.log("显示对话框数据",itemList)
	if (itemList) {

		dataSource.value = itemList;
	} else {
		dataSource.value = [];
	}


	title.value = title1;


	dialogTableVisible.value = true;

}


defineExpose({show});


const opened = () => {


}
const close = () => {

}

const title = ref('')

onMounted(() => {


});
let emits = defineEmits(['ok']);

const confirm = () => {
	let boolean = checkUnique(dataSource.value);
	if (!boolean) {
		ElMessage.error("选项编码不唯一，请重新设置")
		return
	}
	emits('ok', dataSource.value)
	dialogTableVisible.value = false;
}

const addOneItem = () => {
	itemConfigRef.value.show('配置选项');
	isEdit.value = false;
	currentData.value = {}
}


import {ref} from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'

const dataSource = ref<Tree[]>([])

interface Tree {
	key: string
	label: string
	children?: Tree[]
}

const itemConfigRef = ref()
//新增
const append = (data: Tree) => {

	itemConfigRef.value.show('配置选项');
	isEdit.value = false;

	currentData.value = data;
}

const isEdit = ref(false);

//编辑
const edit = (data: Tree, node) => {

	itemConfigRef.value.show('配置选项', deepCopy(data));

	isEdit.value = true;

	currentData.value = data;
	currentNode.value = node;
}

const currentData = ref({});
const currentNode = ref();

const addItemOk = (item) => {
	const newChild = {uniId: getRandomId(), key: item.key, label: item.label, children: []}
	if (!currentData.value.children) {
		currentData.value.children = []
	}
	if (isEdit.value) {


		let treeData = getTreeData(currentData.value.uniId, dataSource.value);


		treeData.key = item.key
		treeData.label = item.label

	} else if (isNotBlank(currentData.value.key)) {
		currentData.value.children.push(newChild)

	} else {
		dataSource.value.push(newChild)
	}
	dataSource.value = [...dataSource.value]
}

const getTreeData = (uniId, arr) => {

	for (var item of arr) {

		if (item.uniId === uniId) {
			return item;
		}
		let treeData = getTreeData(uniId, item.children);
		if (treeData) {
			return treeData
		}
	}
	return undefined;
}
//检查key是否唯一
const checkUnique = (arr) => {
	for (var item of arr) {
		let treeList = getTreeList(item.key, dataSource.value);

		if (treeList.length > 1) {
			return false;
		}
		let b = checkUnique(item.children);
		if (!b) {
			return false;
		}
	}
	return true;
}

const getTreeList = (key, arr) => {
	var d = [];
	for (var item of arr) {
		if (item.key === key) {
			d.push(item);
		}
		let treeData = getTreeList(key, item.children);
		d = [...d, ...treeData];
	}
	return d;
}

//删除
const remove = (node: Node, data: Tree) => {
	const parent = node.parent
	const children: Tree[] = parent.data.children || parent.data
	const index = children.findIndex((d) => d.key === data.key)
	children.splice(index, 1)
	dataSource.value = [...dataSource.value]
}

import ItemConfig from './CascadeItem.vue'
import {deepCopy, getRandomId, isNotBlank} from "../../../utils/objutil";
</script>

<template>
	<div>
		<item-config @ok="addItemOk" ref="itemConfigRef"></item-config>
		<el-dialog :width="800" v-model="dialogTableVisible" @close="close" :title="title" @opened="opened">

			<div class="custom-tree-container">
				<el-tree
						:data="dataSource"
						node-key="key"
						default-expand-all
						:expand-on-click-node="false"
				>
					<template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <el-link type="primary" @click="append(data)"> 新增下级 </el-link>
            <el-link type="warning" style="margin-left: 8px" @click="edit(data,node)"> 编辑 </el-link>
            <el-link type="danger" style="margin-left: 8px" @click="remove(node, data)"> 删除 </el-link>
          </span>
        </span>
					</template>
				</el-tree>
			</div>
			<template #footer>
      <span class="dialog-footer">
        <el-button type="warning" @click="addOneItem">添加选项</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </span>
			</template>
		</el-dialog>
	</div>

</template>

<style scoped lang="less">


.custom-tree-node {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 8px;
}
</style>

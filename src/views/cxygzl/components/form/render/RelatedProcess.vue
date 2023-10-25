<script setup lang="ts">

import {onMounted, ref} from "vue";

import {useFlowStore} from '../../../stores/flow'


let flowStore = useFlowStore();


const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
})

const numberFormList = computed(() => {

	return step2FormList.value.filter(res =>
			res.type === 'Number'
			||
			res.type === 'Money'
			||
			res.type === 'Score'
	);
})


const dialogTableVisible = ref(false);

const show = (title1,d) => {

	title.value = title1;

	itemList.value=d;

	dialogTableVisible.value = true;

}


defineExpose({show});


import {Delete} from "@element-plus/icons-vue";


const opened = () => {


}
const close = () => {
	clearItemList();
}

const title = ref('')

onMounted(() => {


});
let emits = defineEmits(['ok']);

const confirm = () => {
	emits('ok', itemList.value)
	dialogTableVisible.value = false;
}

const itemList = ref([])

const clearItemList = () => {
	itemList.value = []
}

const addItem = (value, name, tagtype,type) => {
	itemList.value.push({
		value: value,
		name: name,
		type: type,
	  tagtype:tagtype,
	})
}

</script>

<template>
	<el-dialog :width="540" v-model="dialogTableVisible" @close="close" :title="title" @opened="opened">

		<div style="position: relative;height: 200px;border: 1px solid lightgray;padding: 10px;">
			<el-tag class="tag1" style="margin-top: 5px;" :type="item.tagtype" v-for="item in itemList">
				{{ item.name }}
			</el-tag>

			<el-button style="position: absolute;bottom: 20px;right: 10px; " type="primary" :icon="Delete" text size="small"
								 @click="clearItemList">
				清除
			</el-button>
		</div>
		<div style="display: flex;flex-direction: row;margin-top: 20px;">
			<div style="width: 100px;">计算对象：</div>
			<div>
				<el-tag @click="addItem(item.id,item.name,'success','form')" class="tag1" type="success"
								v-for="item in numberFormList">
					{{ item.name }}
				</el-tag>

			</div>
		</div>
		<div style="display: flex;flex-direction: row;margin-top: 20px;">

			<div style="width: 100px;">计算符号：</div>
			<div>
				<el-tag @click="addItem('+','+','danger','number')" type="danger" class="tag1">+</el-tag>
				<el-tag @click="addItem('-','-','danger','number')" type="danger" class="tag1">-</el-tag>
				<el-tag @click="addItem('*','*','danger','number')" type="danger" class="tag1">*</el-tag>
				<el-tag @click="addItem('/','/','danger','number')" type="danger" class="tag1">/</el-tag>
				<el-tag @click="addItem('(','(','danger','number')" type="danger" class="tag1">(</el-tag>
				<el-tag @click="addItem(')',')','danger','number')" type="danger" class="tag1">)</el-tag>

			</div>
		</div>
		<div style="display: flex;flex-direction: row;margin-top: 20px;">

			<div style="width: 100px;">数字键盘：</div>
			<div>
				<div style="display: flex;flex-direction: row">
					<el-tag @click="addItem('1','1','default','number')" class="tag1">1</el-tag>
					<el-tag @click="addItem('2','2','default','number')" class="tag1">2</el-tag>
					<el-tag @click="addItem('3','3','default','number')" class="tag1">3</el-tag>

				</div>
				<div style="display: flex;flex-direction: row;margin-top: 10px;">
					<el-tag @click="addItem('4','4','default','number')" class="tag1">4</el-tag>
					<el-tag @click="addItem('5','5','default','number')" class="tag1">5</el-tag>
					<el-tag @click="addItem('6','6','default','number')" class="tag1">6</el-tag>

				</div>
				<div style="display: flex;flex-direction: row;margin-top: 10px;">
					<el-tag @click="addItem('7','7','default','number')" class="tag1">7</el-tag>
					<el-tag @click="addItem('8','8','default','number')" class="tag1">8</el-tag>
					<el-tag @click="addItem('9','9','default','number')" class="tag1">9</el-tag>

				</div>
				<div style="display: flex;flex-direction: row;margin-top: 10px;">
					<el-tag @click="addItem('0','0','default','number')" class="tag1">0</el-tag>
					<el-tag @click="addItem('.','.','default','number')" class="tag1">.</el-tag>

				</div>
			</div>
		</div>
		<template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </span>
		</template>
	</el-dialog>
</template>

<style scoped lang="less">
.tag1 {
	margin-right: 10px;
	cursor: pointer;
}
</style>

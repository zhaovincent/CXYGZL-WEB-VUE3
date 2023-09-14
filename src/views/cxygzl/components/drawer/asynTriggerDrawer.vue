
<template>
	<el-drawer :append-to-body="true" title="异步触发器设置" v-model="visible"


			 @open="openEvent"

						 class="set_copyer" :show-close="false" :size="550" :before-close="saveTrigger">


	  <el-form   :model="frontNotifyForm" ref="frontNotifyForm" :rules="rules"
			   label-width="120px" label-position="top">
		  <el-form-item label="请求地址" prop="url">
			  <el-alert type="warning" show-icon :closable="false">
				  <p>仅支持POST请求，以请求体方式接收参数</p>
			  </el-alert>
			  <el-input style="margin-top: 10px" :maxlength="100" v-model="frontNotifyForm.url"
						placeholder="http://www.cxygzl.com"/>
		  </el-form-item>

		  <el-form-item label="请求头">
			  <el-row style="width: 100%;margin-bottom: 20px" :gutter="20" v-for="(item,index) in frontNotifyForm.header">
				  <el-col :span="8">
					  <el-form-item
							  :prop="'header.' + index + '.field'"
							  :rules="[
       	{required: true, message: '请填写字段名称', trigger: 'blur'},
				  { min: 1, max: 50, message: '1<字段名称长度<50', trigger: 'blur' },
      ]"
					  >
						  <el-input v-model="item.field" :maxlength="100" placeholder="接收字段，比如userName"/>

					  </el-form-item>

				  </el-col>
				  <el-col :span="8">
					  <el-switch
							  @change="modeChange('frontNotify','header',index)"
							  v-model="item.valueMode"
							  size="large"
							  active-text="固定值"
							  inactive-text="表单"
					  />
				  </el-col>
				  <el-col :span="7">
					  <el-form-item
							  :prop="'header.' + index + '.value'"
							  :rules="[
       	{required: true, message: '请填写字段对应值', trigger: 'blur'},
				  { min: 1, max: 50, message: '1<字段对应值长度<50', trigger: 'blur' },
      ]"
					  >

						  <el-input v-if="item.valueMode" :maxlength="100" v-model="item.value" placeholder="固定内容"/>
						  <el-select v-else v-model="item.value" placeholder="选择表单" style="width: 100%">
							  <el-option
									  v-for="f in formListWithRoot"
									  :key="f.id"
									  :label="f.name"
									  :value="f.id"
							  />
						  </el-select>
					  </el-form-item>
				  </el-col>
				  <el-col :span="1">
					  <el-button @click="delOneLine('frontNotify','header',index)" text :icon="$icon['Delete']"></el-button>
				  </el-col>
			  </el-row>
			  <el-button text type="primary" @click="addOneLine('frontNotify','header')" :icon="$icon['Plus']">添加一行
			  </el-button>
		  </el-form-item>
		  <el-form-item label="请求体">
			  <el-row style="width: 100%;margin-bottom: 20px" :gutter="20" v-for="(item,index) in frontNotifyForm.body">
				  <el-col :span="8">
					  <el-form-item
							  :prop="'body.' + index + '.field'"
							  :rules="[
       	{required: true, message: '请填写字段名称', trigger: 'blur'},
				  { min: 1, max: 50, message: '1<字段名称长度<50', trigger: 'blur' },
      ]"
					  >
						  <el-input v-model="item.field" :maxlength="100" placeholder="接收字段，比如userName"/>

					  </el-form-item>

				  </el-col>
				  <el-col :span="8">
					  <el-switch
							  @change="modeChange('frontNotify','body',index)"
							  v-model="item.valueMode"
							  size="large"
							  active-text="固定值"
							  inactive-text="表单"
					  />
				  </el-col>
				  <el-col :span="7">
					  <el-form-item
							  :prop="'body.' + index + '.value'"
							  :rules="[
       	{required: true, message: '请填写字段对应值', trigger: 'blur'},
				  { min: 1, max: 50, message: '1<字段对应值长度<50', trigger: 'blur' },
      ]"
					  >

						  <el-input v-if="item.valueMode" :maxlength="100" v-model="item.value" placeholder="固定内容"/>
						  <el-select v-else v-model="item.value" placeholder="选择表单" style="width: 100%">
							  <el-option
									  v-for="f in formListWithRoot"
									  :key="f.id"
									  :label="f.name"
									  :value="f.id"
							  />
						  </el-select>
					  </el-form-item>
				  </el-col>
				  <el-col :span="1">
					  <el-button @click="delOneLine('frontNotify','body',index)" text :icon="$icon['Delete']"></el-button>
				  </el-col>
			  </el-row>
			  <el-button text type="primary" @click="addOneLine('frontNotify','body')" :icon="$icon['Plus']">添加一行
			  </el-button>
		  </el-form-item>

		<el-alert type="info" show-icon :closable="false" style="margin-bottom: 10px;">
			<p>
		  <el-link type="primary" href="https://www.cxygzl.com/guide/flow/node/asyntrigger.html" target="_blank">点击此处查看文档</el-link>

					</p>
		</el-alert>

	  </el-form>


  </el-drawer>
</template>
<script setup lang="ts">


import { useStore } from '../../stores/index'
import {ref, watch, computed, reactive} from 'vue'
let config = ref({})

const frontNotifyForm =  computed(()=>{
	return asynTriggerConfigData.value.value.httpSetting;
})

let store = useStore()
let { setAsynTriggerConfig, setAsynTrigger } = store
let asynTriggerDrawer = computed(()=> store.asynTriggerDrawer)
let asynTriggerConfigData = computed(()=> store.asynTriggerConfigData)
let visible = computed({
	get() {
		return asynTriggerDrawer.value
	},
	set() {
		closeDrawer()
	}
})
watch(asynTriggerConfigData, (val) => {
	config.value = val.value;
})

import * as util from '../../utils/objutil'


import {useFlowStore} from "../../stores/flow";
import {FormRules} from "element-plus";
import $func from "../../utils";

let flowStore = useFlowStore();


const rules = reactive<FormRules>({
	url: [
		{required: true, message: "请填写请求地址", type: 'url', trigger: "blur"}
	]
});


var formList = computed(() => {
	return flowStore.step2.filter(res=>res.type!='Description');
});

var formListWithRoot = computed(() => {
	let step2 = util.deepCopy(formList.value);
	step2.push({
		id: 'root',
		type: 'SelectUser',
		name: '发起人'
	})
	return step2;
});




const addOneLine = (k1, k2) => {
	(frontNotifyForm.value)[k2].push({
		field: '',
		valueMode: true,
		value: ''
	})
}
const delOneLine = (k1, k2, index) => {

  (frontNotifyForm.value)[k2].splice(index,1)
}
const modeChange = (k1, k2, index) => {
	(frontNotifyForm.value)[k2][index].value = '';

}

const  openEvent=()=>{

}



const saveTrigger = () => {




	config.value.error = !$func.checkTrigger(config.value)
	setAsynTriggerConfig({
		value: config.value,
		flag: true,
		id: asynTriggerConfigData.value.id
	})
	closeDrawer();
}
const closeDrawer = () => {
	setAsynTrigger(false)
}
</script>

<style lang="less" scoped>
</style>

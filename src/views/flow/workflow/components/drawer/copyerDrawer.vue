
<template>
	<el-drawer :append-to-body="true" title="抄送人设置" v-model="visible"


			 @open="openEvent"

						 class="set_copyer" :show-close="false" :size="550" :before-close="saveCopyer">

	  <el-tabs type="border-card">
		  <el-tab-pane label="设置抄送人">
		  <select-show   v-model:orgList="copyerConfig.nodeUserList" type="org"
					   :multiple="true"></select-show>
			</el-tab-pane>
		  <el-tab-pane label="表单权限">

		  <div style="display: flex;flex-direction: row;background-color: var(--el-fill-color-light)" effect="dark">
			  <div class="f1">表单字段</div>
			  <div class="f2">只读</div>
			  <div class="f4">隐藏</div>
		  </div>

		  <div v-if="step2FormList.length==0">
			  <el-empty description="暂无表单" />
		  </div>
		  <div style="display: flex;flex-direction: row;" v-for="item in step2FormList">
			  <div class="f1">	<span v-if="item.required" style="color: #c75450"> * </span>
				  <span>{{ item.name }}</span></div>
			  <el-radio-group v-model="copyerConfig.formPerms[item.id]" size="large"  >


				  <div class="f2"> <el-radio size="large" label="R"  ><span></span></el-radio></div>
				  <div class="f4"><el-radio size="large" label="H"  ><span></span></el-radio></div>
			  </el-radio-group>

		  </div>

	  </el-tab-pane>
		</el-tabs>
	</el-drawer>
</template>
<script setup>
import selectShow from "@/views/flow/workflow/components/dialog/selectAndShow.vue";

import $func from '../../utils/index'
import { useStore } from '../../stores/index'
import { ref, watch, computed } from 'vue'
let copyerConfig = ref({})

import {useFlowStore} from '../../stores/flow'
import { ElTable } from 'element-plus'
let flowStore = useFlowStore();


const step2FormList = computed(() => {
	let step2 = flowStore.step2;


	return step2;
})



let store = useStore()
let { setCopyerConfig, setCopyer } = store
let copyerDrawer = computed(()=> store.copyerDrawer)
let copyerConfig1 = computed(()=> store.copyerConfig1)
let visible = computed({
	get() {
		return copyerDrawer.value
	},
	set() {
		closeDrawer()
	}
})
watch(copyerConfig1, (val) => {
	copyerConfig.value = val.value;
})

const  openEvent=()=>{
	let value = step2FormList.value;
	var arr={};
	let formPerms = copyerConfig.value.formPerms;

	for(var item of value){
		arr[item.id]="R"
		if(formPerms[item.id]){
			arr[item.id]=formPerms[item.id]
		}
	}
	copyerConfig.value.formPerms=arr;
}

const saveCopyer = () => {
	copyerConfig.value.error = !$func.copyerStr(copyerConfig.value);
	setCopyerConfig({
		value: copyerConfig.value,
		flag: true,
		id: copyerConfig1.value.id
	})
	closeDrawer();
}
const closeDrawer = () => {
	setCopyer(false)
}
</script>

<style lang="less" scoped>

@width2:80px;
@width3:80px;
@width4:80px;

.f1{
  width: calc(100% - @width2 - @width3 - @width4);
  padding: 10px;
}
.f2{
  width: @width2;
  padding: 10px;

}
.f3{
  width: @width3;
  padding: 10px;

}
.f4{
  width: @width4;
  padding: 10px;

}
</style>

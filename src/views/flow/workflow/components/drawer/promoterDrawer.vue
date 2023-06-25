
<template>
	<el-drawer :append-to-body="true" title="发起人" v-model="visible" class="set_promoter" :show-close="false"
						 @open="openEvent"
						 :size="550" :before-close="savePromoter">
		<div class="demo-drawer__content">
			<el-tabs type="border-card">
				<el-tab-pane label="设置审批人">

			<select-show   v-model:orgList="starterConfig.nodeUserList" type="org"
						   :multiple="true"></select-show>
				</el-tab-pane>
				<el-tab-pane label="表单权限">

			<div style="display: flex;flex-direction: row;background-color: var(--el-fill-color-light)" effect="dark">

				<div class="f1">表单字段</div>
				<div class="f2">只读</div>
				<div class="f3">编辑</div>
				<div class="f4">隐藏</div>
			</div>

			<div v-if="step2FormList.length==0">
				<el-empty description="暂无表单" />
			</div>
			<div style="display: flex;flex-direction: row;" v-for="item in step2FormList">
				<div class="f1">	<span v-if="item.required" style="color: #c75450"> * </span>
					<span>{{ item.name }}</span></div>
				<el-radio-group v-model="starterConfig.formPerms[item.id]" size="large"  >


					<div class="f2"> <el-radio size="large" label="R"  ><span></span></el-radio></div>
					<div class="f3"><el-radio size="large" label="E" ><span></span></el-radio></div>
					<div class="f4"><el-radio size="large" label="H"  ><span></span></el-radio></div>
				</el-radio-group>

			</div>
				</el-tab-pane>
			</el-tabs>
<!--			<div class="promoter_content drawer_content">-->
<!--				<p>{{ $func.arrToStr(flowPermission) || '所有人' }}</p>-->
<!--			</div>-->


		</div>
	</el-drawer>
</template>
<script setup>
import selectShow from "@/views/flow/workflow/components/dialog/selectAndShow.vue";
import {useFlowStore} from '../../stores/flow'

import {useStore} from '../../stores/index'
import {computed, ref, watch} from 'vue'

let store = useStore()


let starterConfig = ref({})
let flowStore = useFlowStore();

let starterConfigData = computed(() => store.starterConfigData)
watch(starterConfigData, (val) => {
	starterConfig.value = val.value
})
const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
})

const  openEvent=()=>{
	let value = step2FormList.value;
	var arr={};
	let formPerms = starterConfig.value.formPerms;

	for(var item of value){
		arr[item.id]="E"
		if(formPerms[item.id]){
			arr[item.id]=formPerms[item.id]
		}
	}
	starterConfig.value.formPerms=arr;
}



let {setPromoter, setStarterConfig} = store
let promoterDrawer = computed(() => store.promoterDrawer)
let visible = computed({
	get() {
		return promoterDrawer.value
	},
	set() {
		closeDrawer()
	}
})
watch(starterConfigData, (val) => {
	starterConfig.value = val.value
})


const savePromoter = () => {
	setStarterConfig({
		value: starterConfig.value,
		flag: true,
		id: starterConfigData.value.id
	})
	closeDrawer()
}
const closeDrawer = () => {
	setPromoter(false)
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

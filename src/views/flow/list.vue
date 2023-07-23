<template>
	<div class="app-container">

		<el-card class="box-card" v-for="item in successGroupList">
			<template #header>
				<div class="card-header">
					<span>{{ item.name }}</span>


				</div>
			</template>
			<div style="display: flex;flex-direction: row;flex-wrap: wrap">
				<div v-for="(flow,index1) in item.items" :key="index1" class="item  ">
					<div class="f1">
						<el-avatar shape="square" :size="50"
											 :src="flow.logo"/>
					</div>
					<div class="f2">
						<div>{{ flow.name }}</div>
						<el-link @click="startProcess(flow)" type="primary">发起流程</el-link>
						<div></div>
					</div>

				</div>
			</div>

		</el-card>


			<start ref="startRef"></start>

	</div>
</template>

<script lang="ts" setup>

const startRef=ref();
import {

	queryMineStartGroupFlowList

} from "@/api/group";



import {ref, getCurrentInstance, onMounted} from 'vue'
import {GroupVO} from "@/api/group/types";
// proxy相当于 vue2的this，从getCurrentInstance 实例中获取，proxy对象
const {proxy} = getCurrentInstance()

const successGroupList = ref<GroupVO[]>([]);


import {useRouter} from 'vue-router'
import {FormVO} from "@/api/form/types";
import Start from "@/components/Flow/startFlow.vue";

const router = useRouter()


onMounted(() => {
	handleQuery()
})

//发起流程
const startProcess = (f) => {
	 startRef.value.handle(f)
}

function handleQuery() {
	queryMineStartGroupFlowList(false).then(res => {

		const {data} = res;
		successGroupList.value = data
	})
}

const formRenderRef = ref();



</script>
<style scoped lang="less">
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.text {
	font-size: 14px;
}

.item {
	margin: 5px 20px;
	padding: 5px;
	padding-bottom: 0px;
	width: 260px;
	display: flex;
	flex-direction: row;
	border-radius: 5px;
	border: 1px solid var(--el-color-info);

	.f1 {

	}

	.f2 {
		font-weight: bolder;
		height: 50px;
		margin-left: 15px;
		width: 183px;
	}

}

.item:hover {

	border: 1px solid var(--el-color-primary);

}

.box-card {
	width: 80%;
	margin-left: 10%;
	margin-top: 10px;
}
</style>

<template>
	<el-drawer :append-to-body="true" title="条件设置" v-model="visible" :show-close="false" :size="550"

						 @open="openEvent"


						 :before-close="saveCondition">
		<template #header="{ titleId, titleClass }">
			<h3 :id="titleId" :class="titleClass">条件设置</h3>

		</template>
		<el-form label-width="120px">
			<el-form-item label="条件组关系">
				<el-switch v-model="conditionConfig.groupRelationMode" active-text="固定关系"
									 inactive-text="自定义关系"/>
			</el-form-item>
		</el-form>
		<el-form label-width="120px" v-if="conditionConfig.groupRelationMode">
			<el-form-item label="固定关系">
				<el-switch v-model="conditionConfig.mode" active-text="且"
									 inactive-text="或"/>
			</el-form-item>
		</el-form>
		<el-form label-width="120px" v-else>
			<el-form-item label="自定义关系">
				<div class="demo-tagInput">
					<TagTextInput
							ref="refTagTextarea"
							class-name="demo"
							:default-value="conditionConfig.groupRelation"
							:readonly="false"
							:no-cursor="false"
							:min-height="200"
							:render-tag="renderTag"
							@on-change="onChange"
					/>

					<div class="tag-wrap" >
						<el-button v-for="item in  conditionConfig.conditionList.length" :key="item" @click="addTag('条件组'+item)">
							{{ '条件组' + item }}
						</el-button>
						<el-button  @click="addTag('或')">
						 	或
						</el-button>
						<el-button  @click="addTag('且')">
						 	且
						</el-button>
						<el-button  @click="addTag('(')">
						 	(
						</el-button>
						<el-button  @click="addTag(')')">
						 	)
						</el-button>
					</div>
				</div>
			</el-form-item>
		</el-form>

		<el-card class="box-card" v-for="(item,index) in conditionConfig.conditionList" :key="index"
						 style="margin-bottom: 20px">
			<template #header>
				<div class="card-header">
					<span>条件组{{ index + 1 }}</span>
					<el-switch v-model="item.mode" active-text="且"
										 inactive-text="或"/>

					<el-button text v-if="conditionConfig.conditionList.length>1"
										 @click="deleteGroup(index)"
										 :icon="$icon['Delete']"

					></el-button>
				</div>
			</template>
			<div v-for="(item1,index1) in item.conditionList" :key="index1">

				<div style="display: flex;flex-direction: row;justify-content: space-between">
					<div>
						{{ index1 == 0 ? '当' : (item.mode ? '且' : '或') }}
					</div>
					<div>
						<el-button text
											 @click="deleteCondition(index,index1)"
											 v-if="item.conditionList.length>1"
											 :icon="$icon['Delete']"

						></el-button>
					</div>
				</div>

				<condition :condition="item1"></condition>

			</div>
			<el-button dark type="success" style="margin-top: 20px;" @click="addOneCondition(item,index)">添加条件</el-button>

		</el-card>
		<el-button dark type="primary" @click="addOneConditionGroup">添加条件组</el-button>
	</el-drawer>
</template>
<script setup type="ts">
import {ref, watch, computed, getCurrentInstance} from 'vue'
import $func from '../../utils/index'
import {useStore} from '../../stores/index'
import TagTextInput from "@/components/TagInput/index.vue";
// 触发增加 tag
const refTagTextarea = ref();
const addTag = (id) => {
	refTagTextarea.value.insertColumnTag(id);
};
//假数据

const renderTag = (id, options) => {
	let tagName = `${id}`;
	const ele = document.createElement("div");
	ele.classList.add("tag-demo-con");
	ele.innerHTML = `<div class="tag-wrap"><div class="tag">${tagName}</div></div>`;
	return ele;

}


const onChange = (error, value, obj) => {
	 conditionConfig.value.groupRelation=value;
};

let conditionsConfig = ref({
	conditionNodes: [],
})
let conditionConfig = ref({
	groupRelation:''
})
let PriorityLevel = ref('')

let store = useStore()
let {setCondition, setConditionsConfig} = store
let conditionsConfig1 = computed(() => store.conditionsConfig1)
let conditionDrawer = computed(() => store.conditionDrawer)
let visible = computed({
	get() {
		return conditionDrawer.value
	},
	set() {
		closeDrawer()
	}
})
//删除条件组
const deleteGroup = (index) => {
	conditionConfig.value?.conditionList.splice(index, 1)
}
//刪除单个条件
const deleteCondition = (index, index1) => {
	conditionConfig.value?.conditionList[index].conditionList.splice(index1, 1)

}

//添加一个条件组
const addOneConditionGroup = () => {
	conditionConfig.value?.conditionList.push({
		mode: true,
		conditionList: [{}]
	})
}
//添加组内一个条件
const addOneCondition = (item, index) => {
	let conditionList = item.conditionList;
	if (!conditionList) {
		conditionList = [];
	}
	conditionList.push({});
	item.conditionList = conditionList;
}

import Condition from './components/condition.vue'
import {useFlowStore} from '../../stores/flow'

let flowStore = useFlowStore();


const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
})

const openEvent = () => {


}


watch(conditionsConfig1, (val) => {


	let conditionNodes = val.value.conditionNodes;

	for (var item of conditionNodes) {
		let groupList = item.conditionList;
		for (var group of groupList) {
			let conditionList = group.conditionList;
			for (var con of conditionList) {
				let key = con.key;
				if (key === 'root') {
					con.keyType = 'SelectUser'
				} else {
					let ele = step2FormList.value.filter(res => res.id === key);
					if (ele.length > 0) {
						con.keyType = ele[0].type;

					}
				}
			}

		}

	}


	conditionsConfig.value = val.value;
	PriorityLevel.value = val.priorityLevel
	conditionConfig.value = val.priorityLevel
			? conditionsConfig.value.conditionNodes[val.priorityLevel - 1]
			: {nodeUserList: [], conditionList: []}
})
const {proxy} = getCurrentInstance();


const saveCondition = () => {
	closeDrawer()
	var a = conditionsConfig.value.conditionNodes.splice(PriorityLevel.value - 1, 1)//截取旧下标
	conditionsConfig.value.conditionNodes.splice(conditionConfig.value.priorityLevel - 1, 0, a[0])//填充新下标
	conditionsConfig.value.conditionNodes.map((item, index) => {
		item.priorityLevel = index + 1
	});

	for (var i = 0; i < conditionsConfig.value.conditionNodes.length; i++) {
		let conditionNode = conditionsConfig.value.conditionNodes[i];

		conditionNode.error = false;
		if (i != conditionsConfig.value.conditionNodes.length - 1) {


			conditionNode.error = !$func.checkCondition(conditionsConfig.value,i);

		}


		conditionNode.placeHolder = $func.conditionStr(conditionsConfig.value, i);
	}
	setConditionsConfig({
		value: conditionsConfig.value,
		flag: true,
		id: conditionsConfig1.value.id
	})
}

const closeDrawer = (val) => {
	setCondition(false)
}
</script>
<style lang="less" scoped>
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}


.demo-tagInput {
	width: 100%;
	height: auto;
	margin: 10px;

	:deep {
		.tag-demo-con {
			.tag-wrap {
				height: 25px;
				line-height: 25px;

				.tag {
					display: inline-block;
					padding: 2px 8px;
					box-sizing: border-box;
					border-radius: 16px;
					background: #d8eeff;
					color: #174c76;
					border: 1px solid #bbd6ea;
					margin: 0 4px;
				}

				// padding: 4px;
				// margin: 4px;
				// border: 1px solid #ccc;
				// border-radius: 5px;
				// line-height: 1em;
				// min-width: 25px;
			}
		}
	}

	.tag-wrap {
		margin-top: 10px;
	}
}
</style>

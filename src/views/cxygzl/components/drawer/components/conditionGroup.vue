<template>
	<div>
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
				<el-button :icon="$icon['Delete']" @click="clearTag" type="danger" text>清空选项</el-button>

				<el-card style="min-height: 200px;width: 100%;">


					<el-tag
							style="margin-bottom: 10px;"
							v-for="(tag,index) in conditionConfig.groupRelation"
							:key="tag.name"
							class="mx-1"
							size="large"
							closable @close="delTag(index)"
							:type="tag.type"
					>
						{{ tag.name }}
					</el-tag>
				</el-card>
				<div class="demo-tagInput">


					<div class="tag-wrap">
						<el-button type="success" @click="addTag('或','success','||')">
							或
						</el-button>
						<el-button type="success" @click="addTag('且','success','&&')">
							且
						</el-button>
						<el-button type="danger" @click="addTag('(','danger','(')">
							(
						</el-button>
						<el-button type="danger" @click="addTag(')','danger',')')">
							)
						</el-button>
					</div>
					<div class="tag-wrap">
						<el-button type="primary" style="margin-top: 10px" v-for="item in  conditionConfig?.conditionList?.length"
											 :key="item" @click="addTag('条件组'+item,'primary','c'+item)">
							{{ '条件组' + item }}
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



	</div>
</template>

<script setup type="ts">
import {ref, watch, computed, getCurrentInstance} from 'vue'
import {useStore} from '../../../stores/index'


const addTag = (name, type, exp) => {
	conditionConfig.value.groupRelation.push({
		type: type,
		exp: exp,
		name: name
	})
};

const delTag = (index) => {
	conditionConfig.value.groupRelation.splice(index, 1)
}

const clearTag = () => {
	conditionConfig.value.groupRelation.splice(0, conditionConfig.value.groupRelation.length)
}


var props = defineProps({

	data: {
		type: Object,
		default: () => {
		}
	}
})


let conditionConfig = computed({
	get() {
		return props.data
	},
	set(t) {
		emits("update:data", t)

	}
})

let store = useStore()

//删除条件组
const deleteGroup = (index) => {
	conditionConfig.value?.conditionList.splice(index, 1)
}
//刪除单个条件
const deleteCondition = (index, index1) => {
	conditionConfig.value?.conditionList[index].conditionList.splice(index1, 1)

}
let emits = defineEmits(['update:data'])

//添加一个条件组
const addOneConditionGroup = () => {

	console.log(conditionConfig.value)

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

import Condition from './condition.vue'
import {useFlowStore} from '../../../stores/flow'

let flowStore = useFlowStore();


const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
})



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

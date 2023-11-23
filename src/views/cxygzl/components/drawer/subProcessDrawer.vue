<template>
	<el-drawer :append-to-body="true" title="子流程设置" v-model="visible"


			   @open="openEvent"

			   class="set_copyer" :show-close="false" :size="550" :before-close="saveDelay">
    <template #header="{ close, titleId, titleClass }">

      <title-handler :node-config="config"></title-handler>


    </template>

		<el-form label-width="120px" label-position="top">

			<el-form-item label="🌺选择子流程">


				<el-cascader v-model="config.subFlowIdArray" :options="flowListTree" @change="subFlowIdChange"/>
			</el-form-item>

			<el-form-item label="👉主→子变量传递">
				<el-row style="width: 100%;margin-bottom: 20px" :gutter="20" v-for="(item,index) in config.pcFormList">
					<el-col :span="12">
						<el-form-item


						>
							<el-form-item


							>

								<el-select v-model="item.field" @change="mainProcessFormChange(index)" placeholder="选择主流程表单"
										   style="width: 100%">
									<el-option
											v-for="f in mainFormList"
											:key="f.id"
											:label="f.name"
											:value="f.id"
									/>
								</el-select>
							</el-form-item>

						</el-form-item>

					</el-col>

					<el-col :span="11">
						<el-form-item


						>

							<el-select v-model="item.value" placeholder="选择子流程表单" style="width: 100%">
								<el-option
										v-for="f in getMatchSubProcessFormList(item.field)"
										:key="f.id"
										:label="f.name"
										:value="f.id"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="1">
						<el-button @click="delOneLine('pcFormList',index)" text :icon="$icon['Delete']"></el-button>
					</el-col>
				</el-row>
				<el-button text type="primary" @click="addOneLine('pcFormList')" :icon="$icon['Plus']">添加一行
				</el-button>
			</el-form-item>

			<el-form-item label="🫵是否多实例">
				<el-radio-group v-model="config.multiple" class="ml-4" @change="multipleChange">
					<el-radio :label="true" size="large">是</el-radio>
					<el-radio :label="false" size="large">否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="🤝是否并行" v-if="config.multiple">
				<el-radio-group v-model="config.sequential" class="ml-4">
					<el-radio :label="false" size="large">是</el-radio>
					<el-radio :label="true" size="large">否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="🤲完成比例(%)" v-if="config.multiple">

				<el-input-number v-model="config.completeRate" :precision="2" value-on-clear="max" controls-position="right"
								 :min="0.01"
								 :step="0.01" :max="100"/>

			</el-form-item>
			<el-form-item label="👏多实例来源" v-if="config.multiple">
				<el-radio-group v-model="config.multipleMode" class="ml-4" @change="multipleModeChange">
					<el-radio :label="1" size="large">固定数量</el-radio>
					<el-radio :label="2" size="large">数字表单</el-radio>
					<el-radio :label="3" size="large">多项表单</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="✍固定数量" v-if="config.multiple&&config.multipleMode==1">

				<el-input-number v-model="config.multipleModeValue" value-on-clear="min" controls-position="right" :min="1"
								 :step="1" :max="100"/>

			</el-form-item>
			<el-form-item label="✍数字表单" v-if="config.multiple&&config.multipleMode==2">
				<el-select v-model="config.multipleModeValue" placeholder="请选择表单">
					<el-option v-for="item in formNumberList" :label="item.name" :value="item.id"/>
				</el-select>
			</el-form-item>
			<el-form-item label="✍多项表单" v-if="config.multiple&&config.multipleMode==3">
				<el-select v-model="config.multipleModeValue" placeholder="请选择表单" @change="multipleFormChange">
					<el-option v-for="item in formMultiListComputed" :label="item.name" :value="item.id"/>
				</el-select>
			</el-form-item>
			<el-form-item label="多项表单单向变量传递" v-if="multipleFormTransferComputed">
				<el-select v-model="config.multipleSubFormId" placeholder="请选择表单">
					<el-option v-for="item in subProcessSingeFormComputed" :label="item.name" :value="item.id"/>
				</el-select>
			</el-form-item>
			<el-form-item label="👨‍💻子流程发起人">
				<el-radio-group v-model="config.starterMode">
					<el-radio :label="1">同主流程发起人</el-radio>
					<el-radio :label="2">表单</el-radio>
					<el-radio v-if="showSubProcessStarterMultiple" :label="3">多实例内部用户</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="发起人表单" v-if="config.starterMode==2">
				<el-select v-model="config.starterValue" placeholder="请选择发起人">
					<el-option v-for="item in formUserList" :label="item.name" :value="item.id"/>
				</el-select>
			</el-form-item>

			<el-form-item label="👆子→主变量传递" v-if="!config.multiple">
				<el-row style="width: 100%;margin-bottom: 20px" :gutter="20" v-for="(item,index) in config.cpFormList">
					<el-col :span="12">
						<el-form-item


						>
							<el-form-item


							>

								<el-select v-model="item.field" @change="subProcessFormChange(index)" placeholder="选择子流程表单"
										   style="width: 100%">
									<el-option
											v-for="f in subProcessFormItemList"
											:key="f.id"
											:label="f.name"
											:value="f.id"
									/>
								</el-select>
							</el-form-item>

						</el-form-item>

					</el-col>

					<el-col :span="11">
						<el-form-item


						>

							<el-select v-model="item.value" placeholder="选择主流程表单" style="width: 100%">
								<el-option
										v-for="f in getMatchMainFormList(item.field)"
										:key="f.id"
										:label="f.name"
										:value="f.id"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="1">
						<el-button @click="delOneLine('cpFormList',index)" text :icon="$icon['Delete']"></el-button>
					</el-col>
				</el-row>
				<el-button text type="primary" @click="addOneLine('cpFormList')" :icon="$icon['Plus']">添加一行
				</el-button>
			</el-form-item>

		</el-form>
	</el-drawer>
</template>
<script setup lang="ts">
import {
	addGroup,
	delGroup,
	queryGroupFlowList
} from "../../api/group";

import {
	getFlowDetail
} from "../../api/flow";


import $func from '../../utils/index'
import {useStore} from '../../stores/index'
import {ref, watch, computed, reactive} from 'vue'
import * as util from '../../utils/objutil'

//多项表单单向变量传递  是否显示
const multipleFormTransferComputed = computed(() => {

	var v = config.value;

	if (v.multiple && v.multipleMode == 3 && util.isNotBlank(v.multipleModeValue)) {
		return true
	}
	return false
})
let config = ref({})

const multipleFormChange = (e) => {


	config.value.starterMode = 1;
	config.value.multipleSubFormId = '';


}
const multipleChange = (e) => {


	config.value.starterMode = 1;


}

//判断是否显示子流程发起人--多实例用户
const showSubProcessStarterMultiple = computed(() => {
	let value = config.value;
	if (!(value.multiple && value.multipleMode == 3)) {
		return false;
	}
	let multipleModeValue = value.multipleModeValue;
	if (multipleModeValue == undefined) {
		return false;
	}
	let filterElement = formMultiListComputed.value.filter(res => res.id === multipleModeValue);
	if (filterElement.length == 0) {
		return false;
	}
	let t = filterElement[0].type;
	return t === 'SelectMultiUser'
})

const multipleModeChange = () => {
	config.value.multipleModeValue = ''

	config.value.starterMode = 1;
}

const addOneLine = (k1) => {
	(config.value)[k1].push({
		field: '',
		value: ''
	})
}
const delOneLine = (k1, index) => {

	(config.value)[k1].splice(index, 1)
}

let store = useStore()
let {setSubProcessConfig, setSubProcess} = store
let subProcessDrawer = computed(() => store.subProcessDrawer)
let subProcessConfigData = computed(() => store.subProcessConfigData)
let visible = computed({
	get() {
		return subProcessDrawer.value
	},
	set() {
		closeDrawer()
	}
})
watch(subProcessConfigData, (val) => {
	config.value = val.value;
})


const subProcessFormItemList = ref([]);

const mainProcessFormChange = (index) => {
	config.value.pcFormList[index].value = '';
}

const subProcessFormChange = (index) => {
	config.value.cpFormList[index].value = '';
}

const getMatchSubProcessFormList = (id) => {
	if (util.isBlank(id)) {
		return [];
	}
	let filter = mainFormList.value.filter(res => res.id === id);
	if (filter.length == 0) {
		return []
	}
	let type = filter[0].type;
	return subProcessFormItemList.value.filter(res => res.type === type);
}
const getMatchMainFormList = (id) => {
	if (util.isBlank(id)) {
		return [];
	}
	let filter = subProcessFormItemList.value.filter(res => res.id === id);
	if (filter.length == 0) {
		return []
	}
	let type = filter[0].type;
	return mainFormList.value.filter(res => res.type === type);
}

const subFlowIdChange = (a) => {

	handleSubFlowIdChange(a[1], true)
}

const handleSubFlowIdChange = (a, clearForm) => {
	console.log("流程id=", a)
	getFlowDetail(a).then(res => {
		const {data} = res;

		let formItems = data.formItems;
		subProcessFormItemList.value = JSON.parse(formItems).filter(r => r.type !== 'Description');

		if (clearForm) {
			config.value.pcFormList.splice(0, config.value.pcFormList.length)
			config.value.multipleSubFormId = ''

		}
	})
}

import {useFlowStore} from "../../stores/flow";
import TitleHandler from "./components/titleHandler.vue";


let flowStore = useFlowStore();


var formUserList = computed(() => {
	return mainFormList.value.filter(res => res.type === 'SelectUser');
});

var formNumberList = computed(() => {
	return mainFormList.value.filter(res => res.type === 'Number');
});

//多项表单列表
var formMultiListComputed = computed(() => {
	return mainFormList.value.filter(res =>
		res.type === 'SelectMultiUser'
		|| res.type === 'SelectMultiDept'
		|| res.type === 'UploadImage'
		|| res.type === 'UploadFile'
	);
});
//多项表单下的子级单项表单
const subProcessSingeFormComputed = computed(() => {
	var v = config.value;
	let parentFormId = v.multipleModeValue;
	let array = mainFormList.value.filter(res =>
		res.id === parentFormId
	);
	if (array.length == 0) {
		return [];
	}
	let formType = array[0].type;

	if (formType === 'SelectMultiUser') {
		return subProcessFormItemList.value.filter(res => res.type === 'SelectUser');

	}

	if (formType === 'SelectMultiDept') {
		return subProcessFormItemList.value.filter(res => res.type === 'SelectDept');

	}

	return subProcessFormItemList.value.filter(res => res.type === formType);


})


var mainFormList = computed(() => {
	return flowStore.step2.filter(res => res.type !== 'Description');
});

var flowListTree = ref([]);
const openEvent = () => {
	queryGroupFlowList(false).then(res => {

		const {data} = res;
		flowListTree.value = [];

		for (var g of data) {
			var obj = {
				value: g.id, label: g.name
			}
			var arr = []
			for (var h of g.items) {
				arr.push({
					value: h.flowId,
					label: h.name
				})
			}
			obj.children = arr;
			flowListTree.value.push(obj)

		}

	})

	let s = config.value.subFlowIdArray;
	if (util.isNotBlank(s) && s.length == 2) {

		handleSubFlowIdChange(s[1], false)

	}
}

const subFlowId = computed(() => {
	return config.value.subFlowIdArray;
})

watch(() => subFlowId.value, (v) => {

	console.log("子流程id变化了", v)


	for (var item of flowListTree.value) {

		let filter = item.children.filter(res => res.value === v[1]);
		if (filter.length > 0) {
			config.value.subFlowName = filter[0].label;
			config.value.subFlowId = filter[0].value;
			break
		} else {
			config.value.subFlowName = util.isNotBlank(config.value.subFlowName) ? config.value.subFlowName : ''
			config.value.subFlowId = ''
		}
	}

})


const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
})

watch(() => step2FormList.value, (val) => {

	let value = config.value;

	//

	if (value.starterMode == 2) {
		let length = val.filter(res => res.id === value.starterValue).length;
		if (length == 0) {
			value.starterValue = ''
		}
	}

	if (value.multiple) {
		if (value.multipleMode == 2 || value.multipleMode == 3) {


			let length = val.filter(res => res.id === value.multipleModeValue).length;
			if (length == 0) {
				value.multipleModeValue = ''
				value.starterMode = 1
			}

		}
	}

	if (value.pcFormList) {
		for (var item of value.pcFormList) {


			let length = val.filter(res => res.id === item.field).length;
			if (length == 0) {
				item.field = ''
				item.value = ''
			}

		}

	}


})

const saveDelay = () => {


	// config.value.error = !$func.subProcessOK(config.value)


  config.value.error = !$func.subProcessOK(config.value).ok
  config.value.errorMsg = $func.subProcessOK(config.value).msg

  setSubProcessConfig({
		value: config.value,
		flag: true,
		id: subProcessConfigData.value.id
	})
	closeDrawer();
}
const closeDrawer = () => {
	setSubProcess(false)
}
</script>

<style lang="less" scoped>
</style>

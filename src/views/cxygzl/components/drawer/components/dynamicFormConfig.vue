<script setup lang="ts">

import {computed, reactive, ref} from "vue";
import * as util from "../../../utils/objutil";
import {useFlowStore} from "../../../stores/flow";

const props = defineProps({
	config: {
		type: Object,
		default: () => {
			return {};
		},
	}
});

let flowStore = useFlowStore();
const rules = reactive({
	url: [
		{required: true, message: "请填写请求地址", type: 'url', trigger: "blur"}
	]
});
const frontNotifyForm = computed({
	get() {
		return props.config.dynamicFormConfig;
	},
	set(t) {
		// props.config.dynamicFormConfig=t;
	}
})
var formList = computed(() => {
	return flowStore.step2.filter(res => res.type != 'Description');
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

var formResultConfigList = ref([
	{
		id: 'value', name: '值'
	}, {
		id: 'min', name: '最小值'
	}, {
		id: 'max', name: '最大值'
	}, {
		id: 'minLength', name: '最小长度'
	}, {
		id: 'maxLength', name: '最大长度'
	}, {
		id: 'perm', name: '表单权限'
	}, {
		id: 'required', name: '是否必填'
	}, {
		id: 'radixNum', name: '小数位数'
	}
])
const addOneLine = (k1, k2) => {
	(frontNotifyForm.value)[k2].push({
		field: '',
		valueMode: true,
		value: ''
	})
}
const delOneLine = (k1, k2, index) => {

	(frontNotifyForm.value)[k2].splice(index, 1)
}
const modeChange = (k1, k2, index) => {

	(frontNotifyForm.value)[k2][index].value = '';

}
import useClipboard from 'vue-clipboard3';

const {toClipboard} = useClipboard();

async function ImportConfig() {
	let copyText = await navigator.clipboard.readText();
	console.log('剪切板内容', copyText)
	//处理数据
	let parse = JSON.parse(copyText);
	frontNotifyForm.value.url = parse.url
	frontNotifyForm.value.header = parse.header
	frontNotifyForm.value.body = parse.body
	frontNotifyForm.value.result = parse.result
}


const copy = async () => {
	try {
		let value = frontNotifyForm.value;
		await toClipboard(JSON.stringify(value));
		console.log('复制成功!')
	} catch (e) {
		console.log(e);
	}
};

</script>

<template>
	<view>

		<el-switch
				v-model="frontNotifyForm.enable"
				size="large"
				active-text="启用"
				inactive-text="关闭"
		/>
		<template v-if="frontNotifyForm.enable">
		<el-divider/>

			<el-button text type="danger" @click="copy" :icon="$icon['CopyDocument']">复制当前配置
			</el-button>
			<el-button text type="danger" @click="ImportConfig" :icon="$icon['DocumentAdd']">粘贴配置
			</el-button>
			<el-divider/>
			<el-form :model="frontNotifyForm" ref="frontNotifyForm" :rules="rules"
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
						<el-col :span="6">
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
						<el-col :span="9">
							<el-switch
									@change="modeChange('frontNotify','header',index)"
									v-model="item.valueMode"
									size="large"
									active-text="固定值"
									inactive-text="表单"
							/>
						</el-col>
						<el-col :span="6">
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
						<el-col :span="3">
							<el-button @click="delOneLine('frontNotify','header',index)" text :icon="$icon['Delete']"></el-button>
						</el-col>
					</el-row>
					<el-button text type="primary" @click="addOneLine('frontNotify','header')" :icon="$icon['Plus']">添加一行
					</el-button>
				</el-form-item>
				<el-form-item label="请求体">
					<el-row style="width: 100%;margin-bottom: 20px" :gutter="20" v-for="(item,index) in frontNotifyForm.body">
						<el-col :span="6">
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
						<el-col :span="9">
							<el-switch
									@change="modeChange('frontNotify','body',index)"
									v-model="item.valueMode"
									size="large"
									active-text="固定值"
									inactive-text="表单"
							/>
						</el-col>
						<el-col :span="6">
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
						<el-col :span="3">
							<el-button @click="delOneLine('frontNotify','body',index)" text :icon="$icon['Delete']"></el-button>
						</el-col>
					</el-row>
					<el-button text type="primary" @click="addOneLine('frontNotify','body')" :icon="$icon['Plus']">添加一行
					</el-button>
				</el-form-item>
				<el-form-item label="返回值">
					<el-alert type="warning" show-icon :closable="false" style="margin-bottom: 10px;">
						<p>通过接口可以修改表单值：左侧表单表示要修改的表单值，右侧字段是指接口返回的字段名</p>
					</el-alert>
					<el-row style="width: 100%;margin-bottom: 20px" :gutter="20" v-for="(item,index) in frontNotifyForm.result">
						<el-col :span="7">
							<el-form-item
									:prop="'result.' + index + '.value'"
									:rules="[
       	{required: true, message: '请选择表单', trigger: 'blur'}
      ]"
							>


								<el-select v-model="item.value" placeholder="选择表单" style="width: 100%">
									<el-option
											v-for="f in formList"
											:key="f.id"
											:label="f.name"
											:value="f.id"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-select v-model="item.contentConfig" placeholder="选择表单配置项" style="width: 100%">
								<el-option
										v-for="f in formResultConfigList"
										:key="f.id"
										:label="f.name"
										:value="f.id"
								/>
							</el-select>
						</el-col>
						<el-col :span="7">
							<el-form-item
									:prop="'result.' + index + '.field'"
									:rules="[
       	{required: true, message: '请填写字段名称', trigger: 'blur'},
				  { min: 1, max: 50, message: '1<字段名称长度<50', trigger: 'blur' },
      ]"
							>
								<el-input v-model="item.field" :maxlength="100" placeholder="接收字段，比如userName"/>

							</el-form-item>

						</el-col>


						<el-col :span="3">
							<el-button v-if="frontNotifyForm.result.length>1" @click="delOneLine('frontNotify','result',index)" text :icon="$icon['Delete']"></el-button>
						</el-col>
					</el-row>
					<el-button text type="primary" @click="addOneLine('frontNotify','result')" :icon="$icon['Plus']">添加一行
					</el-button>
				</el-form-item>


			</el-form>
		</template>
	</view>

</template>

<style scoped lang="less">

</style>

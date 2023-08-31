<template>
	<div>
		<div class="container-div" style="margin-top: 20px">
			<el-card class="box-card">


				<h3>前置校验

					<el-text type="info" size="small">
						<el-icon>
							<Aim/>
						</el-icon>
						流程启动前触发
					</el-text>
					<el-switch
							v-model="frontCheckForm.enable"
							size="large"
					/>
				</h3>

				<el-form v-if="frontCheckForm.enable" :model="frontCheckForm" ref="frontCheckForm" :rules="rules"
								 label-width="120px" label-position="top">
					<el-form-item label="请求地址" prop="url">
						<el-alert type="warning" show-icon :closable="false">
							<p>仅支持POST请求，以请求体方式接收参数</p>
						</el-alert>
						<el-input style="margin-top: 10px" :maxlength="100" v-model="frontCheckForm.url"
											placeholder="http://www.cxygzl.com"/>
					</el-form-item>

					<el-form-item label="请求头">
						<el-row style="width: 100%;margin-bottom: 20px" :gutter="20" v-for="(item,index) in frontCheckForm.header">
							<el-col :span="9">
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
							<el-col :span="6">
								<el-switch
										@change="modeChange('frontNotify','header',index)"
										v-model="item.valueMode"
										size="large"
										active-text="固定值"
										inactive-text="表单"
								/>
							</el-col>
							<el-col :span="8">
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
						<el-row style="width: 100%;margin-bottom: 20px" :gutter="20" v-for="(item,index) in frontCheckForm.body">
							<el-col :span="9">
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
							<el-col :span="6">
								<el-switch
										@change="modeChange('frontNotify','body',index)"
										v-model="item.valueMode"
										size="large"
										active-text="固定值"
										inactive-text="表单"
								/>
							</el-col>
							<el-col :span="8">
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
					<el-form-item label="返回值">
						<el-alert type="warning" show-icon :closable="false" style="margin-bottom: 10px;">
							<p>接口返回校验结果，格式如下:</p>
								<p>
										{
    									"ok": false,
   										 "msg": "假期余额不足"
										}
								</p>
						</el-alert>

					</el-form-item>


				</el-form>


				<h3>前置通知

					<el-text type="info" size="small">
						<el-icon>
							<Aim/>
						</el-icon>
						流程启动时触发
					</el-text>
					<el-switch
							v-model="frontNotifyForm.enable"
							size="large"
					/>
				</h3>

				<el-form v-if="frontNotifyForm.enable" :model="frontNotifyForm" ref="frontNotifyForm" :rules="rules"
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
							<el-col :span="9">
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
							<el-col :span="6">
								<el-switch
										@change="modeChange('frontNotify','header',index)"
										v-model="item.valueMode"
										size="large"
										active-text="固定值"
										inactive-text="表单"
								/>
							</el-col>
							<el-col :span="8">
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
							<el-col :span="9">
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
							<el-col :span="6">
								<el-switch
										@change="modeChange('frontNotify','body',index)"
										v-model="item.valueMode"
										size="large"
										active-text="固定值"
										inactive-text="表单"
								/>
							</el-col>
							<el-col :span="8">
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
					<el-form-item label="返回值">
						<el-alert type="warning" show-icon :closable="false" style="margin-bottom: 10px;">
							<p>通过接口可以修改表单值：左侧表单表示要修改的表单值，右侧字段是指接口返回的字段名</p>
						</el-alert>
						<el-row style="width: 100%;margin-bottom: 20px" :gutter="20" v-for="(item,index) in frontNotifyForm.result">
							<el-col :span="10">
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
							<el-col :span="13">
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


							<el-col :span="1">
								<el-button @click="delOneLine('frontNotify','result',index)" text :icon="$icon['Delete']"></el-button>
							</el-col>
						</el-row>
						<el-button text type="primary" @click="addOneLine('frontNotify','result')" :icon="$icon['Plus']">添加一行
						</el-button>
					</el-form-item>


				</el-form>


				<h3>后置通知

					<el-text type="info" size="small">
						<el-icon>
							<Aim/>
						</el-icon>
						流程结束时触发
					</el-text>
					<el-switch
							v-model="backNotifyForm.enable"
							size="large"
					/>
				</h3>

				<el-form v-if="backNotifyForm.enable" :model="backNotifyForm" ref="backNotifyForm" :rules="rules"
								 label-width="120px" label-position="top">
					<el-form-item label="请求地址" prop="url">
						<el-alert type="warning" show-icon :closable="false">
							<p>仅支持POST请求，以请求体方式接收参数</p>
						</el-alert>
						<el-input style="margin-top: 10px" :maxlength="100" v-model="backNotifyForm.url"
											placeholder="http://www.cxygzl.com"/>
					</el-form-item>

					<el-form-item label="请求头">
						<el-row style="width: 100%;margin-bottom: 20px" :gutter="20" v-for="(item,index) in backNotifyForm.header">
							<el-col :span="9">
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
							<el-col :span="6">
								<el-switch
										@change="modeChange('backNotify','header',index)"
										v-model="item.valueMode"
										size="large"
										active-text="固定值"
										inactive-text="表单"
								/>
							</el-col>
							<el-col :span="8">
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
								<el-button @click="delOneLine('backNotify','header',index)" text :icon="$icon['Delete']"></el-button>
							</el-col>
						</el-row>
						<el-button text type="primary" @click="addOneLine('backNotify','header')" :icon="$icon['Plus']">添加一行
						</el-button>
					</el-form-item>
					<el-form-item label="请求体">
						<el-row style="width: 100%;margin-bottom: 20px" :gutter="20" v-for="(item,index) in backNotifyForm.body">
							<el-col :span="9">
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
							<el-col :span="6">
								<el-switch
										@change="modeChange('backNotify','body',index)"
										v-model="item.valueMode"
										size="large"
										active-text="固定值"
										inactive-text="表单"
								/>
							</el-col>
							<el-col :span="8">
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
								<el-button @click="delOneLine('backNotify','body',index)" text :icon="$icon['Delete']"></el-button>
							</el-col>
						</el-row>
						<el-button text type="primary" @click="addOneLine('backNotify','body')" :icon="$icon['Plus']">添加一行
						</el-button>
					</el-form-item>
					<el-form-item label="返回值">
						<el-alert type="warning" show-icon :closable="false" style="margin-bottom: 10px;">
							<p>通过接口可以修改表单值：左侧表单表示要修改的表单值，右侧字段是指接口返回的字段名</p>
						</el-alert>
						<el-row style="width: 100%;margin-bottom: 20px" :gutter="20" v-for="(item,index) in backNotifyForm.result">
							<el-col :span="10">
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
							<el-col :span="13">
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


							<el-col :span="1">
								<el-button @click="delOneLine('backNotify','result',index)" text :icon="$icon['Delete']"></el-button>
							</el-col>
						</el-row>
						<el-button text type="primary" @click="addOneLine('backNotify','result')" :icon="$icon['Plus']">添加一行
						</el-button>
					</el-form-item>


				</el-form>

			</el-card>
		</div>

	</div>
</template>

<script lang="ts" setup>
import {Check, Plus, Aim, Link} from "@element-plus/icons-vue";

import {ref, onMounted, defineExpose, toRaw} from "vue";


import type {FormInstance, FormRules} from "element-plus";

const {proxy} = getCurrentInstance();

const addOneLine = (k1, k2) => {
	flowStore.addStep4OneLine(k1, k2)
}
const delOneLine = (k1, k2, index) => {
	flowStore.delStep4OneLine(k1, k2, index)
}
const modeChange = (k1, k2, index) => {
	flowStore.clearStep4Value(k1, k2, index)
}

const validate = (f) => {
	let backEnable = backNotifyForm.value.enable;
	let frontEnable = frontNotifyForm.value.enable;
	let frontCheckEnable = frontCheckForm.value.enable;

	var list=[];
	if(frontEnable){
		list.push(proxy.$refs.frontNotifyForm)
	}
	if(backEnable){
		list.push(proxy.$refs.backNotifyForm)
	}
	if(frontCheckEnable){
		list.push(proxy.$refs.frontCheckForm)
	}

	circleValidate(0,list,f)

};

function circleValidate(idx, list, f) {

	if (idx >= list.length) {
		f(true)
		return;
	}

	list[idx].validate((valid, fields) => {
		if (!valid) {
			var arr = [];

			for (var err in fields) {
				arr.push(fields[err][0].message)
			}
			f(valid, arr);
		}else{
			circleValidate(idx+1,list,f)
		}


	});
}

// 暴露方法和属性给父组件
defineExpose({validate});
const rules = reactive<FormRules>({
	url: [
		{required: true, message: "请填写请求地址", type: 'url', trigger: "blur"}
	]
});

import {useRoute} from "vue-router";

const route = useRoute();


onMounted(() => {


});


import {reactive, ref, computed} from "vue";

import {useFlowStore} from "../workflow/stores/flow";

let flowStore = useFlowStore();

var step4Store = computed(() => {
	return flowStore.step4;
});


var formList = computed(() => {
	return flowStore.step2.filter(res => res.type != 'Description');
});

var formListWithRoot = computed(() => {
	let step2 = proxy.$deepCopy(formList.value);
	step2.push({
		id: 'root',
		type: 'SelectUser',
		name: '发起人'
	})
	return step2;
});

var frontNotifyForm = computed(() => {
	return step4Store.value.frontNotify;
});

var frontCheckForm = computed(() => {
	return step4Store.value.frontCheck;
});

var backNotifyForm = computed(() => {
	return step4Store.value.backNotify;
});


</script>
<style scoped lang="less">
.container-div {
	width: 800px;
	margin-left: calc(50% - 400px);

}

</style>

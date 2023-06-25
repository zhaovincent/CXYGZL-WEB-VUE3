<template>
	<div>
		<el-container>
			<el-aside width="300px">
				<div effect="dark">
					<h4 style="text-align: center">组件库</h4>
					<draggable
							v-model="oriFormList"
							ghost-class="ghost" :force-fallback="true"
							item-key="index"
							:sort="false"
							@end="dragEnd"
							:animation="300"
							:group="{ name: 'list', pull: 'clone', put: false }"
							@change="dragChanged"
							:clone='cloneFunc'
					>
						<template #item="{ element }">
							<div class="zj">
								<el-button size="large" style="width: 100%" :icon="$icon[element.icon]"
								>{{ element.name }}
								</el-button>
							</div>
						</template>
					</draggable>

				</div>

			</el-aside>
			<el-main>
				<div style="display: flex;flex-direction: row">

					<div class="f11">
						<el-form label-position="top">
							<draggable
									v-model="targetList"
									class="drag-content"
									item-key="index"
									:sort="true"
									effect="dark"
									:group="{ name: 'list', pull: false, put: true }"
									@change="dragChanged"
							>
								<template #item="{ element, index }">
									<div
											class="okcomponent border line " effect="dark"
											@click.stop="showConfigPanel(element.id)"
									>


										<el-icon class="deleteIcon" @click.stop="deleteForm(element.id)">
											<Delete/>
										</el-icon>
										<el-form-item :label="step2Object[element.id]?.name" :required="step2Object[element.id]?.required">

											<component style="width: 100%"
																 :is="getFormWidget(element.type)"
																 :id="element.id"
																 v-model:form="step2Object[element.id]"
											></component>
										</el-form-item>

									</div>
								</template>
							</draggable>
						</el-form>

					</div>
					<div class="f22" v-if="currentForm">
						<el-card class="box-card">
							<template #header>
								<div class="card-header">
									{{ currentForm?.typeName }}
								</div>
							</template>
							<el-form label-width="120px" label-position="top">
								<el-form-item required label="标题">
									<el-input v-model="currentForm.name" maxlength="10"/>
								</el-form-item>

								<el-form-item label="默认提示">
									<el-input v-model="currentForm.placeholder" maxlength="20"/>
								</el-form-item>

								<component
										:is="getFormConfigWidget(currentForm.type)"
										:id="currentForm.id"
										ref="currentFormConfigRef"
								></component>
								<el-form-item label="其他">
									<el-checkbox v-model="currentForm.required" label="必填"/>
								</el-form-item>
							</el-form>

						</el-card>


					</div>

				</div>

			</el-main>
		</el-container>

	</div>
</template>

<script lang="ts" setup>
import {ref} from "vue";

import {formValidateDict} from '../utils/formValidate'

const currentFormConfigRef = ref();
var step2List = computed(() => {
	let step2 = flowStore.step2;
	return step2;
});
var step2Object = computed(() => {
	var obj = {}

	step2List.value.forEach(res => obj[res.id] = res)

	return obj;
});

import {Delete, Edit, Search, Share, Upload} from "@element-plus/icons-vue";
import {useFlowStore} from "../workflow/stores/flow";

const cloneFunc = (el) => {
	el.id = proxy.$getRandomId();
	return el;
}
const deleteForm = (id) => {

	flowStore.setStep2(flowStore.step2.filter(res => res.id !== id));

	targetList.value = targetList.value.filter(res => res.id !== id);

	if (currentForm.value && currentForm.value?.id === id) {
		currentForm.value = undefined
	}

};

const beforeCloseConfigPanel = (done) => {
	if (proxy.$isBlank(currentForm.value?.name)) {
		ElMessage.error("请输入标题");

		return;
	}

	let validate = currentFormConfigRef.value.validate();
	if (validate) {
		done();
		return;
	}
};

const drawer = ref(false);

//定义当前打开的表单
const currentForm = ref<FormVO>();

const showConfigPanel = (id) => {
	currentForm.value = flowStore.step2.filter(res => res.id === id)[0];
	drawer.value = true;
};

let flowStore = useFlowStore();
//要注意导入
import getFormName from "../utils/getFormWidget";
import getFormConfigName from "../utils/getFormConfigWidget";

const getFormWidget = (name: string) => {
	//写的时候，组件的起名一定要与dragList中的element名字一模一样，不然会映射不上
	return getFormName[name];
};

const getFormConfigWidget = (name: string) => {
	//写的时候，组件的起名一定要与dragList中的element名字一模一样，不然会映射不上
	return getFormConfigName[name];
};

const {proxy} = getCurrentInstance();

const dragEnd = (a) => {
	let oldIndex = a.oldIndex;

	let valueElement = oriFormList.value[oldIndex];

	oriFormList.value.splice(oldIndex, 1, proxy.$deepCopy(valueElement))

}
// 开始拖拽
const dragChanged = (a) => {

	console.log("拖拽", a)


	var l = targetList.value


	flowStore.setStep2(l);
};


import draggable from "vuedraggable";
import {FormVO} from "@/api/form/types";
import {formConfig} from "@/api/form/data";
import {computed} from "vue";
import {defineExpose} from "vue/dist/vue";

let oriFormList = ref<FormVO[]>(formConfig);

let targetList = ref<Array<FormVO>>([]);

watch(() => flowStore.step2, (val) => {

	if (val.length > targetList.value.length && targetList.value.length == 0) {
		targetList.value = proxy.$deepCopy(val)

	}
})
const validate = (f) => {

	var err = []

	let formList = step2List.value;
	for (var form of formList) {


		let formValidateDictElement = formValidateDict[form.type];
		if (formValidateDictElement) {
			let result = formValidateDictElement(form, proxy);

			if (!result.valid) {
				err.push(result.msg)
			}
		}


	}

	let newList = Array.from(new Set(formList.map(res => res.name)))

	if (newList.length < formList.length) {
		err.push("表单名称不能重复");
	}

	f(err.length == 0, err);
};
defineExpose({validate});
</script>
<style scoped lang="less">
.zj {
	display: inline-block;
	width: 140px;
	margin: 5px;
}

@center_width: 360px;
.drag-content {
	min-height: 636px; //建议是外层嵌套一层div，div固定高，此处再设为100%
	border: 1px solid;
	width: @center_width;
	border-radius: 10px;
	padding: 10px 10px;


}


.f11 {
	width: calc(100% - 400px);
}

.f22 {
	width: 400px;

}

.okcomponent {
	padding: 5px;
	border-radius: 5px;
	margin-bottom: 10px;

}

.deleteIcon {
	position: absolute;
	margin-left: calc(@center_width - 50px);
	z-index: 20;
}

.deleteIcon:hover {
	cursor: pointer;
	color: palevioletred;
}
</style>

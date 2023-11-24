<template>
	<div>
		<el-container>
			<el-aside width="400px">
				<div effect="dark" style="background-color: white;margin-top: 0px;padding-top: 20px">
					<h4 style="text-align: center">组件库</h4>
					<template v-for="(item,index) in oriFormList">
						<h5 style="padding-left: 60px">{{ item.name }}</h5>
						<draggable
                    disabled
								v-model="item.formList"
								ghost-class="ghost" :force-fallback="true"
								item-key="index"
								:sort="false"
								@end="dragEnd"
								@start="drag=true"
								class="leftItem"
								:animation="300"
								:group="{ name: 'dragFormList', pull: 'clone', put: false }"

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
					</template>


				</div>

			</el-aside>
			<el-main>
				<div style="display: flex;flex-direction: row">

					<div class="f11">
						<div
								class="drag-content"

						>
							<div style="text-align: center;font-size: 15px;font-weight: bold;margin-bottom: 20px">{{ flowName }}</div>
							<div class="drag-content-inner">


								<el-form label-position="top">
									<draggable
                          disabled
											v-model="targetList"
											style="min-height: 600px;background-color: var(--el-bg-color-page)"
											item-key="index"
											:sort="true"
											effect="dark"
											:group="{ name: 'dragFormList', pull: true, put: !step4.dbRecord.enable }"
									>
										<template #item="{ element, index }">
											<div
													class="okcomponent border line  " effect="dark"
													:class="{'active-component':isCurrentForm(element.id)}"
													@click.stop="showCurrentPageConfigPanel(element.id)"
											>


												<el-icon v-if="element.type!='Empty'&&!step4.dbRecord.enable" class="deleteIcon" @click.stop="deleteForm(element.id)">
													<Delete/>
												</el-icon>
												<el-form-item :label="step2Object[element.id]?.name"
																			:required="step2Object[element.id]?.required">

													<component style="width: 100%"
																		 @showPanel="showPanel"
																		 :index="index"
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
						</div>

					</div>
					<div class="f22" v-if="currentForm">
						<el-card class="box-card">
							<template #header>
								<div class="card-header">
									{{ currentForm?.typeName }}
								</div>
							</template>
              <el-tabs v-model="activeConfigTab" type="border-card" class="demo-tabs" >
                <el-tab-pane  label="基础" name="base">
                  <el-form label-width="120px" label-position="top">
                    <el-form-item required label="标题">
                      <el-input v-model="currentForm.name" maxlength="10"/>
                    </el-form-item>

                    <el-form-item label="提示" :required="currentForm.type==='Description'">
                      <el-input v-model="currentForm.placeholder" maxlength="50"/>
                    </el-form-item>

                    <component
                        :is="getFormConfigWidget(currentForm.type)"
                        :id="currentForm.id"
                        ref="currentFormConfigRef"
                    ></component>
                    <el-form-item label="其他">
                      <el-checkbox v-model="currentForm.required" label="必填"/>
                      <el-checkbox v-model="currentForm.printable" label="打印"/>
                    </el-form-item>
                  </el-form>

                </el-tab-pane>
                <el-tab-pane label="动态表单" name="dynamic">
                  <form-dynamic-config :current-form="currentForm" />
                </el-tab-pane>
              </el-tabs>

						</el-card>


					</div>

				</div>

			</el-main>
		</el-container>

	</div>
</template>

<script lang="ts" setup>
import {ref,computed} from "vue";

import {formValidateDict} from '../../utils/formValidate'

import {Delete} from "@element-plus/icons-vue";
import {useFlowStore} from "../../stores/flow";
//要注意导入
import getFormName from "../../utils/getFormWidget";
import getFormConfigName from "../../utils/getFormConfigWidget";
import draggable from "vuedraggable";
import {FormGroupVO} from "../../api/form/types";
import {formGroupConfig} from "../../api/form/data";
import * as util from "../../utils/objutil";

import FormDynamicConfig from "./components/formDynamicConfig.vue";

const activeConfigTab = ref('base');

const drag = ref(false);

const currentFormConfigRef = ref();
var step2List = computed(() => {
	let step2 = flowStore.step2;
	return step2;
});
var step4 = computed(() => {
	let step2 = flowStore.step4;
	return step2;
});
var step2Object = computed(() => {
	var obj = {}

	step2List.value.forEach(res => obj[res.id] = res)

	return obj;
});

const flowName = computed(() => {
	let name1 = flowStore.step1.name;
	if (util.isBlank(name1)) {
		return '未命名表单'
	}
	return name1
})
//判断是否选中当前表单显示边框
var isCurrentForm = (fid) => {
	if (!currentForm.value) {
		return false;
	}
	if (currentForm.value.id === fid) {
		return true;
	}

	let step2 = flowStore.step2;


	let list = step2.filter(res => res.type === 'Layout'&&res.id===fid);
	for (var item of list) {
		let value = item.props.value;
		var valueList = value.filter(res => res.id === currentForm.value.id);
		if (valueList.length > 0) {
			return true
		}
	}
	return false;
}
const cloneFunc = (el) => {
	el.id = util.getRandomId();
	return el;
}
const deleteForm = (id) => {

	let existForm = flowStore.step2.filter(res => res.id === id)[0];
	if (existForm.type === 'Layout' && currentForm.value) {
		//明细
		let value = existForm.props.value;
		let filter = value.filter(res => res.id === currentForm.value.id);
		if (filter.length > 0) {
			currentForm.value = undefined

		}
	}


	flowStore.setStep2(flowStore.step2.filter(res => res.id !== id));

	if (currentForm.value && currentForm.value?.id === id) {
		currentForm.value = undefined
	}


};


//定义当前打开的表单
const currentForm = ref();
const drawer = ref(false);

const showCurrentPageConfigPanel = (id) => {
    if(step4.value.dbRecord.enable){
        return
		}
	currentForm.value = flowStore.step2.filter(res => res.id === id)[0];
	drawer.value = true;
};
const showPanel = (form) => {
	currentForm.value = form;
}

let flowStore = useFlowStore();

const getFormWidget = (name: string) => {
	//写的时候，组件的起名一定要与dragList中的element名字一模一样，不然会映射不上
	return getFormName[name];
};

const getFormConfigWidget = (name: string) => {
	//写的时候，组件的起名一定要与dragList中的element名字一模一样，不然会映射不上
	return getFormConfigName[name];
};


const dragEnd = (a) => {
	drag.value = false;
	oriFormList.value = util.deepCopy(oriFormList.value)

}



let oriFormList = ref<FormGroupVO[]>(formGroupConfig);

let targetList = computed({
	get: () => {
		let value = flowStore.step2;
		if (value?.length == 0) {
			return [{
				type: 'Empty',
				name: ''
			}]
		}
		return value;
	},
	set: (v) => {

		let value = v.filter(res => res.type != 'Empty');
		flowStore.setStep2(util.deepCopy(value));

	}
})


const validate = (f) => {

	var err = []

	let formList = step2List.value;
	if (formList.length == 0) {
		err.push("表单不能为空")
	}
	for (var form of formList) {


		let formValidateDictElement = formValidateDict[form.type];
		if (formValidateDictElement) {
			let result = formValidateDictElement(form);

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
.leftItem {
	padding-left: 50px;
}

.zj {
	display: inline-block;
	width: 140px;
	margin: 5px;
}

@f22_width: 400px;

@center_width: 360px;
.drag-content {
	min-height: 640px;
	//border: 1px solid;
	width: @center_width;
	border-radius: 20px;
	padding: 30px 10px;
	background-color: white;
	margin-left: calc(50% - (@center_width) / 2);
	box-shadow: 0px 0px 10px grey;
}

.drag-content-inner {
	background-color: var(--el-bg-color-page);
	border-radius: 5px;
	padding: 5px;
}

.f11 {
	width: calc(100% - @f22_width);

}

.f22 {
	width: @f22_width;

}

.okcomponent {
	padding: 5px;
	border-radius: 0px;
	margin-bottom: 10px;
	background-color: white;
	border: 1px solid white;


}

.active-component {
	border: 1px solid var(--el-color-primary);
}

.deleteIcon {
	position: absolute;
	margin-left: calc(@center_width - 60px);
	z-index: 20;
}

.deleteIcon:hover {
	cursor: pointer;
	color: palevioletred;
}
</style>

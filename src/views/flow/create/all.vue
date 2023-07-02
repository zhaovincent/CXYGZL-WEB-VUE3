<template>
	<div>
		<div class="titlebar">
			<div class="f1"></div>
			<div class="f2">


				<span class="center_t" effect="dark" :activeStep="activeStep==0" @click="activeStep=0">
							<span :activeStep="activeStep==0">1</span>
							<span>基础信息</span>
					</span>
				<span class="center_t" effect="dark" :activeStep="activeStep==1" @click="activeStep=1">
							<span :activeStep="activeStep==1">2</span>
							<span>表单设计</span>
					</span>
				<span class="center_t" effect="dark" :activeStep="activeStep==2" @click="activeStep=2">
							<span :activeStep="activeStep==2">3</span>
							<span>流程设计</span>
					</span>

			</div>
			<div class="f3">
				<!--        <el-button @click.stop="clickNext">下一步</el-button>-->
				<el-button type="primary" @click="publish">发 布</el-button>
			</div>
		</div>

		<step1 v-show="activeStep === 0" :groupId="paramGroupId" ref="step1Ref"/>
		<step2 v-show="activeStep === 1" ref="step2Ref"/>
		<step3 v-show="activeStep === 2" :nodeConfigObj="step3NodeConfig" ref="step3Ref"/>


		<!--			//验证每一步-->
		<el-dialog v-model="validateDialogShow" title="流程检查">

			<el-steps :active="validateFlowStep" finish-status="success" simple style="margin-top: 20px">
				<el-step title="基础信息"/>
				<el-step title="表单设计"/>
				<el-step title="流程设计"/>
			</el-steps>

			<div style="text-align: center">
				<el-result v-if="validateFlowStep==3"
									 icon="success"
									 title="检查成功"
									 sub-title="流程检查完成，现在提交？"
				>
					<template #extra>
						<el-button type="primary" @click="submitFlow">提交</el-button>
					</template>
				</el-result>


				<el-result title="检查中" sub-title="正在检查流程信息"
									 v-if="validateErrMsg.length==0&&validateDialogShow&&validatingShow&&validateFlowStep<3">
					<template #icon>
						<span v-loading="true"
									style="display: inline-block;border:0px solid red;width: 100px;height: 100px;">

						</span>
					</template>

				</el-result>

				<el-result v-if="validateErrMsg.length>0"
									 icon="error"
									 title="检查失败"
				>
					<template #sub-title>
						<div v-for="item in validateErrMsg">
							<el-text type="danger">

								<el-icon>
									<WarnTriangleFilled/>
								</el-icon>
								{{ item }}
							</el-text>
						</div>
					</template>
					<template #extra>
						<el-button type="primary" @click="gotoEdit">去修改</el-button>
					</template>
				</el-result>

			</div>
		</el-dialog>

	</div>
</template>

<script lang="ts" setup>
import {ref, computed} from "vue";
import {Plus, WarnTriangleFilled} from "@element-plus/icons-vue";

const {proxy} = getCurrentInstance();

import {
	addFlow
} from "@/api/flow";


import Step1 from "./step1.vue";
import Step2 from "./step2.vue";
import Step3 from "./step3.vue";
import {useFlowStore} from "../workflow/stores/flow";
import {useRouter} from "vue-router";

let store = useFlowStore();
const step1Ref = ref();
const step2Ref = ref();
const step3Ref = ref();

const validateErrMsg = ref([])

const activeStep = ref(0);
const validateFlowStep = ref(0);
const validateDialogShow = ref(false);
const validatingShow = ref(false);

const gotoEdit = () => {
	activeStep.value = validateFlowStep.value;
	validateDialogShow.value = false
}
const publish = (t) => {

	validateErrMsg.value = []

	validateFlowStep.value = 0
	validateDialogShow.value = true;
	validatingShow.value = true;


	setTimeout(function () {
		//1
		checkStep1();


	}, 500)


}
import {ref, onMounted, defineExpose, toRaw} from "vue";
import {useRoute} from "vue-router";
import {
	getFlowDetail
} from "@/api/flow";
import {useUserStore} from "@/store/modules/user";

const userStore = useUserStore();


const route = useRoute();
onMounted(() => {
	const {groupId, flowId, cp} = toRaw(route).query.value;


	if (!!groupId) {
		paramGroupId.value = groupId;
	}
	if (proxy.$isNotBlank(flowId)) {

		getFlowDetail(flowId).then(res => {
			var {data} = res;

			store.step1.admin = JSON.parse(data.admin)
			store.step1.name = data.name
			store.step1.logo = data.logo
			if (!cp || !(parseInt(cp) === 1)) {
				//复制
				store.step1.flowId = flowId


			}
			store.step1.remark = data.remark;
			store.step1.groupId = data.groupId;

			store.setStep2(JSON.parse(data.formItems))
			step3NodeConfig.value = JSON.parse(data.process)
		})
	} else {
		//新增
		let userId = userStore.userId;
		let name = userStore.nickname;
		let avatar = userStore.avatar;
		store.step1.admin = [{
			"id": userId,
			name: name,
			avatar: avatar,
			type: 'user'
		}]

	}


})

const step3NodeConfig = ref();

var paramGroupId = ref();


const checkStep1 = () => {
	step1Ref.value.validate(function (valid, arr) {
		if (valid) {
			validateFlowStep.value = 1

			setTimeout(function () {
				checkStep2();
			}, 500)

		} else {
			validatingShow.value = false;
			//错误信息
			validateErrMsg.value = arr;
		}
	});
}
const checkStep2 = () => {
	step2Ref.value.validate(function (valid, arr) {
				if (valid) {
					setTimeout(function () {
						validateFlowStep.value = 2
						checkStep3();
					})
				} else {
					validatingShow.value = false;
					//错误信息
					validateErrMsg.value = arr;
				}
			}
	);

}


const checkStep3 = () => {
	setTimeout(function () {


		step3Ref.value.validate(function (valid, arr) {
			if (valid) {
				validateFlowStep.value = 3


			} else {
				validatingShow.value = false;
				//错误信息
				validateErrMsg.value = arr;
			}
		})
	})
}
const router = useRouter();

const submitFlow = () => {
	step3Ref.value.getProcessData().then(res => {
		let step1 = store.step1;
		let step2 = store.step2;

		let flow = proxy.$deepCopy(step1);
		flow.formItems = JSON.stringify(step2);
		flow.process = JSON.stringify(res);
		flow.admin = JSON.stringify(step1.admin);

		addFlow(flow).then(res => {
			validateDialogShow.value = false;
			store.$reset();
			router.push("/flow/group")
		})


	})
}

</script>
<style scoped lang="less">
@f2_width: 800px;
.titlebar {
	padding-top: 10px;
	padding-bottom: 10px;
	height: 60px;
	display: flex;
	flex-direction: row;
	margin-bottom: 40px;

	.f1 {
		width: calc(100% / 2 - @f2_width / 2);
	}

	.f2 {
		width: @f2_width;
		text-align: center;
	}

	.f3 {
		width: calc(100% / 2 - @f2_width / 2);

		text-align: right;
		line-height: 46px;
		height: 46px;
		padding-right: 20px;
	}
}

.center_t {
	cursor: pointer;
	padding: 10px 20px;


	display: inline-block;


	span:first-child {
		margin-right: 6px;
		font-size: 16px;
		font-weight: 400;
		text-align: center;
		line-height: 22px;
		border: 1px solid;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		display: inline-block
	}

	span:first-child[activeStep=true] {
		color: white;
		background-color: var(--el-color-primary);
	}

	span:last-child {
		font-weight: 500;
		font-size: 18px;
	}


}

.center_t[activeStep=true] {
	border-bottom: 2px solid var(--el-color-primary);
	color: var(--el-color-primary);

}
</style>

<template>
	<div>
		<div class="container-div">
			<el-card class="box-card" style="padding-right: 10%; padding-left: 10%;margin-top: 20px">
				<el-form
						ref="ruleForm"
						:model="form"
						:rules="rules"
						label-position="top"
						status-icon
						label-width="120px"
						@submit.prevent
				>
					<el-form-item label="图标" prop="logo">
						<single-upload v-model="form.logo"/>
					</el-form-item>
					<el-form-item label="名称" prop="name">
						<el-input v-model="form.name"/>
					</el-form-item>
					<el-form-item label="说明" prop="remark">
						<el-input v-model="form.remark"/>
					</el-form-item>
					<el-form-item label="分组" prop="groupId">
						<el-select v-model="form.groupId" placeholder="请选择流程组">
							<el-option
									v-for="item in groupList"
									:key="item.id"
									:label="item.groupName"
									:value="item.id"
							/>
						</el-select>
					</el-form-item>
					<el-form-item label="管理员" prop="admin">

			  <select-show
						    v-model:orgList="form.admin" type="user" :multiple="false"></select-show>

					</el-form-item>
				</el-form>
			</el-card>
		</div>

	</div>
</template>

<script lang="ts" setup>
import {ref, onMounted, defineExpose, toRaw} from "vue";

import {queryGroupList} from "@/api/group/index";
import SingleUpload from "@/components/Upload/SingleUpload.vue";

import type {FormInstance, FormRules} from "element-plus";
import selectShow from "@/views/flow/workflow/components/dialog/selectAndShow.vue";

const {proxy} = getCurrentInstance();

const validate = (f) => {
	proxy.$refs.ruleForm.validate((valid, fields) => {
		var arr = [];
		if (!valid) {
			for (var err in fields) {
				arr.push(fields[err][0].message)
			}
		}


		f(valid, arr);
	});
};

// 暴露方法和属性给父组件
defineExpose({validate});
const rules = reactive<FormRules>({
	name: [
		{required: true, message: "请填写名称", trigger: "blur"},
		{min: 2, max: 10, message: "2-10个字符", trigger: "blur"},
	],
	remark: [
		{required: false, message: "请填写描述", trigger: "blur"},
		{min: 2, max: 20, message: "2-20个字符", trigger: "blur"},
	],
	groupId: [
		{
			required: true,
			message: "请选择分组",
			trigger: "change",
		},
	],
	logo: [
		{
			required: true,
			message: "请上传图标",
			trigger: "change",
		},
	],
	admin: [
		{
			required: true,
			message: "请选择管理员",
			trigger: "change",
		},
	],
});

import {useRoute} from "vue-router";

const route = useRoute();


const groupList = ref<GroupVO[]>([]);

onMounted(() => {
	queryGroupList().then(({data}) => {
		groupList.value = data;
	});


});



let props = defineProps({
	groupId: {
		type: Number,
		default: undefined,
	},


});


watch(() => props.groupId, (val) => {
	if (!!val) {
		form.value.groupId = (val);
	}

})

import {reactive, ref, computed} from "vue";
import {GroupVO} from "@/api/group/types";


import {useFlowStore} from "../workflow/stores/flow";

let flowStore = useFlowStore();

var form = computed(() => {
	return flowStore.step1;
});


</script>
<style scoped lang="less">
.container-div {
	width: 800px;
 	margin-left: calc(50% - 400px);
	text-align: center
}

</style>

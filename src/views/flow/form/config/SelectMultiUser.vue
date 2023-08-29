<script setup lang="ts">
import { computed, defineExpose } from "vue";

let props = defineProps({
  id: {
    type: String,
    default: "",
  },
});
import employeesDialog from "@/views/flow/workflow/components/dialog/employeesDialog.vue";
import orgItem from "@/views/flow/workflow/components/dialog/orgItem.vue";

import { useFlowStore } from "../../workflow/stores/flow";
import { Plus } from "@element-plus/icons-vue";
import { ref } from "vue";

let flowStore = useFlowStore();

var config = computed(() => {
	let step2 = flowStore.step2;
	var idObjList = step2.filter(res => res.id === props.id);
	if (idObjList.length > 0) {
		return idObjList[0];
	}

	let list = step2.filter(res => res.type === 'Layout');
	for (var item of list) {
		let value = item.props.value;
		var valueList = value.filter(res => res.id === props.id);
		if (valueList.length > 0) {
			return valueList[0];
		}
	}

	return undefined;
});

var defaultValue = computed({
  get: () => {
    return  (config.value.props.value);
  },
  set: (s: any[]) => {
    config.value.props.value = s
  },
});

const { proxy } = getCurrentInstance();

//校验
const validate = () => {
  return true;
};
defineExpose({ validate });

let selectUserDialogVisible = ref(false);
const afterSelectUser = (data) => {
	defaultValue.value = data;
  selectUserDialogVisible.value = false;
};
import selectShow from "@/views/flow/workflow/components/dialog/selectAndShow.vue";

</script>

<template>
	<div v-if="config">

    <employees-dialog
      v-model:visible="selectUserDialogVisible"
      :data="defaultValue"
      type="user"
      :multiple="config.props.multi"
      @change="afterSelectUser"
    />
    <el-form-item label="选择范围">
      <el-checkbox
        v-model="config.props.self"
        :disabled="defaultValue.length > 0"
        label="可选自己"
      />
<!--      <el-checkbox-->
<!--        v-model="config.props.multi"-->
<!--        :disabled="defaultValue.length > 0"-->
<!--        label="可选多人"-->
<!--      />-->
    </el-form-item>
    <el-form-item label="默认值">

		<div style="display: block;flex-grow: 1">
			<div>
				<el-switch
						v-model="config.props.defaultRoot"
						active-text="发起人"
						inactive-text="自选"
				/>
			</div>
			<div v-if="!config.props.defaultRoot">
				<select-show
						:disabled="false" v-model:orgList="defaultValue" type="user" :multiple="true"
						:selectSelf="config.props.self"></select-show>

			</div>

		</div>

    </el-form-item>
  </div>
</template>

<style scoped lang="less"></style>

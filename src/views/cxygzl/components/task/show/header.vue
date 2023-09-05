<script setup lang="ts">
import {
	queryHeaderShow
} from "../../../api/base";

import {onMounted} from 'vue'

let props = defineProps({


	taskId: {
		type: String
	},
	flowId: {
		type: String
	},
	processInstanceId: {
		type: String
	}
});

const currentData = ref({})

onMounted(() => {
	queryHeaderShow({
		processInstanceId: props.processInstanceId,
		taskId: props.taskId,
		flowId: props.flowId
	}).then(res => {
		console.log(res)
		currentData.value = res.data;
	})
});
</script>

<template>
	<div style="position: relative">

		<div style="display: flex;flex-direction: row">
			<div class="f11">
				<el-avatar shape="square" :size="50" :src="currentData.starterAvatarUrl">
					{{ currentData?.starterName?.substring(0, 1) }}
				</el-avatar>
			</div>
			<div class="f22">
				<div>
					<el-text tag="b" size="large" type="primary">{{ currentData?.processName }}</el-text>
				</div>
				<div>
					<el-text size="small">{{ currentData.startTime }}</el-text>
				</div>
			</div>
		</div>
		<img v-if="currentData.processInstanceResult==1" class="iconclass" src="../../../assets/images/pass.png"/>
		<img v-if="currentData.processInstanceResult==2" class="iconclass" src="../../../assets/images/refuse.png"/>

	</div>

</template>

<style scoped lang="less">
.f11 {
  width: 70px;
}

.f22 {
  width: calc(100% - 70px);
}
.iconclass {
  width: 80px;
  height: 64px;
  position: absolute;
  top: 0px;
  right: 10px;
}
</style>
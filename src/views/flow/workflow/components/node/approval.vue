<script setup lang="ts">
import {ref} from "vue";

const {proxy} = getCurrentInstance();
let isInput = ref(false);

let props = defineProps({


	nodeConfig: {
		type: Object, default: () => {

		}
	}

});

import {bgColors, placeholderList} from "@/views/flow/workflow/utils/const";
import {computed} from "vue";
import $func from "@/views/flow/workflow/utils";




const blurEvent = () => {

	isInput.value = false;
	props.nodeConfig.nodeName = props.nodeConfig.nodeName || defaultText

};
const clickEvent = (index) => {

		isInput.value = true;

};
let defaultText = computed(() => {
	return placeholderList[props.nodeConfig.type]
});
var placeHolder = computed(() => {

		return $func.setApproverStr(props.nodeConfig)

})

const error=computed(()=>{
	let approverStr = $func.setApproverStr(props.nodeConfig);


	props.nodeConfig.error =proxy.$isBlank(approverStr)||(approverConfig.value.nobody.handler==='TO_USER'&&approverConfig.value.nobody.assignedUser.length==0)
})

const emit = defineEmits(["update:nodeConfig"]);

</script>

<template>
	<div>
		<div class="title" :style="`background: rgb(${bgColors[nodeConfig.type]});`">

			<input
					v-if="isInput"
					type="text"
					class="ant-input editable-title-input"
					@blur="blurEvent"
					@focus="$event.currentTarget.select()"
					v-focus
					v-model="nodeConfig.nodeName"
					:placeholder="defaultText"
			/>
			<span v-else class="editable-title" @click="clickEvent()">{{ nodeConfig.nodeName }}</span>
			<i class="anticon anticon-close close" @click="delNode"></i>

		</div>
		<div class="content" @click="openConfigDrawer">
			<div class="text">
				<span class="placeholder" v-if="!placeHolder">请选择{{ defaultText }}</span>
				{{ placeHolder }}
			</div>
			<i class="anticon anticon-right arrow"></i>
		</div>


	</div>
</template>

<style scoped lang="less">
@import "@/views/flow/workflow/css/workflow.css";

</style>

<script setup lang="ts">

import {isNotBlank} from "../utils/objutil";

const signImg=ref()

const signatureDialogRef=ref();

const showSignDialog=()=>{
	signatureDialogRef.value.show('签字');

}

const signSuccess=(url)=>{
	console.log("签名成功的图片",url)
	signImg.value=url;

	emits('ok',url)
}
import SignatureDialog from "../components/form/render/Signature.vue";
let emits = defineEmits(['signSuccess']);



</script>

<template>
<div>
	<signature-dialog  @signSuccess="signSuccess" ref="signatureDialogRef"></signature-dialog>
    <el-row>
        <el-col :span="8">
            <div style="text-align: left">
                <el-button type="danger" @click="showSignDialog" >点击签字</el-button>

            </div>
				</el-col>
        <el-col :span="16">
            <div style="text-align: left">
                <img v-if="isNotBlank(signImg)" width="190" :src="signImg" />

            </div>
				</el-col>
    </el-row>


</div>
</template>

<style scoped lang="less">

</style>

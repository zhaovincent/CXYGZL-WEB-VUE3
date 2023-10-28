<script setup lang="ts">

import {onMounted, ref} from "vue";




const dialogTableVisible = ref(false);

const flowIdList=ref([])
const itemList=ref([])

const show = (title1,options,v) => {

	title.value = title1;

		if(v){
			itemList.value=v;
		}

		let map = options.map(w=>w[1]);

		flowIdList.value=map;


	dialogTableVisible.value = true;

}


defineExpose({show});


const opened = () => {
    firstRef.value.clear();
    secondRef.value.clear();
    thirdRef.value.clear();

}
const close = () => {

}

const title = ref('')

onMounted(() => {


});
let emits = defineEmits(['ok']);

const confirm = () => {

    let data = proxy.$refs[activeName.value+'Ref'].getData();



	emits('ok', data,activeName.value)
	dialogTableVisible.value = false;
}



const firstRef=ref();
const secondRef=ref();
const thirdRef=ref();

const {proxy} = getCurrentInstance();


const activeName=ref('first')

import StartedList from './started.vue'
import CompletedList from './completed.vue'
import CCList from './cc.vue'

const clickTab=()=>{


   // proxy.$refs[activeName.value+'Ref'].clear();
}

</script>

<template>
	<el-dialog :width="1100" v-model="dialogTableVisible" @close="close" :title="title" @opened="opened">
	  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="clickTab">
		  <el-tab-pane label="我的发起" name="first">
					<started-list :flowIdList="flowIdList" :itemList="itemList" ref="firstRef"></started-list>
			</el-tab-pane>
		  <el-tab-pane label="我的已办" name="second">
					<completed-list :flowIdList="flowIdList" :itemList="itemList"  ref="secondRef"> </completed-list>
			</el-tab-pane>
		  <el-tab-pane label="抄送给我" name="third">
					<c-c-list :flowIdList="flowIdList" :itemList="itemList" ref="thirdRef"></c-c-list>
			</el-tab-pane>
	  </el-tabs>

		<template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </span>
		</template>
	</el-dialog>
</template>

<style scoped lang="less">
.tag1 {
	margin-right: 10px;
	cursor: pointer;
}
</style>

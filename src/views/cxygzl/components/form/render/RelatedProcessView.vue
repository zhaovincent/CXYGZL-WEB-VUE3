<script setup lang="ts">

import {onMounted, ref} from "vue";
import TaskHandle from "../../task/handler/task.vue";

import {
  queryDetailByProcessInstanceId
} from "../../../api/task";




const dialogTableVisible = ref(false);


const taskHandler=ref();


const processInstanceId=ref();

const show = (pid) => {
  queryDetailByProcessInstanceId(pid).then(res=>{

    taskHandler.value.deal(res.data)

  })

}


defineExpose({show});


const opened = () => {
  queryDetailByProcessInstanceId(processInstanceId.value).then(res=>{

    taskHandler.value.deal(res.data)

  })


}
const close = () => {

}

onMounted(() => {


});
let emits = defineEmits(['ok']);

const confirm = () => {


	emits('ok')
	dialogTableVisible.value = false;
}






</script>

<template>

    <task-handle ref="taskHandler"  ></task-handle>


</template>

<style scoped lang="less">
.tag1 {
	margin-right: 10px;
	cursor: pointer;
}
</style>

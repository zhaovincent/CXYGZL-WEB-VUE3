<script setup lang="ts">

import FormRender from "../../form/render/FormRender.vue";
import * as util from "../../../utils/objutil";
import $func from "../../../utils";

import {getFormList} from '../../../api/form'

import {ref, onMounted, watch, computed} from 'vue'

const formList = ref([])

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
onMounted(() => {
  getFormList({
    flowId: props.flowId,
    processInstanceId: props.processInstanceId,
    taskId: props.taskId
  }, true).then(res => {
    let data = res.data;

    for (var fi of data) {
      if (fi.type === 'Layout') {
        var arr = [];
        let value = fi.props.value;
        arr.push(value);
        fi.props.value = arr;
        fi.props.oriForm = util.deepCopy(value);
      }
    }

    formList.value = data;


  })
})


const addLayoutOneItem = (id) => {


  for (var item of formList.value) {
    if (item.id !== id) {
      continue;
    }
    let value = item.props.value;
    let oriForm = item.props.oriForm;
    value.push(util.deepCopy(oriForm));
    item.props.value = value;

  }
}
const deleteLayoutOneItem = (id, index) => {

  for (var item of formList.value) {
    if (item.id !== id) {
      continue;
    }

    item.props.value.splice(index, 1);

  }
}

const formRenderRef = ref()

//验证表单参数
const validate = (f) => {

  formRenderRef.value.validate(function (valid) {

    f(valid, formValue.value)
  })
}

const formValue = computed(() => {

  var obj = {}

  for (var item of formList.value) {
    obj[item.id] = item.props.value

    if (item.type === 'Layout') {


      let subList = item.props.value;

      var d = []
      for (var array of subList) {
        var v = {}

        for (var subItem of array) {
          let value = subItem.props.value;
          v[subItem.id] = value;
        }
        d.push(v)

      }
      obj[item.id] = d;

    }


  }
  return obj;
})

defineExpose({validate});
const emits = defineEmits(["formValueChange"]);


watch(() => formValue.value, (v) => {


  $func.debounce(async () => {

    emits('formValueChange', v)

  })()

})

</script>

<template>
  <diev>
    <el-form label-position="top">


      <form-render v-if="formList&&formList.length>0" @addLayoutOneItem="addLayoutOneItem" ref="formRenderRef"
                   @deleteLayoutOneItem="deleteLayoutOneItem"
                   :form-list="formList"></form-render>

    </el-form>
  </diev>
</template>

<style scoped lang="less">

</style>

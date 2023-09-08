<script setup lang="ts">

import FormRender from "../../form/render/FormRender.vue";
import * as util from "../../../utils/objutil";
import $func from "../../../utils";
import {dynamicFormList} from '../../../api/form'


import {ref, defineExpose, watch, computed} from 'vue'
import {sameJson} from "../../../utils/objutil";


const formList = ref([])


const formUniqueId = ref();
const flowId = ref();
const nodeId = ref();
const handleForm = ref(false);

function loadData(d, fid, nId) {
  formUniqueId.value = util.getRandomId();
  formList.value = d;
  flowId.value = fid;
  nodeId.value = nId;
}


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
  formRenderRef.value.handleFormRule();
  formRenderRef.value.validate(function (valid) {

    f(valid, formValue.value)
  })
}

function getFormValueObj(v) {
  var obj = {}

  for (var item of v) {
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
}

const formValue = computed(() => {

  return getFormValueObj(formList.value);
})

defineExpose({validate, loadData});
const emits = defineEmits(["formValueChange"]);

//判断是否触发表单变化
const triggerChange = ref(true)

///监控表单变化
watch(() => formValue.value, (v) => {


  $func.debounce(async () => {
    if (!triggerChange.value) {
      triggerChange.value = true;
      return;
    }

    if(!handleForm.value){
      emits('formValueChange', v)
      return
    }


    dynamicFormList({
      flowId: flowId.value,
      nodeId: nodeId.value,
      paramMap: formValue.value,
      formUniqueId: formUniqueId.value,
      formItemVOList: formList.value
    }).then(res => {

      if (!util.sameJson(formList.value, res.data)) {
        triggerChange.value = false;
        formList.value = res.data;
        //修改验证规则
        formRenderRef.value.handleFormRule();
        emits('formValueChange', v)

      } else {
        emits('formValueChange', v)

      }
    })


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

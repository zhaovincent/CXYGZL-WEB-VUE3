<template>
  <div>

    <el-input
        style="width: 100%"
        controls-position="right"
        v-if="mode==='D'"
        :disabled="true"
        :placeholder="!form?'':form.placeholder"
    />
    <el-input v-else
              style="width: 100%"
              controls-position="right"
              :readonly="form.props.readonly"
              v-model="fValue"
              :disabled="form.perm === 'R'"
              :placeholder="form.placeholder"
    />
  </div>
</template>
<script lang="ts" setup>
import {isBlank} from "../../utils/objutil";
import {useFlowStore} from "../../stores/flow";

let flowStore = useFlowStore();

var formValueStore = computed(() => {
  return flowStore.formValue;
});


const getFormValue = (formId, index) => {


  let e = formValueStore.value[formId];
  if (index < 0) {
    return e
  } else {
    if (e) {
      return e;
    }

    for (var k in formValueStore.value) {
      let valueElement = formValueStore.value[k];
      if (valueElement && (valueElement instanceof Array)) {
        if (valueElement.length > index) {
          let valueElementElementElement = valueElement[index][formId];
          if (valueElementElementElement) {
            return valueElementElementElement

          }
        }
      }
    }


  }

  return undefined;

}

let props = defineProps({

  mode: {
    type: String,
    default: 'D'
  },


  index: {
    type: Number,
    default: 0
  },


  form: {
    type: Object, default: () => {

    }
  },


  formValue: {
    type: Object, default: () => {

    }
  }

});


const fValue = computed(
    {
      get() {


        let expList = props.form.props.expList;


        var exp = "";
        for (var it of expList) {
          if (it.type === 'form') {
            let v = getFormValue(it.value, props.index);

            if (isBlank(v) || !v) {
              props.form.props.value = '';

              return ''
            }
            exp += v;
          } else {
            exp += it.value;
          }
        }


        props.form.props.value = eval(exp);

        return eval(exp);

      },
      set(t) {


      }
    }
)

import * as util from '../../utils/objutil'

import {computed, defineExpose} from "vue";


const getValidateRule = () => {

  var item = props.form;
  var itemProps = item.props


  var checkConfig = (rule: any, value: any, callback: any) => {

    if (item.required) {
      if (!(value)) {
        return callback(new Error("请填写" + item.name))
      }
    }
    if (!(value)) {
      return callback()
    }


    return callback()


  }
  let ruleArray = [{
    validator: checkConfig, trigger: 'blur'
  }];
  console.log('表单校验', item.required, props.form.required)
  if (item.required) {
    ruleArray.push(
        {required: true, message: '请填写' + item.name, trigger: 'blur'}
    )
  }
  return ruleArray


}
defineExpose({getValidateRule});
</script>
<style scoped lang="less"></style>

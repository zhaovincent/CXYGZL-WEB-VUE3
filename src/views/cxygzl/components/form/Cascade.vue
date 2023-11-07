<template>
	<div>

		<el-select style="width: 100%"
			   v-if="mode==='D'"
			   :disabled="true"
			   :placeholder="!form?'':form.placeholder"
							 size="large">

		</el-select>
	  <el-cascader
            :disabled="form.perm === 'R'"
            :placeholder="form.placeholder"
						v-else style="width: 100%" :props="{value:'key'}" v-model="formValue" :options="form.props.options"   />


	</div>
</template>
<script lang="ts" setup>
import {defineExpose,computed} from "vue";
import {deepCopy} from "../../utils/objutil";


var formValue = computed({
    get() {
        let value =  props.form.props.value;
        return value?.value
    },
    set(t) {
        let treeData = getTreeData(t[t.length-1], props.form.props.options);
        let d = deepCopy(treeData);
        d.value=t;
        props.form.props.value = d
    }
})

const getTreeData = (key, arr) => {

    for (var item of arr) {

        if (item.key === key) {
            return item;
        }
        let treeData = getTreeData(key, item.children);
        if (treeData) {
            return treeData
        }
    }
    return undefined;
}

let props = defineProps({

	mode:{
		type:String,
		default:'D'
	},


	form: {
		type: Object, default: () => {

		}
	}

});



const getValidateRule = () => {

	var item = props.form;

	var checkConfig = (rule: any, value: any, callback: any) => {

		if (item.required) {
			if (value==undefined||value.length==0) {
				return callback(new Error("请选择" + item.name))
			}
		}
		if (value==undefined) {
			return callback()
		}


		return callback()


	}
	let ruleArray = [{
		validator: checkConfig, trigger: 'change'
	}];
	if (item.required) {
		ruleArray.push(
			{required: true, message: '请选择' + item.name, trigger: 'change'}
		)
	}
	return ruleArray


}
defineExpose({getValidateRule});


</script>
<style scoped lang="less"></style>

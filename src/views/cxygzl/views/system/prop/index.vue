<script setup lang="ts">

import {saveRemoteData,queryAll} from "../../../api/userfield/index"

import {onMounted,ref} from "vue";

import * as proxy from '../../../utils/objutil'
import {Plus} from "@element-plus/icons-vue";

/**
 * 查询
 */
function handleQuery() {

	queryAll().then(res=>{
			let data = res.data;
			data.forEach(r=>r.props=JSON.parse(r.props))
			fieldValueArray.value=data
	})

}


onMounted(() => {
	handleQuery();
	fieldTypeOptions.value = [
		{
			value: 'Number',
			label: '数字'
		},
		{
			value: 'Input',
			label: '单行文本'
		}, {
			value: 'Textarea',
			label: '多行文本'
		}, {
			value: 'Date',
			label: '日期'
		}, {
			value: 'DateTime',
			label: '日期时间'
		}, {
			value: 'Time',
			label: '时间'
		}, {
			value: 'SingleSelect',
			label: '单选'
		},
		{
			value: 'MultiSelect',
			label: '多选'
		}
	]
});

//字段选项
const fieldTypeOptions = ref([]);
//值
const fieldValueArray = ref([])


const addItem = () => {
	fieldValueArray.value.push({
		required: false, name: '', type: '',perm:'E', key: proxy.getRandomId(), props: {
		  options:[],radixNum:4
			}
	})
}

const delItem = (index) => {
	fieldValueArray.value.splice(index, 1)
}

const rowIndex = ref()

const addOption = (index) => {
	rowIndex.value = index;


	let props = fieldValueArray.value[index].props;

	let options = props.options;

	if (options.length == 0) {
		addOptionOption();
	} else {
		optionOption.value = options
	}

	dialogVisible.value = true;
}

const dialogVisible = ref(false)

const addOptionOption = () => {
	optionOption.value.push({
		key: '', value: ''
	})
}

const optionOption = ref([])

const delOptionItem = (index) => {
	optionOption.value.splice(index, 1)
}
const confirmOption = () => {
	{
		var l = optionOption.value.filter(res => proxy.isBlank(res.key) || proxy.isBlank(res.value)).length

		if (l > 0) {
			ElMessage.warning("所有的值必填");

			return
		}
	}
	{
		var keyList = optionOption.value.map((w) => w.key);
		let newList = Array.from(new Set(keyList));
		if (newList.length != keyList.length) {
			ElMessage.warning("选项键值必须唯一");

			return
		}
	}
	{
		var keyList = optionOption.value.map((w) => w.value);
		let newList = Array.from(new Set(keyList));
		if (newList.length != keyList.length) {
			ElMessage.warning("选项名必须唯一");

			return
		}
	}


	fieldValueArray.value[rowIndex.value].props.options=optionOption.value;

	dialogVisible.value = false


}

const saveData=()=>{
	{
		var l = fieldValueArray.value.filter((w) => proxy.isBlank(w.type)).length;

		if (l>0) {
			ElMessage.warning("属性类型不能空");

			return
		}
	}
	{
		var l = fieldValueArray.value.filter((w) => proxy.isBlank(w.name)).length;

		if (l>0) {
			ElMessage.warning("属性名称不能空");

			return
		}
	}
	{
		var l = fieldValueArray.value.filter((w) => ((w.type=='SingleSelect'||w.type==='MultiSelect')&&w.props.options.length==0)).length;

		if (l>0) {
			ElMessage.warning("单选/多选的选项不能空");

			return
		}
	}
	{
		var keyList = fieldValueArray.value.map((w) => w.name);
		let newList = Array.from(new Set(keyList));
		if (newList.length != keyList.length) {
			ElMessage.warning("属性名称不唯一");

			return
		}
	}

	//保存数据

	fieldValueArray.value.forEach(res=>res.props=JSON.stringify(res.props))


	saveRemoteData(fieldValueArray.value).then(res=>{
	  ElMessage.success("保存成功");
	  handleQuery();

	})

}

</script>

<template>
	<div class="app-container">

		<el-card shadow="never">
			<template #header>
				<el-button type="success" @click="addItem"
				>
          <el-icon><Plus/></el-icon>
					新增
				</el-button
				>

			</template>

			<div style="display: flex;flex-direction: row;margin-bottom: 20px" v-for="(item,index) in fieldValueArray">

				<div class="f1">
					<el-select v-model="item.type" placeholder="选择属性类型">
						<el-option
								v-for="item in fieldTypeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
						/>
					</el-select>
				</div>
				<div class="f2">
					<el-input v-model="item.name" placeholder="输入属性名称"/>
				</div>
				<div class="f3">
					<el-switch
							v-model="item.required"
							active-text="必填"
							inactive-text="非必填"
					/>
				</div>
				<div class="f4">
						<template v-if="item.type==='SingleSelect'||item.type==='MultiSelect'" >
				<el-select  placeholder="选项列">
					<el-option
							v-for="item in item.props.options"
							:key="item.key"
							:label="item.value"
							:value="item.key"
					/>
				</el-select>
						</template>
						<template v-if="item.type==='Number'" >
							  	<el-input-number :step="2" step-strictly :min="0" :max="10" value-on-clear="min"  v-model="item.props.radixNum"></el-input-number>
						</template>
				</div>
				<div class="f5">
					<el-button type="primary" text @click="delItem(index)"> 删除</el-button>
					<el-button v-if="item.type==='SingleSelect'||item.type==='MultiSelect'" type="primary" @click="addOption(index)" text> 添加选项</el-button>
				</div>
			</div>

				<div>
						<el-button type="primary" @click="saveData" size="large">保存</el-button>
				</div>
		</el-card>

		<el-dialog
				v-model="dialogVisible"
				title="添加选项"
				width="30%"
		>
		  <span>
					<div style="display: flex;flex-direction: row;margin-bottom: 10px" v-for="(item,index) in optionOption">
							<div class="f21">
									<el-input v-model="item.key" placeholder="选项唯一值"/>
							</div>
							<div class="f22">
									<el-input v-model="item.value" placeholder="选项名"/>

							</div>
							<div class="f23">

									<el-button type="danger" @click="delOptionItem(index)" text>删除</el-button>

							</div>
					</div>
			</span>
			<template #footer>
      <span class="dialog-footer">
					<el-button type="success" text @click="addOptionOption"> 添加选项</el-button>

        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmOption">
          确定
        </el-button>
      </span>
			</template>
		</el-dialog>
	</div>
</template>
<style scoped lang="less">
.f1 {
	width: 200px;

}

.f2 {
	width: 200px;
	margin-left: 10px;

}

.f3 {
	width: 200px;
	margin-left: 10px;

}

.f4 {
	width: 200px;
	margin-left: 10px;

}

.f5 {
	width: 200px;
	margin-left: 10px;

}

.f21 {
	width: 40%;
	margin-right: 5%;
}

.f22 {
	width: 40%;
	margin-right: 5%;

}

.f23 {
	width: 10%
}
</style>

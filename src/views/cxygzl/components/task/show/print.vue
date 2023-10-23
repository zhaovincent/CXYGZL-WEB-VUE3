<script setup lang="ts">

import {useUserStore} from "../../../stores/user";
import {queryPrintData} from "../../../api/base";
const userStore = useUserStore();

import * as util from "../../../utils/objutil"


import {defineExpose, ref} from "vue";

const allData=ref({})

const show=(d)=>{
  queryPrintData(d).then(res=>{
    console.log(res)
    allData.value=res.data;
    dialogTableVisible.value=true;

  })
}

defineExpose({show})




const dialogTableVisible=ref(false)

const printObj=ref({
  id: "printDivTag", // 这里是要打印元素的ID
  popTitle: "&nbsp", // 打印的标题
  extraCss: "/print.css", // 打印可引入外部的一个 css 文件
  extraHead: "", // 打印头部文字
  preview: false, // 是否启动预览模式，默认是false
  previewTitle: '打印客户账单', // 打印预览的标题
  previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印
  zIndex: 10002, // 预览窗口的z-index，默认是20002，最好比默认值更高
  previewBeforeOpenCallback () { console.log('正在加载预览窗口！'); }, // 预览窗口打开之前的callback
  previewOpenCallback () { console.log('已经加载完预览窗口，预览打开了！') }, // 预览窗口打开时的callback
  beforeOpenCallback () { console.log('开始打印之前！') }, // 开始打印之前的callback
  openCallback () { console.log('执行打印了！') }, // 调用打印时的callback
  closeCallback () { console.log('关闭了打印工具！') }, // 关闭打印的callback(无法区分确认or取消)
  clickMounted () { console.log('点击v-print绑定的按钮了！') }
})
</script>

<template>
  <el-dialog v-model="dialogTableVisible"  >
    <div id="printDivTag" style="border: 1px solid #ffffff;">
        <h2 style="text-align: center">{{ allData.processName }}</h2>
        <div style="text-align: right;font-size: 15px;">打印人员：{{userStore.nickname}}</div>
        <div style="display: flex;justify-content: space-between;font-size: 15px;">
          <div>流程编号：{{ allData.processInstanceId }}</div>
          <div>打印时间：{{util.momentFormat(new Date(),"YYYY-MM-DD HH:mm")}}</div>
        </div>

        <div style="display: flex;flex-direction: row;margin-top: 20px;">
          <div class="title border" style="width: 25%;">发起人</div>
          <div class="content border" style="width: 25%;">{{ allData.starterName }}</div>

          <div class="title border" style="width: 25%;">发起时间</div>
          <div class="content border" style="width: 25%;">{{allData.startTime}}</div>

        </div>

        <div style="display: flex;flex-direction: row">
          <div class="title border" style="width: 25%;">所属部门</div>
          <div class="content border" style="width: 25%;">{{allData.starterDeptName}}</div>

          <div class="title border" style="width: 25%;">流程状态</div>
          <div class="content border" style="width: 25%;">{{allData.processStatusShow}}</div>

        </div>
      <div style="text-align: center" class="border">
        <h4>表单内容</h4>
      </div>
      <template v-for="item in allData.formList">
        <template  v-if="item.formType=='Layout'">
          <template v-for="(it ,index) in JSON.parse(item.formValueShow)">
            <div class="border" style="font-weight: bold">明细{{index+1}}</div>
            <div style="display: flex;flex-direction: row" v-for="it1 of it" >
              <div class="title border" style="width:25%;">{{ it1.formName }}</div>
              <div class="content border" style="width: 75%;">{{ it1.formValueShow }}</div>

            </div>
          </template>
          <div class="border" style="height: 15px;"></div>
        </template>
        <div style="display: flex;flex-direction: row"  v-else-if="item.formType=='Signature'">
          <div class="title border" style="width:25%;">{{ item.formName }}</div>
          <div class="content border" style="width: 75%;">
            <img height="200" :src="item.formValue" />
          </div>

        </div>
        <div v-else style="display: flex;flex-direction: row" >
          <div class="title border" style="width:25%;">{{ item.formName }}</div>
          <div class="content border" style="width: 75%;">{{ item.formValueShow }}</div>

        </div>

      </template>
      <div style="text-align: center" class="border">
        <h4>流程节点</h4>
      </div>
		<div style="display: flex;flex-direction: row" v-for="it1 of allData.approveList" >
			<div class="title border" style="width:25%;">{{ it1.nodeName }}</div>
			<div class="content border"  :style="{width:(it1.comment.length>0)?'40%':'75%'}">{{ it1.userName }} / {{it1.taskTypeShow}} / {{it1.date}}</div>
			<div class="content border" style="width: 35%;" v-if="it1.comment.length>0">
					<div v-for="c in it1.comment">
						{{JSON.parse(c.message).content}}
					</div>
			</div>

		</div>

    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" v-print="printObj">
          打印
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
  .border{
    border: 1px solid gray;
    padding: 5px;
  }
  .title{
  }
</style>

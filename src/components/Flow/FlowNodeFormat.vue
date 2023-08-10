<script setup lang="ts">
import {ref, getCurrentInstance, onMounted, watch} from 'vue'
import selectShow from "@/views/flow/workflow/components/dialog/selectAndShow.vue";


let props = defineProps({

	nodeUser: {
		type: Object,
		dafault: () => {
		}
	},
	row: {
		type: Array,
		dafault: () => []
	},
	disableSelect: {
		type: Boolean,
		default: false
	}


});
const {proxy} = getCurrentInstance();


import {Loading, Finished, Refresh, Clock, CircleCloseFilled} from "@element-plus/icons-vue";


</script>

<template>
	<div style="padding: 10px">

		<el-timeline :reverse="false">
			<el-timeline-item v-for="(node, index) in row" :key="index" size="large"
												:type="node.status!=2?(
        node.status==1?'success':(node.status==3?'warning':'info')
      ):'primary'"
												:icon="node.status==2?Finished:(node.status==1?Loading:(node.status==3?CircleCloseFilled:Clock))"
			>
				<template v-if="node.selectUser&&(!nodeUser[node.id]||nodeUser[node.id]?.length==0)">
					<p style="color: red">{{ node.name }}
						<template v-if="node.placeholder&&node.placeholder.length>0">[{{ node.placeholder }}]</template>
					</p>
				</template>
				<template v-else>
<!--					<p>{{ node.name }}-->
<!--					</p>-->
						<div style="display: flex;flex-direction: row">
								<div class="f21">{{node.name}}</div>
								<div class="f22">{{node.showTimeStr}}</div>
						</div>
			<div v-if="node.placeholder&&node.placeholder.length>0">[{{ node.placeholder }}]</div>

				</template>


				<!--					渲染用户头像列表-->
				<div v-if="node.userVoList&&node.userVoList.length>0" style="display: flex;flex-direction: row;flex-wrap: wrap">
					<div class="box-card" v-for="(item1,index1) in node.userVoList" :key="index1"
							 style="margin-bottom: 10px;border: 0px solid red;width: 60px;text-align: center">

						<div class="node-show">
							<div style="overflow: hidden;">
								<div class="d1">

									<div style="height: 60px;padding-top: 20px;">
										<el-badge :value="12" is-dot
															:type="item1.status==1?'success':(item1.status==2?'primary':(item1.status==3?'warning':'info'))"
															class="item">

											<el-avatar shape="square" :size="30" :src="item1.avatar"></el-avatar>

										</el-badge>

									</div>


									<div
											style="font-size: 8px;text-align: center">
										{{ item1.name }}
									</div>

								</div>


							</div>


						</div>

					</div>


				</div>
				<!--					渲染审批评论-->
				<div v-for="(item1,index1) in node.approveDescList" :key="index1" style="margin-top: 10px">



						<div style="display: flex;flex-direction: row;">
							<div class="f1">

								<el-avatar shape="square" :size="30" :src="item1.user.avatar"></el-avatar>


							</div>
							<div class="f2">
<!--				  <el-badge :value="item1.descTypeStr" class="item">-->
								{{ item1.user.name }}  <el-tag  size="small" type="danger">{{item1.descTypeStr}}</el-tag>
<!--					</el-badge>-->
							</div>

							<div style="height:40px;line-height: 40px;font-size: 10px;" class="f4">
								{{ item1.showTimeStr }}
							</div>

						</div>
						<div v-if="!item1.sys"><el-text size="small" type="primary">添加了评论：</el-text></div>
						<div class="box-card"
								 style="padding: 5px;background-color:var(--el-fill-color-light)">
							<el-tag v-if="item1.sys" type="success">系统</el-tag>
<!--							<el-tag v-if="!item1.sys" type="warning">用户</el-tag>-->
								<el-text  type="info">{{ item1.desc }}</el-text>
						</div>

						<el-divider v-if="index1!=node.approveDescList.length-1"/>

				</div>


				<!--					选择用户-->
				<template v-if="node.selectUser">


					<select-show :disabled="disableSelect" v-model:orgList="nodeUser[node.id]" type="user"
											 :multiple="node.multiple"></select-show>


				</template>

				<el-tabs v-if="node.branch.length>0" type="border-card">
					<el-tab-pane v-for="(node1, index1) in node.branch" :label="'分支'+(index1+1)" :name="index1+''"
											 :key="index1">
						<template v-if="node1.placeholder&&node1.placeholder.length>0">[{{ node1.placeholder }}]</template>
						<div style="padding:0px 5px;">
							<flow-node-format :node-user="nodeUser" :disableSelect="disableSelect"
																:row="node1.children"></flow-node-format>

						</div>
					</el-tab-pane>

				</el-tabs>


			</el-timeline-item>
		</el-timeline>


	</div>
</template>

<style scoped lang="less">
.f1 {
	width: 40px;
	text-align: center;

	padding-top: 5px;
}

.f2 {
	height: 40px;
	line-height: 40px;
	font-size: 10px;
	margin-left: 5px;
	width: 180px;

}

.f4 {
	width: calc(100% - 225px);
	text-align: right;

}

.f00 {
	width: 10px;
	height: 10px;
	display: inline-block;
	background-color: green;
	position: fixed;
	top: 62px;

}
.f21{
	width: calc(100% - 50px);
}
.f22{
	width: 50px;
}
</style>

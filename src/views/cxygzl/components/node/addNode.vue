<template>
	<div class="add-node-btn-box">
		<div class="add-node-btn">
			<el-popover placement="right-start" :disabled="readOnly" v-model="visible" width="350px">
				<div class="add-node-popover-body">


					<a class="add-node-popover-item approver" @click="addType(1)">
						<div class="item-wrapper">
							<span class="iconfont"></span>
						</div>
						<p>审批人</p>
					</a>
					<a class="add-node-popover-item notifier" @click="addType(2)">
						<div class="item-wrapper">
							<span class="iconfont"></span>
						</div>
						<p>抄送人</p>
					</a>

					<a class="add-node-popover-item condition" @click="addType(4)">
						<div class="item-wrapper">
							<span class="iconfont"></span>
						</div>
						<p>条件分支</p>
					</a>

					<a class="add-node-popover-item ParallelGateway" @click="addType(5)">
						<div class="item-wrapper">
							<i class="icon icon-icon_share_fill iconfont"></i>


						</div>
						<p>并行分支</p>
					</a>

					<a class="add-node-popover-item InclusiveGateway" @click="addType(8)">
						<div class="item-wrapper">
							<i class="icon icon-icon_exponent iconfont"></i>


						</div>
						<p>包容分支</p>
					</a>
					<a class="add-node-popover-item trigger" @click="addType(6)">
						<div class="item-wrapper">
							<i class="icon icon-icon_robot_fill iconfont"></i>


						</div>
						<p>触发器</p>
					</a>
					<a class="add-node-popover-item delay" @click="addType(7)">
						<div class="item-wrapper">
							<i class="icon icon-icon_check iconfont"></i>


						</div>
						<p>延时器</p>
					</a>

					<a class="add-node-popover-item route" @click="addType(10)">
						<div class="item-wrapper">
							<i class="icon icon-icon_transpond iconfont"></i>


						</div>
						<p>动态路由</p>
					</a>
					<a class="add-node-popover-item subProcess" @click="addType(9)">
						<div class="item-wrapper">
							<i class="icon icon-icon_pc_sharelink1 iconfont"></i>


						</div>
						<p>子流程</p>
					</a>

					<a class="add-node-popover-item asynTrigger" @click="addType(11)">
						<div class="item-wrapper">
							<i class="icon icon-icondatafill iconfont"></i>


						</div>
						<p>异步触发器</p>
					</a>

				</div>
				<template #reference>
					<button class="btn" type="button">
						<span class="iconfont"></span>
					</button>
				</template>
			</el-popover>
		</div>


	</div>
</template>
<script setup>
import {ref} from 'vue'

let props = defineProps({
	childNodeP: {
		type: Object,
		default: () => ({})
	},
	currentNode: {
		type: Object,
		default: () => ({})
	}
})

const readOnly = inject('readOnlyAtFlow') // 导入

import * as util from '../../utils/objutil'


let emits = defineEmits(['update:childNodeP'])
let visible = ref(false)
const addType = (type) => {

  if(props.readOnly){
    return
  }

	visible.value = false;
	if (type != 4 && type != 5 && type != 8) {
		var data;
		if (type == 1) {
			data = {
				"id": util.getRandomId(),
				"nodeName": "审批人",
				"error": true,
				"type": 1,
				"parentId": props.currentNode.id,
				//人员方式
				"assignedType": 1,
				//单选还是多选
				multiple: false,
				//是否需求签名
		    needSignature: false,
				//多人审批的选项
				multipleMode: 1,
				//会签完成比例
				completeRate: 100,
				//第几级部门负责人
				deptLeaderLevel: 1,
				//人员选择
				formUserId: "",
				formUserName: "",
					//部门下的选择
					deptUserType:'allUser',
				//表单权限
				formPerms: {},
        //动态表单
        dynamicFormConfig:{
					enable:false,
          url:'',
          header:[

          ],
          body:[

          ],
          result:[
            {
              field: '',
              contentConfig: '',
              value: ''
            }
          ]
        },
				//审批人为空
				nobody: {
					handler: "TO_PASS",
					assignedUser: []
				},
				//审批人与发起人一致
				sameAsStarter: {
					handler: "TO_CONTINUE"
				},
				//审批人拒绝
				refuse: {
					handler: "TO_END",
					nodeId: ''
				},
				operList: [
					{
						key: 'pass',
						checked: true,
						edit: false,
						name: '通过',
						type: 'primary',
						defaultName: '通过'
					}, {
						key: 'refuse',
						checked: true,
						edit: false,
						name: '拒绝',
						type: 'danger',
						defaultName: '拒绝'
					}, {
						key: 'reject',
						checked: false,
						edit: false,
						name: '驳回',
						type: 'danger',
						icon: 'Back',

						defaultName: '驳回'
					}, {
						key: 'frontJoin',
						checked: false,
						edit: false,
						name: '委派',
						type: 'success',
						icon: 'CirclePlus',

						defaultName: '委派'
					}, {
						key: 'backJoin',
						checked: false,
						edit: false,
						name: '转办',
						type: 'warning',
						icon: 'Position',

						defaultName: '转办'
					}, {
						key: 'addAssignee',
						checked: false,
						edit: false,
						name: '加签',
						type: 'warning',
						icon: 'CirclePlusFilled',

						defaultName: '加签'
					}, {
						key: 'delAssignee',
						checked: false,
						edit: false,
						name: '减签',
						type: 'warning',
						icon: 'RemoveFilled',

						defaultName: '减签'
					}
				],

				"childNode": props.childNodeP,
				nodeUserList: []
			}
		} else if (type == 6) {
			//触发器
			data = {
				"id": util.getRandomId(),
				"nodeName": "触发器",
				"error": true,
				"type": 6,
				"parentId": props.currentNode.id,
				"childNode": props.childNodeP,
				httpSetting: {
					url: '',
					header: [
						{
							field: '',
							valueMode: true,
							value: ''
						}
					],
					body: [
						{
							field: '',
							valueMode: true,
							value: ''
						}
					],
					result: [
						{
							field: '',
							valueMode: true,
							value: ''
						}
					]
				}
			}
		}else if (type == 11) {
			//异步触发器
			data = {
				"id": util.getRandomId(),
				"nodeName": "异步触发器",
				"error": true,
				"type": 11,
				"parentId": props.currentNode.id,
				"childNode": props.childNodeP,
				httpSetting: {
					url: '',
					header: [
						{
							field: '',
							valueMode: true,
							value: ''
						}
					],
					body: [
						{
							field: '',
							valueMode: true,
							value: ''
						}
					],
					result: [
						{
							field: '',
							valueMode: true,
							value: ''
						}
					]
				}
			}
		} else if (type == 7) {
			//延时器
			data = {
				"id": util.getRandomId(),
				"nodeName": "延时器",
				error: true,
				"type": 7,
				"parentId": props.currentNode.id,
				"childNode": props.childNodeP,
				mode: true,
				delayUnit: 'TS',
				value: ''
			}
		} else if (type == 10) {
			//路由节点
			data = {
				"id": util.getRandomId(),
				"nodeName": "动态路由",
				error: true,
				"type": type,
				"parentId": props.currentNode.id,
				"childNode": props.childNodeP,
				list: [{

					groupRelationMode: true,
					mode: true,
					error: true,
					nodeId: '',
					placeHolder: '',
					groupRelation: [],
					conditionList: []
				}]
			}
		} else if (type == 9) {
			//子流程
			data = {
				"id": util.getRandomId(),
				"nodeName": "子流程",
				error: true,
				"type": 9,
				"parentId": props.currentNode.id,
				"childNode": props.childNodeP,
				starterMode: 1,
				starterValue: "",
				//单选还是多选
				multiple: false,
				completeRate: 100,
				//串行并行
				sequential: false,
				//多实例类型
				multipleMode: 1,
				//多实例类型值
				multipleModeValue: "",
				//多项表单对应的子流程表单
				multipleSubFormId: '',
				subFlowId: "",
		   subFlowIdArray:[],
				subFlowName: "",
				pcFormList: [],
				cpFormList: []

			}
		} else if (type == 2) {
			data = {
				"id": util.getRandomId(),
				"parentId": props.currentNode.id,

				"nodeName": "抄送人",
				"type": 2,
				"error": true,
				"childNode": props.childNodeP,
				nodeUserList: [],
				//表单权限
				formPerms: {},
        //第几级部门负责人
        deptLeaderLevel: 1,
        //人员选择
        formUserId: "",
        formUserName: "",
        //部门下的选择
        deptUserType:'allUser',
        //人员方式
        "assignedType": 1,
			}
		}
		emits("update:childNodeP", data)
	} else if (type == 4) {
		let id = util.getRandomId();
		emits("update:childNodeP", {
			"nodeName": "条件分支",
			"type": 4,
			"id": id,
			"parentId": props.currentNode.id,

			"childNode": props.childNodeP,
			"conditionNodes": [{
				"id": util.getRandomId(),
				"nodeName": "条件1",
				"mode": true,
				"groupRelationMode": true,
				"groupRelation": [],
				"error": true,
				"type": 3,
				parentId: id,

				"priorityLevel": 1,
				"conditionList": [{
					mode: true,
					conditionList: [{
						key: '',
						value: '',
						expression: ''
					}]
				}],
				"nodeUserList": [],
				"childNode": null,
			}, {
				"nodeName": "条件2",
				"type": 3,
				"groupRelationMode": true,
				"groupRelation": [],
				"id": util.getRandomId(),
				"mode": true,
				"error": false,
				parentId: id,
				"priorityLevel": 2,
				"conditionList": [
					{
						mode: true,
						conditionList: [{
							key: '',

							expression: ''
						}]
					}
				],
				"nodeUserList": [],
				"childNode": null
			}]
		})
	} else if (type == 8) {
		let id = util.getRandomId();
		emits("update:childNodeP", {
			"nodeName": "包容分支",
			"type": 8,
			"id": id,
			"parentId": props.currentNode.id,

			"childNode": props.childNodeP,
			"conditionNodes": [{
				"id": util.getRandomId(),
				"nodeName": "条件1",
				"mode": true,
				"groupRelationMode": true,
				"groupRelation": [],
				"error": true,
				"type": 3,
				parentId: id,

				"priorityLevel": 1,
				"conditionList": [{
					mode: true,
					conditionList: [{
						key: '',
						expression: ''
					}]
				}],
				"nodeUserList": [],
				"childNode": null,
			}, {
				"nodeName": "条件2",
				"type": 3,
				"groupRelationMode": true,
				"groupRelation": [],
				"id": util.getRandomId(),
				"mode": true,
				"error": false,
				parentId: id,
				"priorityLevel": 2,
				"conditionList": [
					{
						mode: true,
						conditionList: [{
							key: '',
							expression: ''
						}]
					}
				],
				"nodeUserList": [],
				"childNode": null
			}]
		})
	} else if (type == 5) {
		let id = util.getRandomId();
		emits("update:childNodeP", {
			"nodeName": "并行分支",
			"type": 5,
			"id": id,
			"parentId": props.currentNode.id,

			"childNode": props.childNodeP,
			"conditionNodes": [{
				"id": util.getRandomId(),
				"nodeName": "分支1",
				placeHolder: '满足条件',
				parentId: id,

				"error": false,
				"type": 3,
				"priorityLevel": 1,
				"conditionList": [],
				"nodeUserList": [],
				"childNode": null,
			}, {
				"nodeName": "分支2",
				"type": 3,
				"id": util.getRandomId(),
				parentId: id,

				"error": false,
				placeHolder: '满足条件',

				"priorityLevel": 2,
				"conditionList": [],
				"nodeUserList": [],
				"childNode": null
			}]
		})
	}
}
</script>
<style scoped lang="less">
.add-node-btn-box {
	width: 240px;
	display: -webkit-inline-box;
	display: -ms-inline-flexbox;
	display: inline-flex;
	-ms-flex-negative: 0;
	flex-shrink: 0;
	-webkit-box-flex: 1;
	-ms-flex-positive: 1;
	position: relative;

	&:before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
		margin: auto;
		width: 2px;
		height: 100%;
		background-color: #cacaca
	}

	.add-node-btn {
		user-select: none;
		width: 240px;
		padding: 20px 0 32px;
		display: flex;
		-webkit-box-pack: center;
		justify-content: center;
		flex-shrink: 0;
		-webkit-box-flex: 1;
		flex-grow: 1;

		.btn {
			outline: none;
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
			width: 30px;
			height: 30px;
			background: #3296fa;
			border-radius: 50%;
			position: relative;
			border: none;
			line-height: 30px;
			-webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
			transition: all .3s cubic-bezier(.645, .045, .355, 1);

			.iconfont {
				color: #fff;
				font-size: 16px
			}

			&:hover {
				transform: scale(1.3);
				box-shadow: 0 13px 27px 0 rgba(0, 0, 0, .1)
			}

			&:active {
				transform: none;
				background: #1e83e9;
				box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1)
			}
		}
	}
}
</style>
<style lang="less" scoped>
@import "../../css/workflow.css";
@import "../../css/temp/icon.css";

.add-node-popover-body {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;


	.add-node-popover-item {
		margin-right: 10px;
		cursor: pointer;
		text-align: center;
		flex: 1;
		//color: #191f25!important;
		.item-wrapper {
			user-select: none;
			display: inline-block;
			width: 80px;
			height: 80px;
			margin-bottom: 5px;
			background: #fff;
			border: 1px solid #e2e2e2;
			border-radius: 50%;
			transition: all .3s cubic-bezier(.645, .045, .355, 1);

			.iconfont {
				font-size: 35px;
				line-height: 80px
			}
		}

		&.approver {
			.item-wrapper {
				color: #ff943e
			}
		}

		&.notifier {
			.item-wrapper {
				//color: #3296fa
			}
		}

		&.condition {
			.item-wrapper {
				color: #15bc83
			}
		}

		&.ParallelGateway {
			.item-wrapper {
				color: rgb(255, 69, 0)
			}
		}

		&.InclusiveGateway {
			.item-wrapper {
				color: rgb(106, 90, 205)
			}
		}


		&.trigger {
			.item-wrapper {
				color: #0074d9
			}
		}

		&.delay {
			.item-wrapper {
				color: #b10dc9
			}
		}

		&.subProcess {
			.item-wrapper {
				color: #996633
			}
		}

		&.asynTrigger {
			.item-wrapper {
				color: #ff3300
			}
		}

		&.route {
			.item-wrapper {
				color: #999900
			}
		}

		&:hover {
			.item-wrapper {
				background: #3296fa;
				box-shadow: 0 10px 20px 0 rgba(50, 150, 250, .4)
			}

			.iconfont {
				color: #fff
			}
		}

		&:active {
			.item-wrapper {
				box-shadow: none;
				background: #eaeaea
			}

			.iconfont {
				//color: inherit
			}
		}
	}
}
</style>

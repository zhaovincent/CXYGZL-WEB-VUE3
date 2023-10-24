import {FormGroupVO, FormVO} from "./types";

const formGroupConfig: FormGroupVO[] = [
	{
		name: "文本",
		formList: [
			{
				name: "单行文本",
				type: "Input",
				typeName: "单行文本",
				icon: "EditPen",
				placeholder: "请填写",
				required: false,
				printable: true,
				props: {
					value: "",
					regex: "",
					regexDesc: "",
					minLength:undefined,
					maxLength:undefined
				},
			},
			{
				name: "多行文本",
				icon: "More",
				type: "Textarea",
				typeName: "多行文本",
				placeholder: "请填写",
				required: false,
				printable: true,
				props: {

					value: ""

				},
			},
			{
				name: "说明",
				icon: "ChatLineSquare",
				type: "Description",
				typeName: "说明",
				placeholder: "请填写",
				required: false,
				printable: true,
				props: {

					value: ""

				},
			}
		]
	},
	{name: "数值",
		formList: [
			{
				name: "数字",
				type: "Number",
				icon: "Edit",

				typeName: "数字",
				placeholder: "请填写",
				required: false,
				printable: true,
				props: {
					radixNum: 0


				},
			},
			{
				name: "金额",
				type: "Money",
				icon: "Money",

				typeName: "金额",
				placeholder: "请填写",
				required: false,
				printable: true,
				props: {
					radixNum: 0
				},
			}
		]
	},	{name: "日期-时间",
		formList: [
			{
				name: "日期",
				type: "Date",
				icon: "Calendar",

				typeName: "日期",
				placeholder: "请选择",
				required: false,
				printable: true,
				props: {
					radixNum: 0


				},
			}	,	{
				name: "日期时间",
				type: "DateTime",
				icon: "AlarmClock",

				typeName: "日期时间",
				placeholder: "请选择",
				required: false,
				printable: true,
				props: {
					radixNum: 0


				},
			}	,	{
				name: "时间",
				type: "Time",
				icon: "Timer",

				typeName: "时间",
				placeholder: "请选择",
				required: false,
				printable: true,
				props: {
					radixNum: 0


				},
			}
		]
	},
	{
	name:"选项",
		formList:[

			{
				name: "单选",
				icon: "Select",
				type: "SingleSelect",
				typeName: "单选",
				placeholder: "请选择",
				required: false,
				printable: true,
				props: {
					options: [
						{
							key: "",
							value: "",
						},
					],
				},
			},
			{
				name: "多选",
				type: "MultiSelect",
				typeName: "多选",
				icon: "Finished",
				placeholder: "请选择",
				required: false,
				printable: true,
				props: {
					value: [],
					options: [
						{
							key: "",
							value: "",
						},
					],
				},
			}
		]
	},{
	name:"其他",
		formList:[


			{
				name: "图片",
				type: "UploadImage",
				typeName: "图片",
				icon: "Picture",

				placeholder: "请选择",
				required: false,
				printable: true,
				props: {
					value: [], min: 1, max: 10, maxSize: 10
				},
			},


			{
				name: "文件",
				type: "UploadFile",
				typeName: "文件",
				icon: "Upload",
				placeholder: "请选择",
				required: false,
				printable: true,
				props: {
					value: [], min: 1, max: 10, maxSize: 10, suffixArray: []
				},
			},
			{
				name: "单用户",
				type: "SelectUser",
				typeName: "单用户",
				placeholder: "请选择",
				icon: "User",

				required: false,
				printable: true,
				props: {
					defaultRoot:false,
					multi: false,
					self: false,
					value: []
				},
			},
			{
				name: "多用户",
				type: "SelectMultiUser",
				typeName: "多用户",
				placeholder: "请选择",
				icon: "User",

				required: false,
				printable: true,
				props: {
					defaultRoot:false,
					multi: true,
					self: false,
					value: []
				},
			},
			{
				name: "单部门",
				icon: "OfficeBuilding",
				type: "SelectDept",
				typeName: "单部门",
				placeholder: "请选择",
				required: false,
				printable: true,
				props: {
					defaultRoot:false,
					multi: false,
					self: false,
					value: []
				},
			},
			{
				name: "多部门",
				icon: "OfficeBuilding",
				type: "SelectMultiDept",
				typeName: "多部门",
				placeholder: "请选择",
				required: false,
				printable: true,
				props: {
					defaultRoot:false,
					multi: true,
					self: false,
					value: []
				},
			},{
				name: "地区",
				type: "Area",
				typeName: "地区",
				icon: "Position",
				placeholder: "请选择",
				required: false,
				printable: true,
				props: {
					value: {}
				},
			},{
				name: "评分",
				type: "Score",
				typeName: "评分",
				icon: "StarFilled",
				placeholder: "请评分",
				required: false,
				printable: true,
				props: {
					value: 0, min: 1, max: 10,halfSelect:false,radixNum:1
				},
			},{
				name: "明细",
				type: "Layout",
				typeName: "明细",
				icon: "ShoppingBag",
				placeholder: "请选择",
				required: false,
				printable: true,
				props: {
					value: [], min: 1, max: 10
				},
			},{
				name: "手写签名",
				type: "Signature",
				typeName: "手写签名",
				icon: "EditPen",
				placeholder: "请录入",
				required: false,
				printable: true,
				props: {
					 lastContent:false
				},
			},{
				name: "计算公式",
				type: "Formula",
				typeName: "计算公式",
				icon: "Histogram",
				placeholder: "请填写",
				required: false,
				printable: true,
				props: {
					unit:'',
					readonly:true,
					expList:[]
				},
			}
		]
	}
]

export { formGroupConfig};

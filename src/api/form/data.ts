import {FormVO} from "@/api/form/types";

const formConfig: FormVO[] = [
	{
		name: "单行文本",
		type: "Input",
		typeName: "单行文本",
		icon: "EditPen",
		placeholder: "请填写",
		required: false,
		props: {
			value: ""
		},
	},
	{
		name: "多行文本",
		icon: "More",
		type: "Textarea",
		typeName: "多行文本",
		placeholder: "请填写",
		required: false,
		props: {

			value: ""

		},
	},
	{
		name: "数字",
		type: "Number",
		icon: "Edit",

		typeName: "数字",
		placeholder: "请填写",
		required: false,
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
		props: {
			radixNum: 0
		},
	},
	{
		name: "单选",
		icon: "Select",
		type: "SingleSelect",
		typeName: "单选",
		placeholder: "请选择",
		required: false,
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
		props: {
			value: [],
			options: [
				{
					key: "",
					value: "",
				},
			],
		},
	},
	{
		name: "图片",
		type: "UploadImage",
		typeName: "图片",
		icon: "Picture",

		placeholder: "请选择",
		required: false,
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
		props: {
			value: [], min: 1, max: 10, maxSize: 10, suffixArray: []
		},
	},
	{
		name: "用户",
		type: "SelectUser",
		typeName: "用户",
		placeholder: "请选择",
		icon: "User",

		required: false,
		props: {

			multi: false,
			self: false,
			value: []
		},
	},
	{
		name: "部门",
		icon: "OfficeBuilding",
		type: "SelectDept",
		typeName: "部门",
		placeholder: "请选择",
		required: false,
		props: {
			multi: false,
			self: false,
			value: []
		},
	},
];
export {formConfig};

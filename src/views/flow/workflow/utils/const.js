/*
 * @Date: 2023-03-29 15:25:37
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-29 15:52:38
 * @FilePath: /Workflow-Vue3/src/utils/const.js
 */

export let bgColors = ['87, 106, 149', '255, 148, 62', '50, 150, 250','','21,188,131','255,69,0','0,116,217','177,13,201',"106, 90, 205","153,102,51","153,153,0"]
export let placeholderList = ["发起人", "审批人", "抄送人",'','','','触发器','延时器',"子流程","路由"];

export let setTypes = [
  {value: 1, label: '指定成员'},
  {value: 2, label: '部门主管'},
  {value: 3, label: '角色'},
  {value: 4, label: '发起人自选'},
  {value: 5, label: '发起人自己'},
  {value: 7, label: '连续多级主管'},
  {value: 8, label: '表单人员'},
  {value: 9, label: '表单部门'},
]



//表达式
export let conditionExpression = ref(
	{
		"SelectDept": [
            {
                key: "empty",
                name: "为空"
            },
            {
                key: "notempty",
                name: "不为空"
            },
			{
				key: "in",
				name: "属于"
			}, {
				key: "notin",
				name: "不属于"
			}
		],

		"SelectUser": [
            {
                key: "empty",
                name: "为空"
            },
            {
                key: "notempty",
                name: "不为空"
            },
			{
				key: "in",
				name: "属于"
			}, {
				key: "notin",
				name: "不属于"
			}
		],

		"Input": [
			{
				key: "empty",
				name: "为空"
			},
			{
				key: "notempty",
				name: "不为空"
			},
			{
				key: "==",
				name: "等于"
			}, {
				key: "!=",
				name: "不等于"
			}, {
				key: "contain",
				name: "包含"
			}, {
				key: "notcontain",
				name: "不包含"
			}
		],

		"Textarea": [
			{
				key: "empty",
				name: "为空"
			},
			{
				key: "notempty",
				name: "不为空"
			},
			{
				key: "==",
				name: "等于"
			}, {
				key: "!=",
				name: "不等于"
			}, {
				key: "contain",
				name: "包含"
			}, {
				key: "notcontain",
				name: "不包含"
			}
		],
		"Number": [
			{
				key: "empty",
				name: "为空"
			},
			{
				key: "notempty",
				name: "不为空"
			},
			{
				key: "==",
				name: "等于"
			}, {
				key: "!=",
				name: "不等于"
			}, {
				key: ">",
				name: "大于"
			}, {
				key: ">=",
				name: "大于等于"
			}, {
				key: "<",
				name: "小于"
			}, {
				key: "<=",
				name: "小于等于"
			}
		],
		"Score": [
			{
				key: "empty",
				name: "为空"
			},
			{
				key: "notempty",
				name: "不为空"
			},
			{
				key: "==",
				name: "等于"
			}, {
				key: "!=",
				name: "不等于"
			}, {
				key: ">",
				name: "大于"
			}, {
				key: ">=",
				name: "大于等于"
			}, {
				key: "<",
				name: "小于"
			}, {
				key: "<=",
				name: "小于等于"
			}
		],
		"Date": [
			{
				key: "empty",
				name: "为空"
			},
			{
				key: "notempty",
				name: "不为空"
			},
			{
				key: "==",
				name: "等于"
			}, {
				key: "!=",
				name: "不等于"
			}, {
				key: ">",
				name: "大于"
			}, {
				key: ">=",
				name: "大于等于"
			}, {
				key: "<",
				name: "小于"
			}, {
				key: "<=",
				name: "小于等于"
			}
		],
		"DateTime": [
			{
				key: "empty",
				name: "为空"
			},
			{
				key: "notempty",
				name: "不为空"
			},
			{
				key: "==",
				name: "等于"
			}, {
				key: "!=",
				name: "不等于"
			}, {
				key: ">",
				name: "大于"
			}, {
				key: ">=",
				name: "大于等于"
			}, {
				key: "<",
				name: "小于"
			}, {
				key: "<=",
				name: "小于等于"
			}
		],
		"Time": [
			{
				key: "empty",
				name: "为空"
			},
			{
				key: "notempty",
				name: "不为空"
			},
			{
				key: "==",
				name: "等于"
			}, {
				key: "!=",
				name: "不等于"
			}, {
				key: ">",
				name: "大于"
			}, {
				key: ">=",
				name: "大于等于"
			}, {
				key: "<",
				name: "小于"
			}, {
				key: "<=",
				name: "小于等于"
			}
		],
		"Area":[
			{
				key: "empty",
				name: "为空"
			},
			{
				key: "notempty",
				name: "不为空"
			},
			{
				key: "==",
				name: "等于"
			}, {
				key: "!=",
				name: "不等于"
			}, {
				key: "contain",
				name: "包含"
			}, {
				key: "notcontain",
				name: "不包含"
			},{
				key: "in",
				name: "属于"
			}, {
				key: "notin",
				name: "不属于"
			}
		],
		"Money": [
			{
				key: "empty",
				name: "为空"
			},
			{
				key: "notempty",
				name: "不为空"
			},
			{
				key: "==",
				name: "等于"
			}, {
				key: "!=",
				name: "不等于"
			}, {
				key: ">",
				name: "大于"
			}, {
				key: ">=",
				name: "大于等于"
			}, {
				key: "<",
				name: "小于"
			}, {
				key: "<=",
				name: "小于等于"
			}
		],
		"SingleSelect": [
            {
                key: "empty",
                name: "为空"
            },
            {
                key: "notempty",
                name: "不为空"
            },
			{
				key: "in",
				name: "属于"
			}, {
				key: "notin",
				name: "不属于"
			}
		]
	}
)


export let delayUnitOpts = [
  {value: 'M', label: '月'},
  {value: 'D', label: '天'},
  {value: 'TH', label: '小时'},
  {value: 'TM', label: '分钟'},
  {value: 'TS', label: '秒'},
]

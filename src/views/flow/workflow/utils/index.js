function All() {
}


import {useFlowStore} from '../stores/flow'
import {delayUnitOpts, conditionExpression} from '../utils/const.js'


let flowStore = useFlowStore();
const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
})
const formIdObj = computed(() => {
	var obj = {}
	for (var item of step2FormList.value) {
		obj[item.id] = item;
	}
	obj['root'] = {
		name: "发起人",
		type: 'SelectUser'
	}
	return obj
})


All.prototype = {
	timer: "",
	debounce(fn, delay = 500) {
		var _this = this;
		return function (arg) {
			//获取函数的作用域和变量
			let that = this;
			let args = arg;
			clearTimeout(_this.timer) // 清除定时器
			_this.timer = setTimeout(function () {
				fn.call(that, args)
			}, delay)
		}
	},
	setCookie(val) { //cookie设置[{key:value}]、获取key、清除['key1','key2']
		for (var i = 0, len = val.length; i < len; i++) {
			for (var key in val[i]) {
				document.cookie = key + '=' + encodeURIComponent(val[i][key]) + "; path=/";
			}
		}
	},
	getCookie(name) {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split("; ");
		for (var i = 0, len = arrCookie.length; i < len; i++) {
			var arr = arrCookie[i].split("=");
			if (name == arr[0]) {
				return decodeURIComponent(arr[1]);
			}
		}
	},
	clearCookie(name) {
		var myDate = new Date();
		myDate.setTime(-1000); //设置时间
		for (var i = 0, len = name.length; i < len; i++) {
			document.cookie = "" + name[i] + "=''; path=/; expires=" + myDate.toGMTString();
		}
	},
	arrToStr(arr) {
		if (arr) {
			return arr.map(item => {
				return item.name
			}).toString()
		}
	},
	toggleClass(arr, elem, key = 'id') {
		return arr.some(item => {
			return item[key] == elem[key]
		});
	},
	toChecked(arr, elem, key = 'id') {
		var isIncludes = this.toggleClass(arr, elem, key);
		!isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key);
	},
	removeEle(arr, elem, key = 'id') {
		var includesIndex;
		arr.map((item, index) => {
			if (item[key] == elem[key]) {
				includesIndex = index
			}
		});
		arr.splice(includesIndex, 1);
	},
	checkApproval(nodeConfig) {


		if (nodeConfig.assignedType == 1) {


			//指定成员
			if (nodeConfig.nodeUserList.length == 0) {
				return false;

			}
		} else if (nodeConfig.assignedType == 3) {


			//指定角色
			if (nodeConfig.nodeUserList.length == 0) {
				return false

			}
		} else if (nodeConfig.assignedType == 8 && nodeConfig.formUserId.length == 0) {
			//表单
			return false;
		}

		//审批人为空
		if (nodeConfig.nobody.handler === 'TO_USER' && nodeConfig.nobody.assignedUser.length == 0) {
			return false;
		}
		//操作权限
		let operList = nodeConfig.operList;
		let length = operList?.filter(res => res.checked).length;
		if (length == 0) {
			return false;
		}

		return true;
	},
	setApproverStr(nodeConfig) {


		if (nodeConfig.assignedType == 1) {


			//指定成员
			if (nodeConfig.nodeUserList.length >= 1) {
				return nodeConfig.nodeUserList.map(res => res.name).join(",")

			} else {
				return ""

			}
		} else if (nodeConfig.assignedType == 3) {


			//指定角色
			if (nodeConfig.nodeUserList.length >= 1) {
				return nodeConfig.nodeUserList.map(res => res.name).join(",")

			} else {
				return ""

			}
		} else if (nodeConfig.assignedType == 2) {
			return nodeConfig.deptLeaderLevel == 1 ? '直接部门主管' : '第' + nodeConfig.deptLeaderLevel + '级部门主管'

		} else if (nodeConfig.assignedType == 4) {
			//发起人自选
			return "发起人自选"

		} else if (nodeConfig.assignedType == 5) {
			return "发起人自己"
		} else if (nodeConfig.assignedType == 7) {
			return '到第' + nodeConfig.deptLeaderLevel + '级部门主管终止'
		} else if (nodeConfig.assignedType == 8 && nodeConfig.formUserId.length > 0) {
			//表单
			return '表单：' + nodeConfig.formUserName
		}
		return "";
	},
	dealStr(str, obj) {
		let arr = [];
		let list = str.split(",");
		for (var elem in obj) {
			list.map(item => {
				if (item == elem) {
					arr.push(obj[elem].value)
				}
			})
		}
		return arr.join("或")
	},
	checkCondition(conditionsConfig, index) {
		let conditionNodes = conditionsConfig.conditionNodes;
		let conditionNode = conditionNodes[index];

		let conditionList = conditionNode.conditionList;
		if (conditionList.length == 0) {
			return false;
		}
		if (index != conditionNodes.length - 1) {

			for (var it of conditionList) {
				if (it.conditionList.length == 0) {
					return false;
				}

				for (var ite of it.conditionList) {


					if (!ite.key || ite.key.length == 0 || !ite.expression || ite.expression.length == 0 || !ite.value || ite.value.length == 0) {

						return false;
					}
				}
			}


		}

		return true;

	},
	conditionStr(nodeConfig, index) {

		let conditionNodes = nodeConfig.conditionNodes;
		if (index == conditionNodes.length - 1) {
			return '默认条件'
		}
		let conditionNode = conditionNodes[index];
		let groupRelationMode = conditionNode.groupRelationMode;

		let groupRelation = conditionNode.groupRelation;
		var {conditionList} = conditionNode;
		var groupMode = conditionNode.mode;
		if (conditionList.length == 0) {
			return (index == conditionNodes.length - 1) ? '其他条件进入此流程' : '请设置条件'
		} else {

			var groupConArr = [];
			for (var groupCondition of conditionList) {

				let mode = groupCondition.mode;

				var conArr = [];

				for (var con of groupCondition.conditionList) {


					const {key, expression, value} = con;
					if (!key) {
						continue
					}


					let valueElement = formIdObj.value[key];


					var name = valueElement.name;

					var valueShow = value;
					if (valueElement.type === 'SelectUser') {

						let userKey = con.userKey;
						let userKeyFieldList = con.userKeyFieldList;

						let ele = userKeyFieldList.filter(r=>r.key===userKey)[0];
						let type = ele.type;
						if(type==='SelectUser'||type=='SelectDept'){
							valueShow = value.map(res => res.name).join(",")
						} else if (type === 'SingleSelect') {
							let options = JSON.parse(ele.props).options;
							if (!options) {
								options = []
							}
							//valueShow = value.map(res => res.name).join(",")
							var arr = [];
							for (var ite of options) {
								if (value.indexOf(ite.key) > -1) {
									arr.push(ite.value)
								}
							}
							valueShow = arr.join(",")
						} else {
							if (!valueShow) {
								valueShow = '?'
							}
						}

					} else if (valueElement.type === 'SelectDept') {
						valueShow = value.map(res => res.name).join(",")
					} else if (valueElement.type === 'SingleSelect') {
						let options = valueElement.props.options;
						if (!options) {
							options = []
						}
						//valueShow = value.map(res => res.name).join(",")
						var arr = [];
						for (var ite of options) {
							if (value.indexOf(ite.key) > -1) {
								arr.push(ite.value)
							}
						}
						valueShow = arr.join(",")
					} else {
						if (!valueShow) {
							valueShow = '?'
						}
					}


					var expObj = {}

					for (var item in conditionExpression.value) {
						let arr = conditionExpression.value[item];
						for (var it of arr) {
							expObj[it.key] = it.name
						}
					}
					if (valueElement.type === 'SelectUser') {

						let userKey = con.userKey;
						let userKeyFieldList = con.userKeyFieldList;
						let ele = userKeyFieldList.filter(r=>r.key===userKey)[0];
						conArr.push(name + ' '+ele.name + ' ' + expObj[expression] + " " + valueShow)

					}else{
						conArr.push(name + ' ' + expObj[expression] + " " + valueShow)

					}


				}

				if (mode) {
					let s = conArr.join(" 且 ");
					if (conArr.length > 0) {
						groupConArr.push('(' + s + ')')

					}
				} else {
					let s = conArr.join(" 或 ");
					if (conArr.length > 0) {
						groupConArr.push('(' + s + ')')

					}
				}

			}

			if (groupRelationMode == undefined ? true : groupRelationMode) {
				return groupConArr.length > 0 ? groupConArr.join(groupMode ? " 且 " : " 或 ") : (index == conditionNodes.length - 1 ? '默认条件' : '请设置条件')
			}
			if (groupConArr.length == 0) {
				return '请设置条件';
			}

			var str = groupRelation
				.replaceAll('$或$', '或')
				.replaceAll('$)$', ')')
				.replaceAll('$($', '(')
				.replaceAll('$且$', '且');

			for (var k = 0; k < groupConArr.length; k++) {
				str = str.replaceAll('$条件组' + (k + 1) + '$', groupConArr[k]);
			}


			return str;


		}
	},
	copyerStr(nodeConfig) {


		if (nodeConfig.nodeUserList?.length != 0) {
			return this.arrToStr(nodeConfig.nodeUserList)
		}
	},
	triggerStr(nodeConfig) {

		return nodeConfig.httpSetting.url;

	},
	checkTrigger(nodeConfig) {

		let url = nodeConfig.httpSetting.url;

		var regUrl = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;

		return regUrl.test(url);


	},
	delayStr(nodeConfig) {


		let value = nodeConfig.value;
		let newVar = value?.length > 0 ? value : '?';

		let mode = nodeConfig.mode;
		let delayUnit = nodeConfig.delayUnit;
		if (mode) {
			let filterElement = delayUnitOpts.filter(res => res.value === delayUnit)[0];
			return "等待" + newVar + filterElement.label
		}

		return '等至' + newVar;

	},
	subProcessStr(nodeConfig) {

		const {starterMode, starterValue, subFlowId, subFlowName} = nodeConfig;

		console.log('子流程节点', nodeConfig)

		return '子流程:' + (subFlowName?.length > 0 ? subFlowName : '?');

	},
	subProcessOK(nodeConfig) {

		if (nodeConfig == undefined) {
			return false
		}
		const {
			starterMode,
			starterValue,
			subFlowId,
			pcFormList,
			multiple,
			multipleMode,
			multipleModeValue
		} = nodeConfig;

		//是否选择了子流程
		if (subFlowId.length == 0) {
			return false;
		}
		//主子表单映射
		for (var item of pcFormList) {
			if (item.field.length == 0 || item.value.length == 0) {
				return false;
			}
		}
		if (multiple) {
			//多实例
			if (multipleMode == 2 || multipleMode == 3) {
				//多实例来源是数字表单
				if (!multipleModeValue || multipleModeValue.length == 0) {
					return false;
				}
			}

		} else {

		}

		if (starterMode == 2) {
			//子流程发起人要选择表单
			if (starterValue.length == 0) {
				return false;
			}
		}

		if (starterMode == 3) {
			//多实例
			if (!multiple) {
				return false;
			}

			if (multipleMode != 3) {
				return false;
			}
			if (multipleModeValue.length == 0) {
				return false;
			}
		}


		return true;
	}
}

export default new All();

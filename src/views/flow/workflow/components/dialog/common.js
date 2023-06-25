/*
 * @Date: 2022-08-29 14:00:42
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-29 15:53:05
 * @FilePath: /Workflow-Vue3/src/components/dialog/common.js
 */

import {getRoles, getEmployees} from '../../api/index.js'
import {orgTree, orgTreeSearcheUser} from '@/api/dept/index.ts'
import $func from '../../utils/index.js'
import {ref, reactive} from 'vue'

export let searchVal = ref('')
export let departments = ref({
	titleDepartments: [],
	childDepartments: [],
	employees: [],
})
export let roles = ref({})
export let getRoleList = async () => {
	let {data: {list}} = await getRoles()
	roles.value = list;
}
export let getDepartmentList = async (parentId = 0,type='org') => {
	// let { data } = await getDepartments({ parentId })

	let {data} = await orgTree(type, parentId)

	departments.value = data;

}
export let getDebounceData = (event, type = 1) => {

	console.log(event,type)

	$func.debounce(async () => {

		if (event) {
			let data = {
				userName: event,
				pageNum: 1,
				pageSize: 30
			}
			if (type == 1) {
				departments.value.childDepartments = [];
				let res = await orgTreeSearcheUser(data)
				departments.value.employees = res.data
			} else {
				let res = await getRoles(data)
				roles.value = res.data.list
			}
		} else {
			type == 1 ? await getDepartmentList() : await getRoleList();
		}
	})()
}

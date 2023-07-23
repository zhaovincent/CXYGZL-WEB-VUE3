/*
 * @Date: 2022-08-25 14:06:59
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-29 15:52:57
 * @FilePath: /Workflow-Vue3/src/api/index.js
 */

import http from '../utils/axios'
let baseUrl = import.meta.env.BASE_URL

/**
 * 获取角色
 * @param {*} data
 * @returns
 */
export function getRoles(data) {
  return http.get(`${baseUrl}roles.json`, { params: data })
}

/**
 * 获取部门
 * @param {*} data
 * @returns
 */
export function getDepartments(data) {
  return http.get(`${baseUrl}departments.json`, { params: data })
}

/**
 * 获取职员
 * @param {*} data
 * @returns
 */
export function getEmployees(data) {
  return http.get(`${baseUrl}employees.json`, { params: data })
}
/**
 * 获取条件字段
 * @param {*} data
 * @returns
 */
export function getConditions(data) {
  return http.get(`${baseUrl}conditions.json`, { params: data })
}

/**
 * 获取审批数据
 * @param {*} data
 * @returns
 */
export function getWorkFlowData(data) {
  return http.get(`${baseUrl}data.json`, { params: data })
}
/**
 * 设置审批数据
 * @param {*} data
 * @returns
 */
export function setWorkFlowData(data) {
  return http.post(`${baseUrl}`, data)
}

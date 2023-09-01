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



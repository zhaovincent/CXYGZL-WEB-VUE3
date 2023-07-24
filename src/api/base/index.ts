import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import http from "@/views/flow/workflow/utils/axios";

let baseUrl = import.meta.env.BASE_URL

/**
 * 获取首页数据
 */
export function getIndexData() {
	return request({
		url: '/base/index',
		method: 'get'
	});
}

/**
 * 获取地区列表
 */
export function queryAreaList() {
	return http.get(`${baseUrl}area.json`, {   })

}

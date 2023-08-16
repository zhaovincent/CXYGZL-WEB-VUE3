import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import http from "@/views/flow/workflow/utils/axios";
import {areaData} from "@/views/flow/workflow/utils/area";

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
 * 同步数据
 */
export function loadRemoteData() {
	return request({
		url: '/base/loadRemoteData',
		method: 'post'
	});
}

/**
 * 获取地区列表
 */
export function queryAreaList() {
	return areaData;

}

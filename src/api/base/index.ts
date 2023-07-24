import request from '@/utils/request';
import { AxiosPromise } from 'axios';


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
	return request({
		url: '/base/areaList',
		method: 'get'
	});
}

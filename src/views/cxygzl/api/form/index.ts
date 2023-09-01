import request from '../../utils/request';
import { AxiosPromise } from 'axios';

/**
 * 查询排除的表单
 */

export function getExcludeFormList():AxiosPromise {
	return request({
		url: '/form/getExcludeFormList',
		method: 'get',
		params:{}
	});
}

import request from '@/utils/request';
import {AxiosPromise} from 'axios';


/**
 * 创建流程
 *
 * @param data
 */
export function addFlow(data: any) {
	return request({
		url: '/process/create',
		method: 'post',
		data: data
	});
}

/**
 * 获取流程详细信息
 *
 * @param data
 */
export function getFlowDetail(flowId: string, handleForm: boolean) {
	if (handleForm == undefined || handleForm == null) {
		handleForm = false
	}
	return request({
		url: '/process/getDetail?flowId=' + flowId + "&handleForm=" + handleForm,
		method: 'get'
	});
}

/**
 * 停用流程
 *
 * @param data
 */
export function disableFlow(flowId: string) {
	return request({
		url: '/process/update/' + flowId + "?type=stop",
		method: 'put'
	});
}

/**
 * 删除流程
 *
 * @param data
 */
export function deleteFlow(flowId: string) {
	return request({
		url: '/process/update/' + flowId + "?type=delete",
		method: 'put'
	});
}

/**
 * 启用流程
 *
 * @param data
 */
export function enableFlow(flowId: string) {
	return request({
		url: '/process/update/' + flowId + "?type=using",
		method: 'put'
	});
}

/**
 * 发起流程
 *
 * @param data
 */
export function startFlow(obj: any) {
	return request({
		url: '/process-instance/startProcessInstance',
		method: 'post',
		data: obj
	});
}

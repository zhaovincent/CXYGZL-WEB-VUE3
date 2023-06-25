import request from '@/utils/request';
import { AxiosPromise } from 'axios';


// 查询抄送详细信息
export function queryMineCCDetail(param:any) {
	return request({
		url: 'processCopy/querySingleDetail',
		method: 'get',
		params: param
	})
}

/**
 * 抄送给我的
 *
 * @param data
 */
export function queryMineCC(data: any) {
	return request({
		url: '/process-instance/queryMineCC',
		method: 'post',
		data: data
	});
}
/**
 * 查询待办任务
 *
 * @param data
 */
export function queryMineTask(data: any) {
	return request({
		url: '/process-instance/queryMineTask',
		method: 'post',
		data: data
	});
}
// 结束流程
export function stopProcessInstance(param:any) {
	return request({
		url: 'task/stopProcessInstance',
		method: 'post',
		data: param
	})
}

/**
 * 查询我发起的任务
 *
 * @param data
 */
export function queryMineStarted(data: any) {
	return request({
		url: '/process-instance/queryMineStarted',
		method: 'post',
		data: data
	});
}


// 查询当前用户已办任务
export function queryMineEndTask(param) {
	return request({
		url: 'process-instance/queryMineEndTask',
		method: 'post',
		data: param
	})
}


/**
 * 查询任务详细信息
 *
 * @param data
 */
export function queryTask(taskId: string) {
	return request({
		url: '/task/queryTask?taskId='+taskId,
		method: 'get'
	});
}
/**
 * 查看流程图
 *
 * @param data
 */
export function showImage(processInstanceId: string) {
	return request({
		url: '/process-instance/showImg?procInsId='+processInstanceId,
		method: 'get'
	});
}
// 完成任务
export function completeTask(param:Object) {
	return request({
		url: 'task/completeTask',
		method: 'post',
		data: param
	})
}

// 格式化流程节点显示
export function formatStartNodeShow(param:Object) {
	return request({
		url: 'process-instance/formatStartNodeShow',
		method: 'post',
		data: param
	})
}

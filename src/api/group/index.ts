import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {Group, GroupVO} from './types';


/**
 * 添加分组
 *
 * @param data
 */
export function addGroup(data: Group) {
  return request({
    url: '/admin/flow/createGroup',
    method: 'post',
    data: data
  });
}
/**
 * 删除分组
 *
 * @param data
 */
export function delGroup(id: number) {
  return request({
    url: '/admin/flow/group/'+id,
    method: 'delete'

  });
}

/**
 * 查询分组列表
 */

export function queryGroupList():AxiosPromise<GroupVO[]> {
	return request({
		url: '/admin/flow/group/list',
		method: 'get'
	});
}

/**
 * 查询分组和流程列表
 */

export function queryGroupFlowList(hidden?:Boolean):AxiosPromise<GroupVO[]> {
	return request({
		url: '/admin/flow/group/',
		method: 'get',
		params:{hidden:hidden}
	});
}

/**
 * 查询我可发起的组和流程
 */

export function queryMineStartGroupFlowList(hidden?:Boolean):AxiosPromise<GroupVO[]> {
	return request({
		url: '/admin/flow/startGroup',
		method: 'get',
		params:{hidden:hidden}
	});
}

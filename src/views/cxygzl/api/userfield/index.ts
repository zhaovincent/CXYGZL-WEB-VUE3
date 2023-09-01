import request from '../../utils/request';
import { AxiosPromise } from 'axios';
import { UserForm, UserInfo, UserPageVO, UserQuery } from '../user/types';



/**
 * 获取用户属性
 *
 * @param userId
 */
export function queryAll(): AxiosPromise<UserForm> {
  return request({
    url: '/userField/queryAll',
    method: 'get'
  });
}

/**
 * 添加用户属性
 *
 * @param data
 */
export function saveRemoteData(data: any) {
  return request({
    url: '/userField/save',
    method: 'post',
    data: data
  });
}

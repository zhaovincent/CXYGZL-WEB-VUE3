import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CaptchaResult, LoginData, LoginResult } from './types';

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  });
}

export function loginByTokenApi(token: string): AxiosPromise<LoginResult> {
  return request({
    url: '/user/loginByToken?token='+token,
    method: 'get'
  });
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: '/user/logout',
    method: 'post'
  });
}



/**
 * 获取验证码
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
  return request({
    url: '/user/captcha',
    method: 'get'
  });
}

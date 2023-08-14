import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useUserStoreHook } from '@/store/modules/user';

import JSONBIG from "json-bigint";

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8','CxygzlVersion':import.meta.env.VITE_APP_VERSION },
	transformResponse: [ data => {
		console.log("=============transformResponse=========================")
		const json = JSONBIG({
			storeAsString: true
		})
		const res = json.parse(data)

		return res
	}]
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {


    const userStore = useUserStoreHook();
    if (userStore.token) {
      config.headers.Authorization = userStore.token;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {


	  let data = response.data;




    const { code, msg ,ok} = data;
    if (ok===true) {
      return data;
    }
    // 响应数据为二进制流处理(Excel导出)
    if (data instanceof ArrayBuffer) {
      return response;
    }

    ElMessage.error(msg || '系统出错');
    return Promise.reject(new Error(msg || 'Error'));
  },
  (error: any) => {
    if (error.response.data) {
      const { code, msg } = error.response.data;
      // token 过期,重新登录
      if (code === 'A0230') {
        ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          localStorage.clear();
          window.location.href = '/';
        });
      } else {
        ElMessage.error(msg || '系统出错');
      }
    }
    return Promise.reject(error.message);
  }
);

// 导出 axios 实例
export default service;

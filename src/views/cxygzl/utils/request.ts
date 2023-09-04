import axios, {InternalAxiosRequestConfig, AxiosResponse} from 'axios';
import {useUserStoreHook} from '../stores/user';
import {ElLoading} from 'element-plus'

// 创建 axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 60000,
	headers: {'Content-Type': 'application/json;charset=utf-8', 'CxygzlVersion': import.meta.env.VITE_APP_VERSION},
	transformResponse: [data => {
		const res = JSON.parse(data)

		return res
	}]
});

var unloadingUrlList=[
	'message/unreadNum',
	"org/tree",
	'process-instance/formatStartNodeShow'
]

var loadingFlag = undefined;

// 请求拦截器
service.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		//debugger
		let url = config.url;

		var matchUrl=false;

		//判断是否需要显示loading页面
		for(var murl of unloadingUrlList){
			if(url.indexOf(murl)>=0){
				matchUrl=true;
				break
			}
		}
		if (!loadingFlag&&!matchUrl) {
			loadingFlag = ElLoading.service({
				lock: true,
				text: '加载中',
				background: 'rgba(0, 0, 0, 0.7)',
			})

		}


		const userStore = useUserStoreHook();
		if (userStore.token) {
			config.headers.Authorization = userStore.token;
		}
		return config;
	},
	(error: any) => {
		if(loadingFlag){
			loadingFlag.close();
			loadingFlag=undefined;
		}
		return Promise.reject(error);
	}
);

// 响应拦截器
service.interceptors.response.use(
	(response: AxiosResponse) => {

		let url = response.config.url;

		var matchUrl=false;

		//判断是否需要显示loading页面
		for(var murl of unloadingUrlList){
			if(url.indexOf(murl)>=0){
				matchUrl=true;
				break
			}
		}

		if(loadingFlag&&!matchUrl){
			loadingFlag.close();
			loadingFlag=undefined;

		}

		let data = response.data;


		const {code, msg, ok} = data;
		if (ok === true) {
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

		if(loadingFlag){
			loadingFlag.close();
			loadingFlag=undefined;

		}

		if (error.response.data) {
			const {code, msg} = error.response.data;
			// token 过期,重新登录
			if (code === '402') {
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

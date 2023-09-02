import request from '@/utils/request';



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



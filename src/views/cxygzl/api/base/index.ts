import request from '../../utils/request';




/**
 * 节点格式化数据显示
 */
export function formatStartNodeShow(d) {
	return request({
		url: '/base/formatStartNodeShow',
		method: 'post',
		data:d
	});
}


/**
 * 查询头部显示数据
 */
export function queryHeaderShow(d) {
	return request({
		url: '/base/queryHeaderShow',
		method: 'post',
		data:d
	});
}



/**
 * 查询操作数据
 */
export function queryTaskOperData(d) {
	return request({
		url: '/base/queryTaskOperData',
		method: 'get',
		params:{taskId:d}
	});
}



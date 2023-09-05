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



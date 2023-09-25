import request from '../../utils/request';




//  流程详情
export function detail(param:any) {
	return request({
		url: '/process-instance/detail',
		method: 'get',
		params: param
	})
}


import request from '../../utils/request';




//  流程详情
export function detail(param:any) {
	return request({
		url: '/process-instance/detail',
		method: 'get',
		params: param
	})
}



//  导出流程详情
export function exportDetail(param:any) {
	return request({
		url: '/process-instance/export/'+param,
		method: 'post'
	})
}

// 结束流程
export function stopProcessInstance(param:any) {
    return request({
        url: 'process-instance/stopProcessInstance/'+param,
        method: 'post'
    })
}


// 催办任务
export function urgeProcessInstance(param:any) {
    return request({
        url: 'process-instance/urgeProcessInstance',
        method: 'post',
        data: param
    })
}

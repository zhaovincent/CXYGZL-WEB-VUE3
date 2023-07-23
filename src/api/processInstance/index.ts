import request from '@/utils/request';
import { AxiosPromise } from 'axios';




//  流程详情
export function detail(param:any) {
	return request({
		url: 'process-instance/detail',
		method: 'get',
		params: param
	})
}

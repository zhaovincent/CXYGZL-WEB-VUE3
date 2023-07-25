import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import http from "@/views/flow/workflow/utils/axios";


/**
 * 获取未读数量
 */
export function getMessageUnreadNum() {
	return request({
		url: '/message/unreadNum',
		method: 'get'
	});
}


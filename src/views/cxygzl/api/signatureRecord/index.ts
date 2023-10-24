import request from '../../utils/request';


/**
 * 保存签名记录
 * @param d
 */
export function createSignatureRecord(d) {
	return request({
		url: '/signatureRecord/create',
		method: 'post',
		data:d
	});
}


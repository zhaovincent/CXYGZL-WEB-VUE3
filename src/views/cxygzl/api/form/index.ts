import request from '../../utils/request';
import {AxiosPromise} from 'axios';

/**
 * 获取表单
 */

export function getFormList(d, handleForm): AxiosPromise {
    if (handleForm == undefined) {
        handleForm = false
    }

    return request({
        url: '/form/getFormList?handleForm=' + handleForm,
        method: 'post',
        data: d
    });
}

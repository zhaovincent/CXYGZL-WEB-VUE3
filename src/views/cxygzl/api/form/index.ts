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

/**
 * 获取动态表单
 */

export function dynamicFormList(d): AxiosPromise {


    return request({
        url: '/form/dynamicFormList',
        method: 'post',
        data: d
    });
}

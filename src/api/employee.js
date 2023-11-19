import request from '@/utils/request'

/**
 * 封装获取员工列表的api
 * **/
export function getEmployeeList(params){
    return request({
        url:'/sys/user',
        method:'get',
        params //地址参数 查询参数
    })
}
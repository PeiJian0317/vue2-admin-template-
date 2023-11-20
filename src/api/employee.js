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

/**
 * 封装导出员工excel接口
 * **/
export function exportEmployee(){
    return request({
        url:'/sys/user/export',
        method:'get',
        //改变接受数据类型
        responseType:'blob' //使用blob接收二进制文件流
    })
}
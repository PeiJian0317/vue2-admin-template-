import request from '@/utils/request'

//封装组织架构api
export function getDepartment(){
    return request({
        url:'/company/department',
    })
}

//封装获取部门负责人列表的api
export function getManagerList(){
    return request({
        url:'/sys/user/simple',
        method:'get'
    })
}

//封装新增部门的api
export function addDepartment(data){
    return request({
        url:'/company/department',
        method:'post',
        data
    })
}
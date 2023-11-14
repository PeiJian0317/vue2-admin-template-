import request from '@/utils/request'

//封装组织架构api
export function getDepartment(){
    return request({
        url:'/company/department',
        
    })
}
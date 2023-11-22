import request from '@/utils/request'


/**
 * 封装获取权限列表接口
 * **/
export function getPermissionList(){
    return request({
        url:'/sys/permission',
    })
}

/**
 * 封装新增权限点接口
 * **/
export function addPermission(data){
    return request({
        url:'/sys/permission',
        method:"post",
        data
    })
}

/**
 * 封装获取权限点详情接口
 * **/
export function getPermissionDetail(id){
    return request({
        url:`/sys/permission/${id}`,
    })
}

/**
 * 封装一个更新权限编辑的接口
 * **/
export function updatePermission(data){
    return request({
        url:`/sys/permission/${data.id}`,
        method:'put',
        data
    })
}

/**
 * 封装删除权限点接口
 * **/
export function delPermission(id){
    return request({
        url:`/sys/permission/${id}`,
        method:"delete"
    })
}
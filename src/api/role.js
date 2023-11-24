import request from '@/utils/request'

/***
 * 获取角色列表
 * **/
export function getRoleList(params){
    return request({
        url:'/sys/role',
        params //查询参数,最终会拼到url地址后面

    })

}
/***
 * 封装新增角色接口
 * **/
export function addRoleList(data){
    return request({
        url:'/sys/role',
        method:'post',
        data
    })
}

/***
 * 封装一个更新角色的接口
 * **/
export function updateRole(data){
    return request({
        url:`/sys/role/${data.id}`,
        method:'put',
        data
    })
}

/***
 * 封装一个删除角色的api
 * **/
export function delRole(id){
    return request({
        url:`/sys/role/${id}`,
        method:'delete'
    })
}

/**
 * 封装一个获取角色详情的接口
 * **/
export function getRoleDetail(id){
    return request({
        url:`/sys/role/${id}`
    })
}

/**
 * 封装一个给角色分配权限接口
 * **/
export function assignPerm(data){
    return request({
        url:"/sys/role/assignPrem",
        method:"put",
        data
    })
}
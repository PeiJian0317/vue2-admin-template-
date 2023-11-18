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
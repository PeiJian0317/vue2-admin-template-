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

/**
 * 封装下载员工导入模板api
 * **/
export function getExportTemplate(){
    return request({
        url:'/sys/user/import/template',
        responseType:'blob' //二进制文件流
    })
}
/**
 * 封装一个上传用户excel的接口
 * **/
export function uploadExcel(data){
    return request({
        url:'/sys/user/import',
        method:'post',
        data //这里的data是form-data类型,因为要上传文件
    })
}

/**
 * 封装一个删除员工的接口
 * **/
export function delEmployee(id){
    return request({
        url:`/sys/user/${id}`,
        method:'delete'
    })
}
/**
 * 封装一个新增员工接口
 ***/
export function addEmployee(data){
    return request({
        url:'/sys/user',
        method:'post',
        data
    })
}

/**
 * 获取员工详情api
 * **/
export function getEmployeeDetail(id){
    return request({
        url:`/sys/user/${id}`
    })
}

/**
 * 更新员工详情接口
 * **/
export function updateEmployee(data){
    return request({
        url:`/sys/user/${data.id}`,
        method:"put",
        data
    })
}

/**
 * 获取可用的角色
 * **/
export function getEnableRoleList(){
    return request({
        url:'/sys/role/list/enabled'
    })
}

/**
 * 封装一个分配员工角色的接口
 * **/
export function assignRole(data){
    return request({
        url:'/sys/user/assignRoles',
        method:"put",
        data
    })
}
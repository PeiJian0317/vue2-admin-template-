import request from '@/utils/request'

//封装API
export function login(data){ //data是请求体参数,这里表示传入data
  //request就是axios,只不过进行了封装
  return request({
    url:'/sys/login',
    method:'post',
    data  
  })
}

//获取用户信息接口
export function getUserInfo(){
  return request({
    url:'/sys/profile',
    method:'get'
  })
}

//更改密码接口
export function updatePassword(data){
  return request({
    url:'/sys/user/updatePass',
    method:'put',
    data
  })
}
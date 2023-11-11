import request from '@/utils/request'

//封装API
export function login(data){
  //request就是axios,只不过进行了封装
  return request({
    url:'/sys/login',
    method:'post',
    data
  })
}
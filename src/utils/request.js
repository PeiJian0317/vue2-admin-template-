import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
//创建一个新的axios实例
const service = axios.create({
  baseURL:process.env.VUE_APP_BASE_API, //基础地址
  timeout: 10000
})

//请求拦截器
service.interceptors.request.use((config) =>{
  if(store.getters.token){
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
},(error) =>{
  //失败执行
  return Promise.reject(error)
})

//响应拦截器
service.interceptors.response.use((response) =>{
  const {data,message,success} = response.data
  if(success){
    return data
  }else{
    Message({ type:"error",message: message})
    //错误执行,由于里面没有错误对象,所以自己new一个
    return Promise.reject(new Error(message))
  }
},(error)=>{
  Message({ type:"error",message: error.message})
  return Promise.reject(error)
})


export default service
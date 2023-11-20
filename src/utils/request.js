import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
//创建一个新的axios实例
const service = axios.create({
  baseURL:process.env.VUE_APP_BASE_API, //基础地址
  timeout: 50000
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
  if(response.data instanceof Blob) return response.data //返回Blob对象
  const {data,message,success} = response.data //默认为json格式的
  //对接口文档的响应体进行分析,发现这三个是每个接口都有的,所以把他们解构
  //如果success为true就返回解构的data
  if(success){
    return data
  }else{
    Message({ type:"error",message: message})
    //错误执行,由于里面没有错误对象,所以自己new一个
    return Promise.reject(new Error(message))
  }
},async (error)=>{
  if(error.response.status === 401){
    //401表示token超时
    Message({ type:"error",message: 'token超时了'})
    await store.dispatch('user/logout') //调用action 退出登录
    //主动跳转到登录页面
    router.push('/login')
    return Promise.reject(error)
  }
  Message({ type:"error",message: error.message})
  return Promise.reject(error)
})


export default service
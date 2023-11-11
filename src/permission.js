import router from "./router";
import nprogress from "nprogress";
import 'nprogress/nprogress.css'
import store from '@/store'

//定义一个路由白名单
const whitelist = ['/login','/404']

//前置守卫
router.beforeEach((to,from,next) =>{
  nprogress.start()
  if(store.getters.token){
    //存在token
    if(to.path === "/login"){
      //跳转到主页
      next('/') //注意细节,如果next里有地址,那么不会执行后置守卫
      nprogress.done()
    }else{
      next() //放行
    }
  }else{
    //没有token
    if(whitelist.includes(to.path)){
      next()
    }else{
      next('/login')
      nprogress.done()
    }
  }
  
})



//后置守卫
router.afterEach((to,from,next) =>{
  nprogress.done()
})
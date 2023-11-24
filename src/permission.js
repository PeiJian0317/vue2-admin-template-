import router from "./router";
import nprogress from "nprogress";
import 'nprogress/nprogress.css'
import store from '@/store'
import { asyncRoutes } from '@/router'

//定义一个路由白名单
const whitelist = ['/login','/404']

//前置守卫
router.beforeEach(async (to,from,next) =>{
  nprogress.start()
  if(store.getters.token){
    //存在token
    if(to.path === "/login"){
      //跳转到主页
      next('/') //注意细节,如果next里有地址,那么不会执行后置守卫
      nprogress.done()
    }else{
      // 判断是否获取过资料
      if(!store.getters.userId){
       const { roles } = await store.dispatch('user/getUserInfo')
       const filterRoutes = asyncRoutes.filter((item) =>{
         return roles.menus.includes(item.name)
       })
       //给vuex的mutation传入动态路由
       store.commit('user/setRoutes',filterRoutes)
        //筛选后的路由
        router.addRoutes([...filterRoutes,  { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
        //动态路由添加后,Vue Router还没有完全初始化新添加的路由配置，导致导航问题 
        //使用to.path转发一下
      }else{
        next()
      }
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
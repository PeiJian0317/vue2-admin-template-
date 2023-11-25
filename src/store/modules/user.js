import {getToken,setToken,removeToken} from '@/utils/auth'
import { login,getUserInfo } from '@/api/user'
import { constantRoutes } from '@/router'
import { resetRouter } from '@/router'
const state = {
  token: getToken(), //从缓存中读取初始值
  userInfo:{}, //存储用户基本资料
  routes: constantRoutes //存储路由信息,默认为静态路由
}

const actions = {
  async login(context,data){ //data是this.loginform也就是username,password
    //调用登陆接口
    const token = await login(data)
    context.commit('setToken',token)

  },

  //获取用户基本资料
  async getUserInfo(context){
   const result = await getUserInfo()
   context.commit('setUserInfo',result)
   return result

  },
  //退出登录的action
  logout(context){
    context.commit("removeToken") //删除token
    context.commit('setUserInfo',{}) //设置用户信息为空
    resetRouter() //重置路由
  }
}

const mutations = {
  //登录时把token放入vuex的state和cookie缓存
  setToken(state,token){
    state.token = token
    //同步放到缓存中
    setToken(token)
  },
  //登出时清除Cookie
  removeToken(state){
    //清除缓存,state里的token也清空
    state.token = null
    removeToken()
  },
  //修改用户资料
  setUserInfo(state,userInfo){
    state.userInfo = userInfo
  },
  //修改路由信息为静态+动态
  setRoutes(state,newRoute){
    state.routes = [...constantRoutes,...newRoute]
  }
}

export default{
  namespaced: true,
  state,
  actions,
  mutations
}
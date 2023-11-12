import {getToken,setToken,removeToken} from '@/utils/auth'
import { login,getUserInfo } from '@/api/user'

const state = {
  token: getToken(), //从缓存中读取初始值
  userInfo:{} //存储用户基本资料
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
  },
  //退出登录的action
  logout(context){
    context.commit("removeToken")
    context.commit('setUserInfo',{})
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
  }
}

export default{
  namespaced: true,
  state,
  actions,
  mutations
}
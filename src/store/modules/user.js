import {getToken,setToken,removeToken} from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  token: getToken() //从缓存中读取初始值
}

const actions = {
  async login(context,data){ //data是this.loginform也就是username,password
    //调用登陆接口
    const token = await login(data)
    context.commit('setToken',token)

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
  removeToken(){
    //清除缓存,state里的token也清空
    state.token = null
    removeToken()
  }
}

export default{
  namespaced: true,
  state,
  actions,
  mutations
}
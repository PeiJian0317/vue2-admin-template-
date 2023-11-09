import {getToken,setToken,removeToken} from '@/utils/auth'

const state = {
  token: getToken() //从缓存中读取初始值
}

const actions = {
  login(context,data){
    context.commit('setToken',"66666")
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
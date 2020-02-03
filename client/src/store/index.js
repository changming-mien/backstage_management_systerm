import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const types={
  SET_AUTNENTIATED: 'SET_AUTNENTIATED', // 是否认证通过
  SET_USER: 'SET_USER' // 用户信息
}
const state={
  isAutnenticated: false,
  user:{}
}
const getters={
  isAutnenticated: state => state.isAutnenticated,
  user:state=>state.user
}
const mutations={
  [types.SET_AUTNENTIATED](state,isAutnenticated){
    if(isAutnenticated){
      state.isAutnenticated=isAutnenticated
    }else{
      state.isAutnenticated=false
    }
  },
  [types.SET_USER](state,user){
    if(user){
      state.user=user
    }else{
      state.user={}
    }
  }
}
const actions={
  setAutnenticated:({commit},isAutnenticated)=>{
    commit(types.SET_AUTNENTIATED,isAutnenticated)
  },
  setUser:({commit},user)=>{
    commit(types.SET_USER,user)
  },
  clearCurrentState:({commit})=>{
    commit(types.SET_AUTNENTIATED,false);
    commit(types.SET_USER,{})
  }
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

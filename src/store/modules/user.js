import { auth } from '@/api/user'
// import { auth } from 'qiniu'
import * as types from '../mutation-types'
const state = {
  // 定义 一个 管理员信息
  userInfo: {},
  // localStorage 存储用户信息的key名称，统一设置，方便后续使用
  // 通过 || 设定，如果localStorage没有数据，就返回null空数据，防止报错
  userToken: JSON.parse(window.localStorage.getItem('user') || 'null')
}
const mutations = {
  [types.SET_USER_INFO] (state, data) {
    state.userInfo = data
  },
  // 更新用户信息
  // data:{token:xx,refresh_token:xx}
  [types.SET_TOKEN] (state, data) {
    // 1. vuex做更新，使得有响应式
    state.userToken = data
    // 2. localStorage做持久更新
    window.localStorage.setItem('user', JSON.stringify(data))
  },
  // 清除用户信息
  [types.DEL_TOKEN] (state) {
    // 1. vuex做清除，使得有响应式
    state.userToken = null
    // 2. localStorage做持久清除
    window.localStorage.removeItem('user')
  }
}
const actions = {
  // 获取管理员信息
  async Auth ({ state, commit }, data) {
    const { data: res } = await auth(data)
    // 触发SET_USER_INFO方法
    commit('SET_USER_INFO', res.data)
    // 返回数据
  }
}
export default {
  // 开启命名空间
  namespaced: true,
  state,
  actions,
  mutations
}

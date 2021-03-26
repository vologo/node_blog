import user from '@/api/user'
// import { auth } from 'qiniu'
import * as types from '../mutation-types'
const state = {
  // 定义 一个 管理员验证
  adminAuth: null,
  // localStorage 存储用户信息的key名称，统一设置，方便后续使用
  // 通过 || 设定，如果localStorage没有数据，就返回null空数据，防止报错
  userToken: JSON.parse(window.localStorage.getItem('user') || 'null')
}
const mutations = {
  [types.SET_USER_INFO] (state, data) {
    state.adminAuth = data
  },
  // 更新用户信息
  // data:{token:xx,refresh_token:xx}
  updateUser (state, data) {
    // 1. vuex做更新，使得有响应式
    state.userToken = data
    // 2. localStorage做持久更新
    window.localStorage.setItem('user', JSON.stringify(data))
  },
  // 清除用户信息
  clearUser (state) {
    // 1. vuex做清除，使得有响应式
    state.userToken = null
    // 2. localStorage做持久清除
    window.localStorage.removeItem('user')
  }
}
const actions = {
  // 管理员登录
  login ({ commit, state }, data) {
    return user.login(data)
  },
  // 获取管理员信息
  async auth ({ state, commit }, data) {
    const { data: res } = await user.auth(data)
    // 触发SET_USER_INFO方法
    commit('SET_USER_INFO', res.data)
    // 返回数据
    return res
  }
}
export default {
  // 开启命名空间
  namespaced: true,
  state,
  actions,
  mutations
}

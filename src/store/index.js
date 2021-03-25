import Vue from 'vue'
import Vuex from 'vuex'
// 所有导出的方法都 赋值给types 对象
import * as types from './mutation-types'
import advertise from './modules/advertise'
import article from './modules/article'
import category from './modules/category'
import comment from './modules/comment'
import user from './modules/user'
Vue.use(Vuex)
// 定义变量
const state = {
  // 加载
  main_loading: false,
  // 图片模型
  picture_modal: {
    picture: null,
    modal: false
  }
}
const mutations = {
  /**
   * 修改loading状态
   * @param state
   * @param data
  */
  // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
  // 约等于SET_MAIN_LOADING(state,data){}
  // state 占位 代表 state,第二个为传值
  [types.SET_MAIN_LOADING] (state, data) {
    state.main_loading = data
  },
  // 图片显示
  [types.SET_PICTURE_MODAL] (state, data) {
    state.picture_modal = data
  }
}
const actions = {
  // 定义一个异步方法
  // 实践中，我们会经常用到 ES2015 的 参数解构 来简化代码（特别是我们需要调用 commit 很多次的时候）
  setMainLoading ({ commit }, data) {
    // 调用同步方法types.SET_MAIN_LOADING
    commit(types.SET_MAIN_LOADING, data)
  }
}
export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    advertise,
    article,
    category,
    comment,
    user
  }
})

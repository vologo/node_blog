import axios from 'axios'
// import store from '../vuex'
import { Message } from 'element-ui'
// import Vue from 'vue'
import router from '@/router'
import { Base64 } from 'js-base64'
// import { _encode } from './auth'
// const token = Vue.ls.get('token')
// const _encode = () =>
//   // vue-ls插件获取localSession
//   // base64编码码 添加Basic抬头
//   // 注意这里的Basic后面的空格，和冒号否则会报token错误
//   'Basic ' + Base64.encode(token + ':')
const request = axios.create({
  // 判断当前的运行环境
  // baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/v1' : 'https://www.boblog.com/api/v1',
  baseURL: process.env.VUE_APP_REQUEST_URL + process.env.VUE_APP_BASE_API,
  // 开启proxy代理后使用下列数据
  // baseURL: '/api/v1',
  // 服务器开启了cors就不要开这个
  // withCredentials: true,
  timeout: 100000
})
// X-Requested-With: XMLHttpRequest 只是用于"标识"是异步的
// 但是不是真的异步，与它没有一点关系，只是一个"标识"
// 意思是：不加这个头，浏览器的请求也可以是异步的；加了这个头，也可以是同步的
// 只是为了通知 服务器，这个请求是异步的，是给服务器用的
// 即使它是一个同步的请求，你只要加上了这个，就会"伪装"成异步，服务器就会理解为异步
request.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest'
}
request.interceptors.request.use(config => {
  // 任何所有请求会经过这里
  // config 是当前请求相关的配置信息对象
  // config 是可以修改的
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (user) {
    const token = Base64.encode(user + ':')
    config.headers.Authorization = 'Basic ' + token
  }
  // 获取本地的token信息
  // const userToken = JSON.parse(window.localStorage.getItem('user'))
  // 用vuex存储token还没实现
  // 如果有登录用户信息，则统一设置 token
  // 必须返回config 否则请求发不出去，死循环
  return config
}, error => Promise.reject(error) // 请求失败，会经过这里
)
// 响应拦截器
request.interceptors.response.use(response =>
// 所有响应码为 2xx 的响应都会进入这里
  // response 是响应处理
  // 注意：一定要把响应结果 return，否则真正发请求的位置拿不到数据
  response
,
error => {
  // let {response = {}} = error 越等于先response = {}，再解构
  // 解构出返回的数据
  const { response = {}} = error
  console.log(response)
  // 400：请求出现错误，比如请求头不对等,账号不对等等
  if (response.status === 400) {
    Message.error(response.data.msg.join(','))
    // 401：没有提供认证信息。请求的时候没有带上 Token 等
  } else if (response.status === 401) {
    // 鉴权失败，自动清除token
    // 清除本地存储中的用户登录状态
    // Vue.ls.remove('token')
    window.localStorage.removeItem('user')
    // 跳转到登录页面
    Message.error(response.data.msg)
    // 避免router跳转到原位置
    if (response.data.error_code !== 10004) { router.replace('/login') }
    // 403：请求的资源不允许访问。就是说没有权限。
  } else if (response.status === 403) {
    // Vue.ls.remove('token')
    window.localStorage.removeItem('user')
    Message.error(`没有操作权限, ${response.data.msg}`)
    router.replace('/login')
    // 500：服务器错误。
  } else if (response.status >= 500) {
    Message.error(`服务器内部异常，请稍候重试, ${response.data.msg}`)
  } else {
    Message.error(response.data.msg)
  }
  return Promise.reject(error)
})
export default request

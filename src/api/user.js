import request from '@/utils/request'
// 用户登录
export const login = data => request({
  // 请求方法
  method: 'POST',
  // 请求路径
  url: '/admin/login',
  // data 用来设置 POST 请求体
  data
})
// 登录接口
export const register = data => request({
  method: 'POST',
  url: '/admin/register',
  data
})
// 验证管理员token
export const auth = params => request({
  method: 'GET',
  url: '/admin/auth',
  params
})

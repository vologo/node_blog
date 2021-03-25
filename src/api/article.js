import request from '../utils/request'
// 获取所有的文章
export const getArticle = params => request({
  method: 'GET',
  url: '/article',
  // Body 参数使用 data 设置
  // Query 参数使用 params 设置
  // Headers 参数使用 headers 设置
  params
})
// 创建文章
export const createArticle = data => request({
  method: 'POST',
  url: '/article',
  data
})
// 获取单篇文章详情
export const getSingleArticle = id => request({
  method: 'GET',
  // 接口文档中的写的路径参数需要在 url 中传递
  // 凡是看见接口路径中有的 :xxx 格式的字段，则需要传递路径参数
  url: `/article/${id}`
})
// 更新单篇文章
export const setSingleArticle = data => request({
  method: 'PUT',
  url: `/article/${data.id}`,
  data
})
// 删除单篇文章
export const deleteArticle = id => request({
  method: 'DELETE',
  url: `/article/${id}`
})
// 搜索文章
export const queryArticle = params => request({
  method: 'GET',
  url: '/search/article',
  params
})
export const getQnToken = () => request({
  method: 'GET',
  url: '/getQnToken'
})

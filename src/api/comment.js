import request from '@/utils/request'
// 创建评论
export const createComment = data => request({
  method: 'POST',
  url: '/comment',
  data
})
// 获取单个评论详情
export const getSingleComment = id => request({
  method: 'GET',
  url: `/comment/${id}`
})
// 获取所有的评论
export const getComment = params => request({
  method: 'GET',
  url: '/comment',
  params
})
// 更新单个评论
export const setSingleComment = (data, id) => request({
  method: 'PUT',
  url: `/comment/${id}`,
  data
})
// 删除单片评论
export const deleteComment = id => request({
  method: 'DELETE',
  url: `/comment/${id}`
})
// 创建回复评论
export const createReply = data => request({
  method: 'POST',
  url: '/reply',
  data
})
// 获取单个回复的详情
export const getSingleReply = id => request({
  method: 'GET',
  url: `/reply/${id}`
})
// 回复列表
export const getReply = params => request({
  method: 'GET',
  url: '/reply',
  params
})
// 更新单个回复
export const setSingleReply = (data, id) => request({
  method: 'PUT',
  url: `/reply/${id}`,
  data
})
// 删除单个回复
export const deleteReply = id => request({
  method: 'DELETE',
  url: `/reply/${id}`
})

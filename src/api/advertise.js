import request from '../utils/request'
// 创建广告（友情链接）
export const createAdvertise = data => request({
  method: 'POST',
  url: '/advertise',
  data
})
// 获取单个广告详情
export const getSingleAdvertise = id => request({
  method: 'GET',
  url: `/advertise/${id}`
})
// 获取所有广告
export const getAdvertise = params => request({
  method: 'GET',
  url: '/advertise',
  params
})
// 更新单个广告
export const setSingleAdvertise = data => request({
  method: 'PUT',
  url: `/advertise/${data.id}`,
  data
})
// 删除单篇广告
export const deleteAdvertise = id => request({
  method: 'DELETE',
  url: `/advertise/${id}`
})

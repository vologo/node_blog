import request from '../utils/request'
// 获取所有分类列表
export const getCategory = () => request({
  method: 'GET',
  url: '/category'
})
// 新增分类
export const createCategory = data => request({
  method: 'POST',
  url: '/category',
  data
})
// 删除单个分类
export const deleteCategory = id => request({
  method: 'DELETE',
  url: `/category/${id}`
})
// 获取单个分类信息
export const getSingleCategory = id => request({
  method: 'GET',
  url: `/category/${id}`
})
// 更新单个分类信息
export const setSingleCategory = (data, id) => request({
  method: 'PUT',
  url: `/category/${id}`,
  data
})

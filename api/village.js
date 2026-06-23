import request from '@/utils/request'

// 获取公告列表
export function getNoticeList(params) {
  return request({
    url: '/api/village/notice/list',
    method: 'GET',
    data: params
  })
}

// 获取公告详情
export function getNoticeDetail(id) {
  return request({
    url: `/api/village/notice/detail/${id}`,
    method: 'GET'
  })
}

// 获取便民办事分类
export function getServiceCategories() {
  return request({
    url: '/api/village/service/categories',
    method: 'GET'
  })
}

// 获取办事事项列表
export function getServiceList(params) {
  return request({
    url: '/api/village/service/list',
    method: 'GET',
    data: params
  })
}

// 获取办事指南
export function getServiceGuide(id) {
  return request({
    url: `/api/village/service/guide/${id}`,
    method: 'GET'
  })
}

// 提交办事申请
export function submitServiceApplication(data) {
  return request({
    url: '/api/village/service/apply',
    method: 'POST',
    data
  })
}

// 获取我的办事记录
export function getMyApplications(params) {
  return request({
    url: '/api/village/service/my',
    method: 'GET',
    data: params
  })
}

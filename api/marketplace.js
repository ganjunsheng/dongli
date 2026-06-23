import request from '@/utils/request'

// 获取闲置列表
export function getMarketList(params) {
  return request({
    url: '/api/marketplace/list',
    method: 'GET',
    data: params
  })
}

// 获取闲置详情
export function getMarketDetail(id) {
  return request({
    url: `/api/marketplace/detail/${id}`,
    method: 'GET'
  })
}

// 发布闲置
export function publishMarket(data) {
  return request({
    url: '/api/marketplace/publish',
    method: 'POST',
    data
  })
}

// 更新闲置
export function updateMarket(id, data) {
  return request({
    url: `/api/marketplace/update/${id}`,
    method: 'PUT',
    data
  })
}

// 删除闲置
export function deleteMarket(id) {
  return request({
    url: `/api/marketplace/delete/${id}`,
    method: 'DELETE'
  })
}

// 获取我的发布
export function getMyPublish(params) {
  return request({
    url: '/api/marketplace/my',
    method: 'GET',
    data: params
  })
}

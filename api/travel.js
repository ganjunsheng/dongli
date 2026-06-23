import request from '@/utils/request'

// 获取景点列表
export function getSpotList(params) {
  return request({
    url: '/api/travel/spot/list',
    method: 'GET',
    data: params
  })
}

// 获取景点详情
export function getSpotDetail(id) {
  return request({
    url: `/api/travel/spot/detail/${id}`,
    method: 'GET'
  })
}

// 获取农家乐/民宿列表
export function getHotelList(params) {
  return request({
    url: '/api/travel/hotel/list',
    method: 'GET',
    data: params
  })
}

// 获取农家乐详情
export function getHotelDetail(id) {
  return request({
    url: `/api/travel/hotel/detail/${id}`,
    method: 'GET'
  })
}

// 预订民宿
export function bookHotel(data) {
  return request({
    url: '/api/travel/hotel/book',
    method: 'POST',
    data
  })
}

// 获取旅游攻略列表
export function getGuideList(params) {
  return request({
    url: '/api/travel/guide/list',
    method: 'GET',
    data: params
  })
}

// 获取攻略详情
export function getGuideDetail(id) {
  return request({
    url: `/api/travel/guide/detail/${id}`,
    method: 'GET'
  })
}

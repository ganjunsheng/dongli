import request from '@/utils/request'

// 获取商品列表
export function getProductList(params) {
  return request({
    url: '/api/mall/product/list',
    method: 'GET',
    data: params
  })
}

// 获取商品详情
export function getProductDetail(id) {
  return request({
    url: `/api/mall/product/detail/${id}`,
    method: 'GET'
  })
}

// 获取商品分类
export function getCategories() {
  return request({
    url: '/api/mall/category/list',
    method: 'GET'
  })
}

// 搜索商品
export function searchProducts(params) {
  return request({
    url: '/api/mall/product/search',
    method: 'GET',
    data: params
  })
}

// 加入购物车
export function addToCart(data) {
  return request({
    url: '/api/mall/cart/add',
    method: 'POST',
    data
  })
}

// 获取购物车列表
export function getCartList() {
  return request({
    url: '/api/mall/cart/list',
    method: 'GET'
  })
}

// 更新购物车数量
export function updateCartQuantity(id, quantity) {
  return request({
    url: `/api/mall/cart/update/${id}`,
    method: 'PUT',
    data: { quantity }
  })
}

// 删除购物车商品
export function deleteCartItem(id) {
  return request({
    url: `/api/mall/cart/delete/${id}`,
    method: 'DELETE'
  })
}

// 创建订单
export function createOrder(data) {
  return request({
    url: '/api/mall/order/create',
    method: 'POST',
    data
  })
}

// 获取订单列表
export function getOrderList(params) {
  return request({
    url: '/api/mall/order/list',
    method: 'GET',
    data: params
  })
}

// 获取订单详情
export function getOrderDetail(id) {
  return request({
    url: `/api/mall/order/detail/${id}`,
    method: 'GET'
  })
}

// 取消订单
export function cancelOrder(id) {
  return request({
    url: `/api/mall/order/cancel/${id}`,
    method: 'PUT'
  })
}

// 支付订单
export function payOrder(id, payType) {
  return request({
    url: '/api/mall/order/pay',
    method: 'POST',
    data: { id, payType }
  })
}

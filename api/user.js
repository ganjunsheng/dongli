import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'POST',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/user/info',
    method: 'GET'
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/api/user/update',
    method: 'PUT',
    data
  })
}

// 上传头像
export function uploadAvatar(filePath) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    uni.uploadFile({
      url: 'https://api.example.com/api/upload/avatar',
      filePath: filePath,
      name: 'file',
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        if (data.code === 0) {
          resolve(data)
        } else {
          reject(data)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 获取收货地址列表
export function getAddressList() {
  return request({
    url: '/api/user/address/list',
    method: 'GET'
  })
}

// 添加收货地址
export function addAddress(data) {
  return request({
    url: '/api/user/address/add',
    method: 'POST',
    data
  })
}

// 更新收货地址
export function updateAddress(id, data) {
  return request({
    url: `/api/user/address/update/${id}`,
    method: 'PUT',
    data
  })
}

// 删除收货地址
export function deleteAddress(id) {
  return request({
    url: `/api/user/address/delete/${id}`,
    method: 'DELETE'
  })
}

// 获取我的发布
export function getMyPublish(params) {
  return request({
    url: '/api/user/publish',
    method: 'GET',
    data: params
  })
}

// 获取我的办事记录
export function getMyServices(params) {
  return request({
    url: '/api/user/services',
    method: 'GET',
    data: params
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'POST'
  })
}

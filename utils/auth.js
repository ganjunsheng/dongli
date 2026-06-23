import request from './request'

// 登录
export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'POST',
    data
  })
}

// 获取手机号（微信登录）
export function getPhoneNumber(code) {
  return request({
    url: '/api/user/phone',
    method: 'POST',
    data: { code }
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

// 检查登录状态
export function checkLogin() {
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.navigateTo({ url: '/pages/user/login' })
    return false
  }
  return true
}

// 退出登录
export function logout() {
  uni.removeStorageSync('token')
  uni.removeStorageSync('userInfo')
  uni.reLaunch({ url: '/pages/index/index' })
}

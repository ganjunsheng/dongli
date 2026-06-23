// 统一网络请求封装
const BASE_URL = 'http://localhost:3001' // Node.js 后端地址

// 请求拦截器
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 0 || res.data.code === 200) {
            resolve(res.data)
          } else {
            uni.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            })
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          // token过期，重新登录
          uni.removeStorageSync('token')
          uni.reLaunch({
            url: '/pages/user/login'
          })
          reject(new Error('登录已过期'))
        } else {
          uni.showToast({
            title: '网络错误',
            icon: 'none'
          })
          reject(res)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

// GET 请求
export const get = (url, data) => {
  return request({
    url,
    method: 'GET',
    data
  })
}

// POST 请求
export const post = (url, data) => {
  return request({
    url,
    method: 'POST',
    data
  })
}

// PUT 请求
export const put = (url, data) => {
  return request({
    url,
    method: 'PUT',
    data
  })
}

// DELETE 请求
export const del = (url, data) => {
  return request({
    url,
    method: 'DELETE',
    data
  })
}

export default request

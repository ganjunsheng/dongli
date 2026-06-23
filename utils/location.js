/**
 * 定位工具 - 基于 uni-app 原生定位 API
 * 微信小程序已在 manifest.json 配置 scope.userLocation 权限
 */

// 存储 key
const LOCATION_KEY = 'user_location_info'

/**
 * 获取当前位置坐标
 * @returns {Promise<{latitude:number, longitude:number}>}
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02', // 国测局坐标系，适配腾讯地图
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail: (err) => {
        // 用户拒绝授权
        if (err.errMsg.includes('auth deny')) {
          uni.showModal({
            title: '需要定位权限',
            content: '获取位置信息可为您推荐附近村庄和服务，请在设置中开启定位权限',
            confirmText: '去设置',
            success: (modalRes) => {
              if (modalRes.confirm) {
                uni.openSetting()
              }
            }
          })
        }
        reject(err)
      }
    })
  })
}

/**
 * 反向地理编码 - 通过坐标获取地址
 * 优先尝试 Nominatim（国外可用），3 秒超时后本地兜底
 * 生产环境建议配置腾讯地图 key 替换：
 *   https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=YOUR_KEY
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{village:string, address:string}>}
 */
export function reverseGeocode(latitude, longitude) {
  return new Promise((resolve) => {
    let settled = false

    // 3 秒超时兜底
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true
        resolve({ village: '附近', address: '附近' })
      }
    }, 3000)

    uni.request({
      url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1&accept-language=zh`,
      timeout: 3000,
      header: { 'User-Agent': 'DongLiVillageApp/1.0' },
      success: (res) => {
        if (settled) return
        settled = true
        clearTimeout(timer)

        if (res.statusCode === 200 && res.data) {
          const addr = res.data.address || {}
          const village = addr.village || addr.town || addr.city_district || addr.township || addr.county || addr.city || ''
          const district = addr.county || addr.city_district || addr.city || ''
          resolve({
            village: village || district || '附近',
            address: district || village || '附近'
          })
        } else {
          resolve({ village: '附近', address: '附近' })
        }
      },
      fail: () => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        resolve({ village: '附近', address: '附近' })
      }
    })
  })
}

/**
 * 获取位置信息（含缓存）
 * 优先取缓存，缓存不存在时重新定位
 * @returns {Promise<{latitude:number, longitude:number, village:string, address:string}>}
 */
export async function getLocationInfo() {
  // 尝试从缓存读取
  const cached = uni.getStorageSync(LOCATION_KEY)
  if (cached && cached.village) {
    return cached
  }

  try {
    const coords = await getCurrentLocation()
    const geoInfo = await reverseGeocode(coords.latitude, coords.longitude)
    const info = { ...coords, ...geoInfo }
    // 缓存（即使反编码失败也缓存坐标，避免反复定位）
    uni.setStorageSync(LOCATION_KEY, info)
    return info
  } catch (e) {
    console.error('定位失败', e)
    return {
      latitude: 0,
      longitude: 0,
      village: '选择村庄',
      address: ''
    }
  }
}

/**
 * 打开地图选择位置
 * @returns {Promise<{latitude:number, longitude:number, name:string, address:string}>}
 */
export function chooseLocation() {
  return new Promise((resolve, reject) => {
    uni.chooseLocation({
      success: (res) => {
        const info = {
          latitude: res.latitude,
          longitude: res.longitude,
          village: res.name || '已选位置',
          address: res.address || res.name || ''
        }
        // 更新缓存
        uni.setStorageSync(LOCATION_KEY, info)
        resolve(info)
      },
      fail: (err) => {
        if (!err.errMsg.includes('cancel')) {
          uni.showToast({ title: '选择位置失败', icon: 'none' })
        }
        reject(err)
      }
    })
  })
}

/**
 * 清除位置缓存
 */
export function clearLocationCache() {
  uni.removeStorageSync(LOCATION_KEY)
}

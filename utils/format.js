// 日期格式化
export function formatDate(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  date = new Date(date)
  
  const map = {
    'YYYY': date.getFullYear(),
    'MM': String(date.getMonth() + 1).padStart(2, '0'),
    'DD': String(date.getDate()).padStart(2, '0'),
    'HH': String(date.getHours()).padStart(2, '0'),
    'mm': String(date.getMinutes()).padStart(2, '0'),
    'ss': String(date.getSeconds()).padStart(2, '0')
  }
  
  let result = fmt
  Object.keys(map).forEach(key => {
    result = result.replace(key, map[key])
  })
  
  return result
}

// 相对时间（多久前）
export function relativeTime(date) {
  if (!date) return ''
  const now = new Date().getTime()
  const target = new Date(date).getTime()
  const diff = now - target
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return formatDate(date, 'YYYY-MM-DD')
  }
}

// 价格格式化（分转元）
export function formatPrice(price) {
  if (price === undefined || price === null) return '0.00'
  return (price / 100).toFixed(2)
}

// 手机号脱敏
export function maskPhone(phone) {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 手机号验证
export function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

// 字数截断
export function truncate(text, maxLen = 50) {
  if (!text) return ''
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
}

// 数字格式化（过万显示x.x万）
export function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return String(num)
}

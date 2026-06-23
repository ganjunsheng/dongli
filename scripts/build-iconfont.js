const fs = require('fs')
const path = require('path')

// 读取 woff2 字体并转为 base64
const b64 = fs.readFileSync(
  path.join(__dirname, '..', 'static', 'iconfont', 'iconfont.woff2')
).toString('base64')

// iconfont 原始类名映射表（从 iconfont.css 提取）
const iconMap = {
  'iconhealth': '\\e638',
  'icon_home': '\\e696',
  'icon_more': '\\e69f',
  'icon_search': '\\e6aa',
  'icon_about': '\\e682',
  'icon-add': '\\e602',
  'icon_arrow_right': '\\e6f6',
  'icon_bell': '\\e6f7',
  'icon_address': '\\e640',
  'icon_job': '\\e60a',
  'icon_notice': '\\e673',
  'icon_market': '\\e661',
  'icon-service': '\\e6e1',
  'icon-share': '\\e680',
  'icon_settings': '\\e6a9',
  'icon-store': '\\e609',
  'os-icon-back': '\\e60f',
  'icon-publish': '\\e794',
  'icon-cart-shopping-trolley': '\\e66a',
  'icon-orders': '\\e698',
  'icon_location': '\\e626',
  'icon_travel': '\\e603',
}

// 项目代码别名 → iconfont 原始类名
const aliases = {
  'icon-location': 'icon_location',
  'icon-search': 'icon_search',
  'icon-bell': 'icon_bell',
  'icon-arrow-right': 'icon_arrow_right',
  'icon-add': 'icon-add',
  'icon-share': 'icon-share',
  'icon-home': 'icon_home',
  'icon-cart': 'icon-cart-shopping-trolley',
  'icon-back': 'os-icon-back',
  'icon-notice': 'icon_notice',
  'icon-service': 'icon-service',
  'icon-shop': 'icon-store',
  'icon-travel': 'icon_travel',
  'icon-market': 'icon_market',
  'icon-job': 'icon_job',
  'icon-health': 'iconhealth',
  'icon-more': 'icon_more',
  'icon-publish': 'icon-publish',
  'icon-order': 'icon-orders',
  'icon-address': 'icon_address',
  'icon-settings': 'icon_settings',
  'icon-about': 'icon_about',
}

const lines = []

lines.push('/* ========== 东篱 · IconFont 图标库 ========== */')
lines.push('/* 项目ID: 5199573 | 基于 iconfont.cn | 内嵌 base64 字体 */')
lines.push('')
lines.push('@font-face {')
lines.push("  font-family: 'iconfont';")
lines.push(`  src: url('data:font/woff2;base64,${b64}') format('woff2');`)
lines.push('  font-weight: normal;')
lines.push('  font-style: normal;')
lines.push('  font-display: block;')
lines.push('}')
lines.push('')
lines.push('.iconfont {')
lines.push("  font-family: 'iconfont' !important;")
lines.push('  font-size: 32rpx;')
lines.push('  font-style: normal;')
lines.push('  -webkit-font-smoothing: antialiased;')
lines.push('  -moz-osx-font-smoothing: grayscale;')
lines.push('}')
lines.push('')

// 原始 iconfont 类名
lines.push('/* ===== 原始图标类 ===== */')
for (const [name, code] of Object.entries(iconMap)) {
  lines.push(`.icon-${name}:before { content: "${code}"; }`)
}
lines.push('')

// 项目别名
lines.push('/* ===== 项目快捷别名 ===== */')
for (const [alias, target] of Object.entries(aliases)) {
  const code = iconMap[target]
  if (code) {
    lines.push(`.${alias}:before { content: "${code}"; }`)
  }
}

const output = lines.join('\n')
fs.writeFileSync(
  path.join(__dirname, '..', 'styles', 'iconfont.scss'),
  output
)
console.log(`✅ iconfont.scss 已生成 (${(output.length / 1024).toFixed(1)} KB)`)

export default {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 750,        // 设计稿宽度（750rpx = 100vw）
      unitPrecision: 3,           // 转换后保留小数位
      viewportUnit: 'vw',         // 转换成的单位
      selectorBlackList: ['.ignore', '.hairline'], // 不转换的类名
      minPixelValue: 1,           // 最小转换值
      mediaQuery: false,           // 不转换媒体查询中的 px
      exclude: [/node_modules\/(?!@dcloudio)/],  // 排除 node_modules
    }
  }
}

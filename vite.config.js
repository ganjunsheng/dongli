import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],

  // 开发服务器配置
  server: {
    host: '0.0.0.0',
    port: 3000
  },

  // 生产构建优化
  build: {
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // chunk 大小警告阈值
    chunkSizeWarningLimit: 500,
    // 使用 terser 压缩，移除 console 和 debugger
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})

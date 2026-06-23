import { createSSRApp } from 'vue'
import App from './App.vue'

// 引入全局样式
import './styles/common.scss'

export function createApp() {
  const app = createSSRApp(App)
  
  // 全局属性/插件注册处
  // app.config.globalProperties.$xxx = xxx
  
  return {
    app
  }
}

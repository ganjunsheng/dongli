<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
  checkUpdate()
  getSystemInfo()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})

// 检查小程序更新
function checkUpdate() {
  if (uni.canIUse('getUpdateManager')) {
    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(() => {
          uni.showToast({ title: '更新失败', icon: 'none' })
        })
      }
    })
  }
}

// 获取系统信息
function getSystemInfo() {
  const systemInfo = uni.getSystemInfoSync()
  // 存储到本地，供页面使用
  uni.setStorageSync('systemInfo', systemInfo)
}
</script>

<template>
  <router-view />
</template>

<style lang="scss">
/* 引入全局样式变量 */
@import './uni.scss';

page {
  background-color: $bg-page;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 30rpx;
  color: $text-primary;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

/* 安全区域适配 */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* 清除按钮默认样式 */
button::after {
  border: none;
}

button {
  padding: 0;
  margin: 0;
  background: transparent;
  line-height: inherit;
}
</style>

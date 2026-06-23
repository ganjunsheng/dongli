<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 设置项
const settings = ref([
  {
    group: '通用设置',
    items: [
      { title: '消息通知', desc: '接收消息通知', type: 'switch', key: 'notify', value: true },
      { title: '声音提醒', desc: '收到消息播放提示音', type: 'switch', key: 'sound', value: true },
      { title: '振动提醒', desc: '收到消息振动提醒', type: 'switch', key: 'vibrate', value: false }
    ]
  },
  {
    group: '隐私设置',
    items: [
      { title: '个性化推荐', desc: '根据您的喜好推荐内容', type: 'switch', key: 'recommend', value: true },
      { title: '匿名发布', desc: '发布内容不显示昵称', type: 'switch', key: 'anonymous', value: false }
    ]
  },
  {
    group: '关于我们',
    items: [
      { title: '当前版本', desc: 'v1.0.0', type: 'text' },
      { title: '检查更新', desc: '', type: 'arrow', action: 'checkUpdate' },
      { title: '用户协议', desc: '', type: 'arrow', action: 'viewUserAgreement' },
      { title: '隐私政策', desc: '', type: 'arrow', action: 'viewPrivacyPolicy' }
    ]
  }
])

// 切换开关
function switchChange(key, value) {
  const item = findSettingItem(key)
  if (item) {
    item.value = value
    // 保存到本地
    uni.setStorageSync(`setting_${key}`, value)
  }
}

// 查找设置项
function findSettingItem(key) {
  for (const group of settings.value) {
    for (const item of group.items) {
      if (item.key === key) {
        return item
      }
    }
  }
  return null
}

// 处理点击
function handleItemClick(item) {
  if (item.action === 'checkUpdate') {
    checkUpdate()
  } else if (item.action === 'viewUserAgreement') {
    viewAgreement('user')
  } else if (item.action === 'viewPrivacyPolicy') {
    viewAgreement('privacy')
  }
}

// 检查更新
function checkUpdate() {
  if (uni.canIUse('getUpdateManager')) {
    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        uni.showToast({ title: '发现新版本', icon: 'none' })
      } else {
        uni.showToast({ title: '已是最新版本', icon: 'none' })
      }
    })
  } else {
    uni.showToast({ title: '当前环境不支持', icon: 'none' })
  }
}

// 查看协议
function viewAgreement(type) {
  uni.navigateTo({ url: `/pages/user/agreement?type=${type}` })
}

// 清除缓存
function clearCache() {
  uni.showModal({
    title: '提示',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        uni.showToast({ title: '清除成功', icon: 'success' })
      }
    }
  })
}

// 初始化加载设置
function loadSettings() {
  for (const group of settings.value) {
    for (const item of group.items) {
      if (item.key) {
        const saved = uni.getStorageSync(`setting_${item.key}`)
        if (saved !== '') {
          item.value = saved
        }
      }
    }
  }
}

onLoad(() => {
  loadSettings()
})
</script>

<template>
  <view class="page-settings">
    <!-- 设置列表 -->
    <view class="settings-group" v-for="(group, gIndex) in settings" :key="gIndex">
      <text class="group-title">{{ group.group }}</text>
      <view class="settings-list">
        <view class="settings-item" v-for="(item, index) in group.items" :key="item.title"
          @click="item.type === 'arrow' ? handleItemClick(item) : null">
          <view class="item-left">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-desc" v-if="item.desc">{{ item.desc }}</text>
          </view>
          <view class="item-right">
            <!-- 开关 -->
            <switch v-if="item.type === 'switch'" 
              :checked="item.value" 
              @change="switchChange(item.key, $event.detail.value)"
              color="#2E7D32"
            />
            <!-- 箭头 -->
            <text v-else-if="item.type === 'arrow'" class="item-arrow">></text>
            <!-- 文字 -->
            <text v-else class="item-value">{{ item.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 清除缓存 -->
    <view class="settings-group">
      <view class="settings-list">
        <view class="settings-item" @click="clearCache">
          <text class="item-title">清除缓存</text>
          <text class="item-arrow">></text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <button class="logout-btn" @click="logout">退出登录</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-settings {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

/* 设置分组 */
.settings-group {
  margin-bottom: 20rpx;
  
  .group-title {
    display: block;
    font-size: 26rpx;
    color: $text-hint;
    padding: 20rpx 32rpx 8rpx;
  }
}

/* 设置列表 */
.settings-list {
  background: #fff;
  
  .settings-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 32rpx;
    border-bottom: 1rpx solid $border-light;
    
    &:last-child {
      border-bottom: none;
    }
    
    .item-left {
      flex: 1;
      
      .item-title {
        font-size: 30rpx;
        color: $text-primary;
        display: block;
      }
      
      .item-desc {
        font-size: 24rpx;
        color: $text-hint;
        margin-top: 4rpx;
        display: block;
      }
    }
    
    .item-right {
      flex-shrink: 0;
      margin-left: 16rpx;
      
      .item-arrow {
        font-size: 28rpx;
        color: $text-hint;
      }
      
      .item-value {
        font-size: 28rpx;
        color: $text-hint;
      }
    }
  }
}

/* 退出登录 */
.logout-section {
  padding: 40rpx 32rpx;
  
  .logout-btn {
    height: 88rpx;
    line-height: 88rpx;
    background: #fff;
    color: $aux-red;
    font-size: 30rpx;
    border-radius: 16rpx;
    border: none;
  }
}
</style>

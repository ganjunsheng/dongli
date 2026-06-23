<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getOrderList } from '@/api/mall'

// 用户信息
const userInfo = ref({
  avatar: '/static/images/default/avatar.png',
  nickname: '游客',
  phone: '',
  isLogin: false
})

// 订单状态数量
const orderCounts = ref({
  unpaid: 0,
  unshipped: 0,
  unreceived: 0,
  refund: 0
})

// 功能列表
const funcGroups = ref([
  [
    { icon: 'publish', title: '我的发布', url: '/pages/user/publish' },
    { icon: 'order', title: '我的办事', url: '/pages/village/service' },
    { icon: 'address', title: '收货地址', url: '/pages/user/address' },
    { icon: 'notice', title: '消息通知', url: '/pages/user/notice' }
  ],
  [
    { icon: 'settings', title: '设置', url: '/pages/user/settings' },
    { icon: 'about', title: '关于我们', url: '/pages/user/about' },
    { icon: 'service', title: '联系客服', url: '', action: 'callService' }
  ]
])

// 检查登录状态
function checkLogin() {
  const token = uni.getStorageSync('token')
  const storedUser = uni.getStorageSync('userInfo')
  
  if (token && storedUser) {
    userInfo.value = { ...storedUser, isLogin: true }
    loadOrderCounts()
  }
}

// 加载订单数量
async function loadOrderCounts() {
  try {
    const res = await getOrderList({ page: 1, size: 100 })
    const list = res.data && res.data.list ? res.data.list : (Array.isArray(res.data) ? res.data : [])
    orderCounts.value = {
      unpaid: list.filter(o => o.status === '待支付').length,
      unshipped: list.filter(o => o.status === '已支付').length,
      unreceived: list.filter(o => o.status === '已发货').length,
      refund: list.filter(o => ['退款中', '已取消'].includes(o.status)).length
    }
  } catch (e) {
    // 静默失败，保持旧值
  }
}

// 去登录
function goLogin() {
  uni.navigateTo({ url: '/pages/user/login' })
}

// 编辑资料
function goEditProfile() {
  if (!userInfo.value.isLogin) {
    goLogin()
    return
  }
  uni.navigateTo({ url: '/pages/user/profile' })
}

// 查看订单
function goOrders(type) {
  if (!userInfo.value.isLogin) {
    goLogin()
    return
  }
  uni.navigateTo({ url: `/pages/order/list?type=${type}` })
}

// 跳转页面
function goPage(url) {
  if (!url) return
  uni.navigateTo({ url })
}

// 联系客服
function callService() {
  uni.makePhoneCall({ phoneNumber: '400-123-4567' })
}

// 退出登录
function logout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success(res) {
      if (res.confirm) {
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
        userInfo.value.isLogin = false
        userInfo.value.nickname = '游客'
        userInfo.value.phone = ''
      }
    }
  })
}

onShow(() => {
  checkLogin()
})
</script>

<template>
  <view class="page-user">
    <!-- 用户信息区 -->
    <view class="user-header">
      <view class="user-info" @click="userInfo.isLogin ? goEditProfile() : goLogin()">
        <image class="user-avatar" :src="userInfo.avatar" mode="aspectFill" />
        <view class="user-detail">
          <text class="user-name">{{ userInfo.nickname }}</text>
          <text class="user-phone" v-if="userInfo.phone">{{ userInfo.phone }}</text>
          <text class="user-hint" v-else>点击登录</text>
        </view>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>

    <!-- 我的订单 -->
    <view class="order-section">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <text class="section-more" @click="goOrders('all')">全部订单 →</text>
      </view>
      <view class="order-tabs">
        <view class="order-tab" @click="goOrders('unpaid')">
          <view class="order-icon">💰</view>
          <text class="order-label">待付款</text>
          <text class="order-badge" v-if="orderCounts.unpaid">{{ orderCounts.unpaid }}</text>
        </view>
        <view class="order-tab" @click="goOrders('unshipped')">
          <view class="order-icon">📦</view>
          <text class="order-label">待发货</text>
          <text class="order-badge" v-if="orderCounts.unshipped">{{ orderCounts.unshipped }}</text>
        </view>
        <view class="order-tab" @click="goOrders('unreceived')">
          <view class="order-icon">🚚</view>
          <text class="order-label">待收货</text>
          <text class="order-badge" v-if="orderCounts.unreceived">{{ orderCounts.unreceived }}</text>
        </view>
        <view class="order-tab" @click="goOrders('refund')">
          <view class="order-icon">🔄</view>
          <text class="order-label">退款</text>
          <text class="order-badge" v-if="orderCounts.refund">{{ orderCounts.refund }}</text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="func-section" v-for="(group, gIndex) in funcGroups" :key="gIndex">
      <view class="func-item" v-for="item in group" :key="item.title"
        @click="item.action ? $emit(item.action) : goPage(item.url)">
        <text class="func-icon iconfont" :class="`icon-${item.icon}`"></text>
        <text class="func-title">{{ item.title }}</text>
        <text class="iconfont icon-arrow-right func-arrow"></text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn" v-if="userInfo.isLogin" @click="logout">
      <text>退出登录</text>
    </view>

    <!-- 底部安全区 -->
    <view class="safe-bottom"></view>
  </view>
</template>

<style lang="scss" scoped>
.page-user {
  background: $bg-page;
  min-height: 100vh;
}

/* 用户信息区 */
.user-header {
  background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
  padding: 48rpx 32rpx;
  padding-top: calc(48rpx + env(safe-area-inset-top));
  
  .user-info {
    display: flex;
    align-items: center;
    
    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255,255,255,0.5);
    }
    
    .user-detail {
      flex: 1;
      margin-left: 24rpx;
      
      .user-name {
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        display: block;
      }
      
      .user-phone, .user-hint {
        font-size: 26rpx;
        color: rgba(255,255,255,0.8);
        margin-top: 8rpx;
        display: block;
      }
    }
    
    .icon-arrow-right {
      color: rgba(255,255,255,0.8);
      font-size: 32rpx;
    }
  }
}

/* 订单板块 */
.order-section {
  background: #fff;
  margin: 20rpx 32rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: $shadow-light;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
    }
    
    .section-more {
      font-size: 26rpx;
      color: $text-hint;
    }
  }
  
  .order-tabs {
    display: flex;
    justify-content: space-around;
    
    .order-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      
      .order-icon {
        font-size: 48rpx;
        margin-bottom: 8rpx;
      }
      
      .order-label {
        font-size: 24rpx;
        color: $text-secondary;
      }
      
      .order-badge {
        position: absolute;
        top: -8rpx;
        right: -16rpx;
        background: $aux-red;
        color: #fff;
        font-size: 20rpx;
        min-width: 32rpx;
        height: 32rpx;
        line-height: 32rpx;
        text-align: center;
        border-radius: 16rpx;
        padding: 0 8rpx;
      }
    }
  }
}

/* 功能列表 */
.func-section {
  background: #fff;
  margin: 20rpx 32rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: $shadow-light;
  
  .func-item {
    display: flex;
    align-items: center;
    padding: 28rpx 24rpx;
    border-bottom: 1rpx solid $border-light;
    
    &:last-child {
      border-bottom: none;
    }
    
    .func-icon {
      font-size: 36rpx;
      color: $primary;
      margin-right: 20rpx;
      width: 40rpx;
      text-align: center;
    }
    
    .func-title {
      flex: 1;
      font-size: 30rpx;
      color: $text-primary;
    }
    
    .func-arrow {
      font-size: 28rpx;
      color: $text-hint;
    }
  }
}

/* 退出登录 */
.logout-btn {
  margin: 40rpx 32rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: #fff;
  border-radius: 16rpx;
  color: $aux-red;
  font-size: 30rpx;
  box-shadow: $shadow-light;
}
</style>

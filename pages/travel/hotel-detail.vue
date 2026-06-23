<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getHotelDetail, bookHotel } from '@/api/travel'

// 民宿ID
const hotelId = ref('')

// 民宿详情
const detail = ref({
  id: '',
  name: '',
  images: [],
  rating: 0,
  price: 0,
  description: '',
  address: '',
  phone: '',
  facilities: [],
  comments: []
})

// 入住日期
const checkInDate = ref('')
const checkOutDate = ref('')

// 加载数据
async function loadDetail() {
  try {
    const res = await getHotelDetail(hotelId.value)
    detail.value = res.data || {}
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 选择入住日期
function chooseCheckIn() {
  uni.showDatePicker({
    mode: 'date',
    startDate: new Date().toISOString().split('T')[0],
    success: (res) => {
      checkInDate.value = res.date
      if (!checkOutDate.value || checkOutDate.value <= checkInDate.value) {
        // 默认入住1晚
        const nextDay = new Date(checkInDate.value)
        nextDay.setDate(nextDay.getDate() + 1)
        checkOutDate.value = nextDay.toISOString().split('T')[0]
      }
    }
  })
}

// 选择退房日期
function chooseCheckOut() {
  if (!checkInDate.value) {
    uni.showToast({ title: '请先选择入住日期', icon: 'none' })
    return
  }
  
  uni.showDatePicker({
    mode: 'date',
    startDate: checkInDate.value,
    success: (res) => {
      checkOutDate.value = res.date
    }
  })
}

// 预订
async function handleBook() {
  if (!checkLogin()) return
  
  if (!checkInDate.value || !checkOutDate.value) {
    uni.showToast({ title: '请选择入住和退房日期', icon: 'none' })
    return
  }
  
  try {
    uni.showLoading({ title: '预订中...' })
    await bookHotel({
      hotelId: hotelId.value,
      checkIn: checkInDate.value,
      checkOut: checkOutDate.value
    })
    uni.hideLoading()
    
    uni.showToast({ title: '预订成功', icon: 'success' })
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '预订失败', icon: 'none' })
  }
}

// 拨打电话
function callPhone(phone) {
  uni.makePhoneCall({ phoneNumber: phone })
}

// 检查登录
function checkLogin() {
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.navigateTo({ url: '/pages/user/login' })
    return false
  }
  return true
}

onLoad((options) => {
  if (options.id) {
    hotelId.value = options.id
    loadDetail()
  }
})
</script>

<template>
  <view class="page-hotel-detail">
    <!-- 轮播图 -->
    <swiper class="hotel-swiper" autoplay circular indicator-dots
      indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#2E7D32">
      <swiper-item v-for="(img, index) in detail.images" :key="index">
        <image class="hotel-image" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 基本信息 -->
    <view class="info-section">
      <view class="info-header">
        <text class="hotel-name">{{ detail.name }}</text>
        <view class="hotel-rating">
          <text class="stars">⭐⭐⭐⭐⭐</text>
          <text class="rating-num">{{ detail.rating }}</text>
        </view>
      </view>
      
      <view class="info-meta">
        <view class="meta-item">
          <text class="meta-icon">📍</text>
          <text class="meta-text">{{ detail.address }}</text>
        </view>
        <view class="meta-item">
          <text class="meta-icon">📞</text>
          <text class="meta-text">{{ detail.phone }}</text>
          <text class="meta-action" @click="callPhone(detail.phone)">拨打</text>
        </view>
      </view>
    </view>

    <!-- 价格 -->
    <view class="price-section">
      <text class="price-label">价格</text>
      <text class="price-value">¥{{ detail.price }}/晚</text>
    </view>

    <!-- 设施服务 -->
    <view class="facility-section" v-if="detail.facilities && detail.facilities.length">
      <text class="section-title">设施服务</text>
      <view class="facility-list">
        <text class="facility-item" v-for="item in detail.facilities" :key="item">
          {{ item }}
        </text>
      </view>
    </view>

    <!-- 民宿介绍 -->
    <view class="desc-section">
      <text class="section-title">民宿介绍</text>
      <rich-text :nodes="detail.description"></rich-text>
    </view>

    <!-- 用户评价 -->
    <view class="comment-section" v-if="detail.comments && detail.comments.length">
      <text class="section-title">用户评价 ({{ detail.comments.length }})</text>
      <view class="comment-item" v-for="item in detail.comments" :key="item.id">
        <view class="comment-header">
          <image class="comment-avatar" :src="item.avatar" lazy-load mode="aspectFill" />
          <text class="comment-nickname">{{ item.nickname }}</text>
          <text class="comment-rating">⭐{{ item.rating }}</text>
        </view>
        <text class="comment-text">{{ item.content }}</text>
        <text class="comment-time">{{ item.time }}</text>
      </view>
    </view>

    <!-- 底部预订栏 -->
    <view class="footer safe-bottom">
      <view class="date-picker">
        <view class="date-item" @click="chooseCheckIn">
          <text class="date-label">入住</text>
          <text class="date-value">{{ checkInDate || '选择日期' }}</text>
        </view>
        <view class="date-separator">至</view>
        <view class="date-item" @click="chooseCheckOut">
          <text class="date-label">退房</text>
          <text class="date-value">{{ checkOutDate || '选择日期' }}</text>
        </view>
      </view>
      <button class="book-btn" @click="handleBook">立即预订</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-hotel-detail {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 180rpx;
}

/* 轮播图 */
.hotel-swiper {
  height: 500rpx;
  
  .hotel-image {
    width: 100%;
    height: 100%;
  }
}

/* 基本信息 */
.info-section {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 20rpx;
  
  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .hotel-name {
      font-size: 40rpx;
      font-weight: bold;
      color: $text-primary;
      flex: 1;
    }
    
    .hotel-rating {
      display: flex;
      align-items: center;
      
      .stars {
        font-size: 24rpx;
      }
      
      .rating-num {
        font-size: 28rpx;
        color: $aux-orange;
        margin-left: 8rpx;
        font-weight: bold;
      }
    }
  }
  
  .info-meta {
    .meta-item {
      display: flex;
      align-items: center;
      padding: 16rpx 0;
      border-bottom: 1rpx solid $border-light;
      
      &:last-child {
        border-bottom: none;
      }
      
      .meta-icon {
        font-size: 32rpx;
        margin-right: 16rpx;
        width: 40rpx;
        text-align: center;
      }
      
      .meta-text {
        flex: 1;
        font-size: 28rpx;
        color: $text-secondary;
      }
      
      .meta-action {
        font-size: 26rpx;
        color: $primary;
        padding: 8rpx 24rpx;
        background: $primary-bg;
        border-radius: 8rpx;
      }
    }
  }
}

/* 价格 */
.price-section {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .price-label {
    font-size: 30rpx;
    color: $text-secondary;
  }
  
  .price-value {
    font-size: 40rpx;
    color: $aux-red;
    font-weight: bold;
  }
}

/* 设施服务 */
.facility-section {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: $text-primary;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .facility-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    
    .facility-item {
      font-size: 26rpx;
      color: $text-secondary;
      background: $bg-page;
      padding: 12rpx 24rpx;
      border-radius: 8rpx;
    }
  }
}

/* 民宿介绍 */
.desc-section {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: $text-primary;
    display: block;
    margin-bottom: 20rpx;
  }
}

/* 用户评价 */
.comment-section {
  background: #fff;
  padding: 32rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: $text-primary;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .comment-item {
    padding: 20rpx 0;
    border-bottom: 1rpx solid $border-light;
    
    .comment-header {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
      
      .comment-avatar {
        width: 48rpx;
        height: 48rpx;
        border-radius: 50%;
        margin-right: 12rpx;
      }
      
      .comment-nickname {
        font-size: 26rpx;
        color: $text-primary;
        flex: 1;
      }
      
      .comment-rating {
        font-size: 22rpx;
        color: $aux-orange;
      }
    }
    
    .comment-text {
      font-size: 26rpx;
      color: $text-secondary;
      line-height: 1.6;
      display: block;
      margin-bottom: 8rpx;
    }
    
    .comment-time {
      font-size: 22rpx;
      color: $text-hint;
    }
  }
}

/* 底部预订栏 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 16rpx 32rpx;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  
  .date-picker {
    flex: 1;
    display: flex;
    align-items: center;
    margin-right: 24rpx;
    
    .date-item {
      display: flex;
      flex-direction: column;
      
      .date-label {
        font-size: 22rpx;
        color: $text-hint;
      }
      
      .date-value {
        font-size: 26rpx;
        color: $text-primary;
      }
    }
    
    .date-separator {
      margin: 0 16rpx;
      color: $text-hint;
    }
  }
  
  .book-btn {
    background: $aux-red;
    color: #fff;
    font-size: 28rpx;
    padding: 16rpx 32rpx;
    border-radius: 8rpx;
    border: none;
  }
}
</style>

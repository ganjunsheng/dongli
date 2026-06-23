<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSpotDetail } from '@/api/travel'

// 景点ID
const spotId = ref('')

// 景点详情
const detail = ref({
  id: '',
  name: '',
  images: [],
  rating: 0,
  price: 0,
  description: '',
  address: '',
  openTime: '',
  tips: '',
  comments: []
})

// 加载数据
async function loadDetail() {
  try {
    const res = await getSpotDetail(spotId.value)
    detail.value = res.data || {}
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 预览图片
function previewImage(index) {
  uni.previewImage({
    urls: detail.value.images,
    current: index
  })
}

// 打开地图
function openMap() {
  uni.openLocation({
    latitude: detail.value.latitude,
    longitude: detail.value.longitude,
    name: detail.value.name,
    address: detail.value.address
  })
}

// 拨打电话
function callPhone(phone) {
  uni.makePhoneCall({ phoneNumber: phone })
}

onLoad((options) => {
  if (options.id) {
    spotId.value = options.id
    loadDetail()
  }
})
</script>

<template>
  <view class="page-spot-detail">
    <!-- 轮播图 -->
    <swiper class="spot-swiper" autoplay circular indicator-dots
      indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#2E7D32">
      <swiper-item v-for="(img, index) in detail.images" :key="index">
        <image class="spot-image" :src="img" mode="aspectFill" @click="previewImage(index)" />
      </swiper-item>
    </swiper>

    <!-- 基本信息 -->
    <view class="info-section">
      <view class="info-header">
        <text class="spot-name">{{ detail.name }}</text>
        <view class="spot-rating">
          <text class="stars">⭐⭐⭐⭐⭐</text>
          <text class="rating-num">{{ detail.rating }}</text>
        </view>
      </view>
      
      <view class="info-meta">
        <view class="meta-item" @click="openMap">
          <text class="meta-icon">📍</text>
          <text class="meta-text">{{ detail.address }}</text>
          <text class="meta-arrow">></text>
        </view>
        <view class="meta-item">
          <text class="meta-icon">⏰</text>
          <text class="meta-text">{{ detail.openTime }}</text>
        </view>
        <view class="meta-item" v-if="detail.phone">
          <text class="meta-icon">📞</text>
          <text class="meta-text">{{ detail.phone }}</text>
          <text class="meta-action" @click="callPhone(detail.phone)">拨打</text>
        </view>
      </view>
    </view>

    <!-- 景点介绍 -->
    <view class="desc-section">
      <text class="section-title">景点介绍</text>
      <rich-text :nodes="detail.description"></rich-text>
    </view>

    <!-- 游玩贴士 -->
    <view class="tips-section" v-if="detail.tips">
      <text class="section-title">游玩贴士</text>
      <text class="tips-text">{{ detail.tips }}</text>
    </view>

    <!-- 用户评价 -->
    <view class="comment-section" v-if="detail.comments && detail.comments.length">
      <text class="section-title">用户评价 ({{ detail.comments.length }})</text>
      <view class="comment-item" v-for="item in detail.comments" :key="item.id">
        <view class="comment-header">
          <image class="comment-avatar" :src="item.avatar" mode="aspectFill" />
          <text class="comment-nickname">{{ item.nickname }}</text>
          <text class="comment-rating">⭐{{ item.rating }}</text>
        </view>
        <text class="comment-text">{{ item.content }}</text>
        <text class="comment-time">{{ item.time }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-spot-detail {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

/* 轮播图 */
.spot-swiper {
  height: 500rpx;
  
  .spot-image {
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
    
    .spot-name {
      font-size: 40rpx;
      font-weight: bold;
      color: $text-primary;
      flex: 1;
    }
    
    .spot-rating {
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
      
      .meta-arrow {
        font-size: 28rpx;
        color: $text-hint;
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

/* 景点介绍 */
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

/* 游玩贴士 */
.tips-section {
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
  
  .tips-text {
    font-size: 28rpx;
    color: $text-secondary;
    line-height: 1.8;
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
</style>

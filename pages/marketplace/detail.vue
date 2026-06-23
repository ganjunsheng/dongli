<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getMarketDetail } from '@/api/marketplace'

// 闲置ID
const itemId = ref('')

// 闲置详情
const detail = ref({
  id: '',
  title: '',
  images: [],
  price: 0,
  isFree: false,
  description: '',
  category: '',
  condition: '', // 新旧程度
  publisher: {
    id: '',
    nickname: '',
    avatar: '',
    phone: ''
  },
  createTime: '',
  viewCount: 0
})

// 加载数据
async function loadDetail() {
  try {
    const res = await getMarketDetail(itemId.value)
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

// 联系卖家
function contactSeller() {
  uni.makePhoneCall({ phoneNumber: detail.value.publisher.phone })
}

// 立即购买（闲置一般是直接联系）
function handleBuy() {
  uni.showModal({
    title: '提示',
    content: '闲置物品请直接联系卖家当面交易',
    showCancel: false
  })
}

onLoad((options) => {
  if (options.id) {
    itemId.value = options.id
    loadDetail()
  }
})
</script>

<template>
  <view class="page-market-detail">
    <!-- 图片轮播 -->
    <swiper class="image-swiper" autoplay circular indicator-dots
      indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#2E7D32">
      <swiper-item v-for="(img, index) in detail.images" :key="index">
        <image class="detail-image" :src="img" mode="aspectFill" @click="previewImage(index)" />
      </swiper-item>
    </swiper>

    <!-- 价格信息 -->
    <view class="price-section">
      <text class="price" :class="{ free: detail.isFree }">
        {{ detail.isFree ? '免费赠送' : `¥${detail.price}` }}
      </text>
      <text class="condition">{{ detail.condition }}</text>
    </view>

    <!-- 标题和描述 -->
    <view class="info-section">
      <text class="title">{{ detail.title }}</text>
      <text class="description">{{ detail.description }}</text>
      <view class="meta">
        <text class="category">分类：{{ detail.category }}</text>
        <text class="time">{{ detail.createTime }}</text>
        <text class="views">浏览 {{ detail.viewCount }} 次</text>
      </view>
    </view>

    <!-- 卖家信息 -->
    <view class="seller-section">
      <text class="section-title">卖家信息</text>
      <view class="seller-info">
        <image class="seller-avatar" :src="detail.publisher.avatar" mode="aspectFill" />
        <view class="seller-detail">
          <text class="seller-name">{{ detail.publisher.nickname }}</text>
          <text class="seller-phone">{{ detail.publisher.phone }}</text>
        </view>
        <button class="contact-btn" @click="contactSeller">联系卖家</button>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="footer safe-bottom">
      <button class="btn-contact" @click="contactSeller">联系卖家</button>
      <button class="btn-buy" @click="handleBuy">我想要</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-market-detail {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

/* 图片轮播 */
.image-swiper {
  height: 750rpx;
  
  .detail-image {
    width: 100%;
    height: 100%;
  }
}

/* 价格区 */
.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  background: #fff;
  margin-bottom: 2rpx;
  
  .price {
    font-size: 48rpx;
    color: $aux-red;
    font-weight: bold;
    
    &.free {
      color: $primary;
      font-size: 36rpx;
    }
  }
  
  .condition {
    font-size: 24rpx;
    color: $text-hint;
    background: $bg-page;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
  }
}

/* 信息区 */
.info-section {
  padding: 24rpx 32rpx;
  background: #fff;
  margin-bottom: 20rpx;
  
  .title {
    font-size: 34rpx;
    font-weight: 500;
    color: $text-primary;
    display: block;
    margin-bottom: 16rpx;
  }
  
  .description {
    font-size: 28rpx;
    color: $text-secondary;
    line-height: 1.8;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    
    text {
      font-size: 24rpx;
      color: $text-hint;
    }
  }
}

/* 卖家信息 */
.seller-section {
  padding: 24rpx 32rpx;
  background: #fff;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .seller-info {
    display: flex;
    align-items: center;
    
    .seller-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 16rpx;
    }
    
    .seller-detail {
      flex: 1;
      
      .seller-name {
        font-size: 28rpx;
        color: $text-primary;
        display: block;
      }
      
      .seller-phone {
        font-size: 24rpx;
        color: $text-hint;
        margin-top: 4rpx;
        display: block;
      }
    }
    
    .contact-btn {
      background: $primary;
      color: #fff;
      font-size: 26rpx;
      padding: 12rpx 32rpx;
      border-radius: 8rpx;
      border: none;
    }
  }
}

/* 底部操作栏 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 16rpx 32rpx;
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.08);
  
  button {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 28rpx;
    border: none;
    border-radius: 0;
    
    &.btn-contact {
      background: #fff;
      color: $primary;
      border: 2rpx solid $primary;
      border-radius: 40rpx 0 0 40rpx;
    }
    
    &.btn-buy {
      background: $aux-red;
      color: #fff;
      border-radius: 0 40rpx 40rpx 0;
    }
  }
}
</style>

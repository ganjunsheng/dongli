<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getProductDetail } from '@/api/mall'

// 商品ID
const productId = ref('')

// 商品详情
const detail = ref({
  id: '',
  name: '',
  price: 0,
  originPrice: 0,
  sales: 0,
  images: [],
  description: '',
  specs: [],
  comments: []
})

// 当前选中规格
const selectedSpec = ref('')

// 数量
const quantity = ref(1)

// 加载数据
async function loadDetail() {
  try {
    const res = await getProductDetail(productId.value)
    detail.value = res.data || {}
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 选择规格
function selectSpec(spec) {
  selectedSpec.value = spec
}

// 数量加减
function changeQuantity(type) {
  if (type === 'minus' && quantity.value > 1) {
    quantity.value--
  } else if (type === 'plus') {
    quantity.value++
  }
}

// 加入购物车
function addToCart() {
  if (!checkLogin()) return
  
  uni.showToast({ title: '已加入购物车', icon: 'success' })
}

// 立即购买
function buyNow() {
  if (!checkLogin()) return
  
  uni.navigateTo({
    url: `/pages/order/confirm?productId=${productId.value}&quantity=${quantity.value}`
  })
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

// 分享
function onShareAppMessage() {
  return {
    title: detail.value.name,
    path: `/pages/mall/detail?id=${productId.value}`
  }
}

onLoad((options) => {
  if (options.id) {
    productId.value = options.id
    loadDetail()
  }
})
</script>

<template>
  <view class="page-product-detail">
    <!-- 商品轮播图 -->
    <swiper class="product-swiper" autoplay circular indicator-dots
      indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#2E7D32">
      <swiper-item v-for="(img, index) in detail.images" :key="index">
        <image class="product-image" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 价格信息 -->
    <view class="price-section">
      <view class="price-row">
        <text class="current-price">¥{{ detail.price }}</text>
        <text class="origin-price" v-if="detail.originPrice">¥{{ detail.originPrice }}</text>
        <text class="discount-tag" v-if="detail.originPrice">
          优惠{{ Math.round((1 - detail.price / detail.originPrice) * 100) }}%
        </text>
      </view>
      <text class="sales">已售{{ detail.sales }}件</text>
    </view>

    <!-- 商品名称 -->
    <view class="name-section">
      <text class="product-name">{{ detail.name }}</text>
      <button class="share-btn" open-type="share">
        <text class="iconfont icon-share">分享</text>
      </button>
    </view>

    <!-- 规格选择 -->
    <view class="spec-section" v-if="detail.specs && detail.specs.length">
      <text class="section-label">规格</text>
      <view class="spec-list">
        <text class="spec-item" v-for="spec in detail.specs" :key="spec"
          :class="{ active: selectedSpec === spec }" @click="selectSpec(spec)">
          {{ spec }}
        </text>
      </view>
    </view>

    <!-- 数量选择 -->
    <view class="quantity-section">
      <text class="section-label">数量</text>
      <view class="quantity-control">
        <text class="qty-btn" @click="changeQuantity('minus')">-</text>
        <text class="qty-num">{{ quantity }}</text>
        <text class="qty-btn" @click="changeQuantity('plus')">+</text>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="desc-section">
      <text class="section-title">商品详情</text>
      <rich-text :nodes="detail.description"></rich-text>
    </view>

    <!-- 评价列表 -->
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

    <!-- 底部操作栏 -->
    <view class="footer safe-bottom">
      <view class="footer-left">
        <view class="footer-icon" @click="goHome">
          <text class="iconfont icon-home">首页</text>
        </view>
        <view class="footer-icon" @click="goCart">
          <text class="iconfont icon-cart">购物车</text>
          <text class="cart-badge">3</text>
        </view>
      </view>
      <view class="footer-right">
        <button class="btn-add-cart" @click="addToCart">加入购物车</button>
        <button class="btn-buy" @click="buyNow">立即购买</button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-product-detail {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

/* 轮播图 */
.product-swiper {
  height: 750rpx;
  
  .product-image {
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
  
  .price-row {
    display: flex;
    align-items: baseline;
    
    .current-price {
      font-size: 48rpx;
      color: $aux-red;
      font-weight: bold;
    }
    
    .origin-price {
      font-size: 28rpx;
      color: $text-hint;
      text-decoration: line-through;
      margin-left: 16rpx;
    }
    
    .discount-tag {
      font-size: 20rpx;
      background: $aux-red;
      color: #fff;
      padding: 4rpx 12rpx;
      border-radius: 6rpx;
      margin-left: 16rpx;
    }
  }
  
  .sales {
    font-size: 24rpx;
    color: $text-hint;
  }
}

/* 商品名称 */
.name-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24rpx 32rpx;
  background: #fff;
  margin-top: 2rpx;
  
  .product-name {
    flex: 1;
    font-size: 34rpx;
    font-weight: 500;
    color: $text-primary;
    line-height: 1.6;
    margin-right: 24rpx;
  }
  
  .share-btn {
    flex-shrink: 0;
    font-size: 24rpx;
    color: $text-secondary;
    background: none;
    border: none;
    padding: 0;
  }
}

/* 规格选择 */
.spec-section, .quantity-section {
  padding: 24rpx 32rpx;
  background: #fff;
  margin-top: 2rpx;
  
  .section-label {
    font-size: 28rpx;
    color: $text-secondary;
    display: block;
    margin-bottom: 16rpx;
  }
}

.spec-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  
  .spec-item {
    padding: 12rpx 32rpx;
    background: $bg-page;
    border-radius: 8rpx;
    font-size: 26rpx;
    color: $text-primary;
    
    &.active {
      background: $primary-bg;
      color: $primary;
      border: 1rpx solid $primary;
    }
  }
}

/* 数量控制 */
.quantity-control {
  display: flex;
  align-items: center;
  
  .qty-btn {
    width: 64rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    background: $bg-page;
    font-size: 32rpx;
    color: $text-primary;
  }
  
  .qty-num {
    width: 96rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    background: $bg-page;
    margin: 0 2rpx;
    font-size: 28rpx;
  }
}

/* 详情区 */
.desc-section {
  padding: 32rpx;
  background: #fff;
  margin-top: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    display: block;
    margin-bottom: 24rpx;
  }
}

/* 评价区 */
.comment-section {
  padding: 32rpx;
  background: #fff;
  margin-top: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    display: block;
    margin-bottom: 24rpx;
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

/* 底部操作栏 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 16rpx 32rpx;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.08);
  
  .footer-left {
    display: flex;
    margin-right: 24rpx;
    
    .footer-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 32rpx;
      position: relative;
      
      .iconfont {
        font-size: 36rpx;
        color: $text-secondary;
      }
      
      .cart-badge {
        position: absolute;
        top: -8rpx;
        right: -16rpx;
        background: $aux-red;
        color: #fff;
        font-size: 18rpx;
        min-width: 28rpx;
        height: 28rpx;
        line-height: 28rpx;
        text-align: center;
        border-radius: 14rpx;
        padding: 0 6rpx;
      }
    }
  }
  
  .footer-right {
    flex: 1;
    display: flex;
    
    button {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 28rpx;
      border: none;
      border-radius: 0;
      
      &.btn-add-cart {
        background: #FF9800;
        color: #fff;
        border-radius: 40rpx 0 0 40rpx;
      }
      
      &.btn-buy {
        background: $aux-red;
        color: #fff;
        border-radius: 0 40rpx 40rpx 0;
      }
    }
  }
}
</style>

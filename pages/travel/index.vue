<script setup>
import { ref } from 'vue'
import { getSpotList, getHotelList } from '@/api/travel'

// 页面板块
const currentTab = ref(0)
const tabs = ref(['热门景点', '农家乐', '旅游攻略'])

// 景点数据
const spotList = ref([])

// 农家乐数据
const hotelList = ref([])

// 攻略数据
const guideList = ref([])

// 加载数据
async function loadData() {
  try {
    if (currentTab.value === 0) {
      const res = await getSpotList()
      spotList.value = res.data.list || []
    } else if (currentTab.value === 1) {
      const res = await getHotelList()
      hotelList.value = res.data.list || []
    } else {
      // 攻略数据
      guideList.value = [
        { id: 1, title: '春日赏花攻略', image: '/static/images/travel/guide1.png', author: '小李', likes: 123 },
        { id: 2, title: '采摘节游玩指南', image: '/static/images/travel/guide2.png', author: '小王', likes: 89 }
      ]
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 切换标签
function switchTab(index) {
  currentTab.value = index
  loadData()
}

// 查看景点详情
function goSpotDetail(id) {
  uni.navigateTo({ url: `/pages/travel/spot-detail?id=${id}` })
}

// 查看农家乐详情
function goHotelDetail(id) {
  uni.navigateTo({ url: `/pages/travel/hotel-detail?id=${id}` })
}

// 拨打电话
function callPhone(phone) {
  uni.makePhoneCall({ phoneNumber: phone })
}

// 初始化
loadData()
</script>

<template>
  <view class="page-travel">
    <!-- Banner -->
    <swiper class="travel-banner" autoplay circular indicator-dots
      indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#2E7D32">
      <swiper-item>
        <image class="banner-image" src="/static/images/travel/banner1.png" mode="aspectFill" />
      </swiper-item>
      <swiper-item>
        <image class="banner-image" src="/static/images/travel/banner2.png" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 标签页 -->
    <view class="tabs">
      <view class="tab-item" v-for="(tab, index) in tabs" :key="index"
        :class="{ active: currentTab === index }" @click="switchTab(index)">
        <text>{{ tab }}</text>
        <view class="tab-line" v-if="currentTab === index"></view>
      </view>
    </view>

    <!-- 热门景点 -->
    <view class="spot-list" v-if="currentTab === 0">
      <scroll-view class="spot-scroll" scroll-x>
        <view class="spot-card" v-for="item in spotList" :key="item.id"
          @click="goSpotDetail(item.id)">
          <image class="spot-image" :src="item.image" mode="aspectFill" />
          <view class="spot-info">
            <text class="spot-name">{{ item.name }}</text>
            <view class="spot-rating">
              <text class="stars">⭐⭐⭐⭐⭐</text>
              <text class="rating-num">{{ item.rating }}</text>
            </view>
            <text class="spot-distance">{{ item.distance }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 农家乐/民宿 -->
    <view class="hotel-list" v-if="currentTab === 1">
      <view class="hotel-card" v-for="item in hotelList" :key="item.id"
        @click="goHotelDetail(item.id)">
        <image class="hotel-image" :src="item.image" mode="aspectFill" />
        <view class="hotel-info">
          <text class="hotel-name">{{ item.name }}</text>
          <view class="hotel-meta">
            <text class="hotel-rating">⭐{{ item.rating }}</text>
            <text class="hotel-price">¥{{ item.price }}/晚</text>
          </view>
          <text class="hotel-address">{{ item.address }}</text>
          <text class="hotel-distance">{{ item.distance }}</text>
        </view>
        <view class="hotel-action">
          <button class="btn-call" @click.stop="callPhone(item.phone)">联系商家</button>
        </view>
      </view>
    </view>

    <!-- 旅游攻略 -->
    <view class="guide-list" v-if="currentTab === 2">
      <view class="guide-card" v-for="item in guideList" :key="item.id">
        <image class="guide-image" :src="item.image" mode="aspectFill" />
        <view class="guide-info">
          <text class="guide-title">{{ item.title }}</text>
          <view class="guide-meta">
            <text class="guide-author">{{ item.author }}</text>
            <text class="guide-likes">❤ {{ item.likes }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="(currentTab === 0 && !spotList.length) || 
      (currentTab === 1 && !hotelList.length) || 
      (currentTab === 2 && !guideList.length)">
      <text class="empty-text">暂无数据</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-travel {
  background: $bg-page;
  min-height: 100vh;
}

/* Banner */
.travel-banner {
  height: 400rpx;
  
  .banner-image {
    width: 100%;
    height: 100%;
  }
}

/* 标签页 */
.tabs {
  display: flex;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 24rpx 0;
    font-size: 30rpx;
    color: $text-secondary;
    position: relative;
    
    &.active {
      color: $primary;
      font-weight: bold;
    }
    
    .tab-line {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 48rpx;
      height: 4rpx;
      background: $primary;
      border-radius: 2rpx;
    }
  }
}

/* 景点横滑 */
.spot-scroll {
  white-space: nowrap;
  padding: 24rpx 32rpx;
  
  .spot-card {
    display: inline-block;
    width: 300rpx;
    margin-right: 20rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: $shadow-light;
    vertical-align: top;
    
    .spot-image {
      width: 300rpx;
      height: 240rpx;
    }
    
    .spot-info {
      padding: 16rpx;
      
      .spot-name {
        font-size: 28rpx;
        font-weight: 500;
        display: block;
      }
      
      .spot-rating {
        display: flex;
        align-items: center;
        margin-top: 8rpx;
        
        .stars {
          font-size: 20rpx;
        }
        
        .rating-num {
          font-size: 24rpx;
          color: $aux-orange;
          margin-left: 8rpx;
        }
      }
      
      .spot-distance {
        font-size: 22rpx;
        color: $text-hint;
        margin-top: 8rpx;
        display: block;
      }
    }
  }
}

/* 农家乐列表 */
.hotel-list {
  padding: 20rpx 32rpx;
  
  .hotel-card {
    display: flex;
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    box-shadow: $shadow-light;
    
    .hotel-image {
      width: 200rpx;
      height: 200rpx;
      border-radius: 12rpx;
      flex-shrink: 0;
    }
    
    .hotel-info {
      flex: 1;
      margin-left: 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .hotel-name {
        font-size: 32rpx;
        font-weight: 500;
        color: $text-primary;
      }
      
      .hotel-meta {
        display: flex;
        align-items: center;
        margin-top: 8rpx;
        
        .hotel-rating {
          font-size: 24rpx;
          color: $aux-orange;
        }
        
        .hotel-price {
          font-size: 28rpx;
          color: $aux-red;
          font-weight: bold;
          margin-left: 24rpx;
        }
      }
      
      .hotel-address, .hotel-distance {
        font-size: 24rpx;
        color: $text-hint;
        margin-top: 4rpx;
      }
    }
    
    .hotel-action {
      display: flex;
      align-items: flex-end;
      
      .btn-call {
        background: $primary;
        color: #fff;
        font-size: 24rpx;
        padding: 8rpx 24rpx;
        border-radius: 8rpx;
        border: none;
      }
    }
  }
}

/* 旅游攻略 */
.guide-list {
  padding: 20rpx 32rpx;
  
  .guide-card {
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
    box-shadow: $shadow-light;
    
    .guide-image {
      width: 100%;
      height: 360rpx;
    }
    
    .guide-info {
      padding: 24rpx;
      
      .guide-title {
        font-size: 32rpx;
        font-weight: 500;
        display: block;
      }
      
      .guide-meta {
        display: flex;
        justify-content: space-between;
        margin-top: 16rpx;
        font-size: 24rpx;
        color: $text-hint;
      }
    }
  }
}
</style>

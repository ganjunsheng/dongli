<script setup>
import { ref, onMounted } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { getNoticeList } from '@/api/village'
import { getProductList } from '@/api/mall'
import { getLocationInfo, chooseLocation } from '@/utils/location'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'

/* ========== 定位村庄 ========== */
const villageName = ref('定位中...')
const locationLoading = ref(false)

async function initLocation() {
  locationLoading.value = true
  try {
    const info = await getLocationInfo()
    villageName.value = info.village || '附近'
  } catch (e) {
    villageName.value = '选择村庄'
  } finally {
    locationLoading.value = false
  }
}

function handleLocationTap() {
  uni.showActionSheet({
    itemList: ['重新定位', '手动选择位置'],
    success: async (res) => {
      if (res.tapIndex === 0) {
        // 重新 GPS 定位
        villageName.value = '定位中...'
        await initLocation()
      } else if (res.tapIndex === 1) {
        // 手动选择
        try {
          const info = await chooseLocation()
          villageName.value = info.village || '已选位置'
        } catch (e) {
          // 用户取消
        }
      }
    }
  })
}

/* ========== 轮播图数据 ========== */
const swiperList = ref([
  { id: 1, image: '/static/images/banner/banner1.png', title: '采菊东篱下，悠然见南山' },
  { id: 2, image: '/static/images/banner/banner2.png', title: '助农增收在行动' },
  { id: 3, image: '/static/images/banner/banner3.png', title: '乡村旅游等你来' }
])

// 功能宫格
const gridList = ref([
  { id: 1, icon: 'notice', title: '村务公告', url: '/pages/village/index' },
  { id: 2, icon: 'service', title: '便民办事', url: '/pages/village/service' },
  { id: 3, icon: 'shop', title: '助农商城', url: '/pages/mall/index' },
  { id: 4, icon: 'travel', title: '乡村旅游', url: '/pages/travel/index' },
  { id: 5, icon: 'market', title: '闲置集市', url: '/pages/marketplace/index' },
  { id: 6, icon: 'job', title: '招工求职', url: '/pages/job/index' },
  { id: 7, icon: 'health', title: '医疗健康', url: '' },
  { id: 8, icon: 'more', title: '更多服务', url: '' }
])

// 紧急公告
const noticeList = ref([])

// 村务动态
const newsList = ref([])

// 特色农产品
const productList = ref([])

// 加载数据
async function loadData() {
  try {
    const [noticeRes, productRes] = await Promise.all([
      getNoticeList({ page: 1, size: 3 }),
      getProductList({ page: 1, size: 6 })
    ])
    noticeList.value = noticeRes.data.list || []
    productList.value = productRes.data.list || []
  } catch (e) {
    console.error('加载数据失败', e)
  }
}

// 下拉刷新
onPullDownRefresh(() => {
  loadData().then(() => {
    uni.stopPullDownRefresh()
  })
})

// 跳转页面
function goPage(url) {
  if (!url) {
    uni.showToast({ title: '即将开放', icon: 'none' })
    return
  }
  // 搜索页加载较慢，显示 loading
  if (url.includes('/search/')) {
    uni.showLoading({ title: '加载中...', mask: true })
  }
  uni.navigateTo({ url })
}

// 查看公告详情
function goNoticeDetail(id) {
  uni.navigateTo({ url: `/pages/village/detail?id=${id}` })
}

// 查看商品详情
function goProductDetail(id) {
  uni.navigateTo({ url: `/pages/mall/detail?id=${id}` })
}

onMounted(() => {
  loadData()
  initLocation()
})
</script>

<template>
  <view class="page-index">
    <!-- 自定义导航栏 -->
    <view class="navbar">
      <view class="navbar-content">
        <view class="navbar-left" @click="handleLocationTap">
          <text class="iconfont icon-location"></text>
          <text class="village-name">{{ locationLoading ? '定位中...' : villageName }}</text>
          <text class="village-arrow">▾</text>
        </view>
        <view class="navbar-search" @click="goPage('/pages/search/index')">
          <text class="iconfont icon-search"></text>
          <text class="search-placeholder">搜索服务</text>
        </view>
        <view class="navbar-right">
          <text class="iconfont icon-bell"></text>
        </view>
      </view>
    </view>

    <!-- 轮播图 -->
    <swiper class="swiper" autoplay circular indicator-dots
      indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#2E7D32">
      <swiper-item v-for="item in swiperList" :key="item.id">
        <image class="swiper-image" :src="item.image" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 功能宫格 -->
    <view class="grid-section">
      <view class="grid-item" v-for="item in gridList" :key="item.id"
        @click="goPage(item.url)">
        <view class="grid-icon iconfont" :class="`icon-${item.icon}`"></view>
        <text class="grid-title">{{ item.title }}</text>
      </view>
    </view>

    <!-- 紧急公告栏 -->
    <view class="notice-bar" v-if="noticeList.length">
      <text class="notice-icon">📢</text>
      <swiper class="notice-swiper" vertical autoplay circular>
        <swiper-item v-for="item in noticeList" :key="item.id">
          <text class="notice-text" @click="goNoticeDetail(item.id)">
            {{ item.title }}
          </text>
        </swiper-item>
      </swiper>
    </view>

    <!-- 村务动态 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">村务动态</text>
        <text class="section-more" @click="goPage('/pages/village/index')">更多 →</text>
      </view>
      <view class="news-list">
        <view class="news-item" v-for="item in newsList" :key="item.id"
          @click="goNoticeDetail(item.id)">
          <image class="news-image" :src="item.image" lazy-load mode="aspectFill" />
          <view class="news-info">
            <text class="news-title text-ellipsis">{{ item.title }}</text>
            <view class="news-meta">
              <text class="news-time">{{ item.time }}</text>
              <text class="news-views">{{ item.views }}次浏览</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 特色农产品 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">特色农产品</text>
        <text class="section-more" @click="goPage('/pages/mall/index')">更多 →</text>
      </view>
      <scroll-view class="product-scroll" scroll-x>
        <view class="product-item" v-for="item in productList" :key="item.id"
          @click="goProductDetail(item.id)">
          <image class="product-image" :src="item.image" lazy-load mode="aspectFill" />
          <text class="product-name text-ellipsis">{{ item.name }}</text>
          <text class="product-price">¥{{ item.price }}</text>
          <text class="product-origin">{{ item.origin }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 底部安全区 -->
    <view class="safe-bottom"></view>
  </view>
</template>

<style lang="scss" scoped>
.page-index {
  padding-bottom: 20rpx;
}

/* 导航栏 */
.navbar {
  background: $primary;
  padding: 22rpx 0 20rpx;
  
  .navbar-content {
    display: flex;
    align-items: center;
    padding: 0 32rpx;
    height: 88rpx;
  }
  
  .navbar-left {
    display: flex;
    align-items: center;
    color: #fff;
    
    .village-name {
      margin-left: 8rpx;
      font-size: 28rpx;
    }
    .village-arrow {
      margin-left: 4rpx;
      font-size: 22rpx;
      opacity: 0.7;
    }
  }
  
  .navbar-search {
    flex: 1;
    margin: 0 24rpx;
    height: 64rpx;
    background: rgba(255,255,255,0.9);
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    
    .search-placeholder {
      margin-left: 12rpx;
      color: $text-hint;
      font-size: 26rpx;
    }
  }
  
  .navbar-right {
    color: #fff;
    font-size: 36rpx;
  }
}

/* 轮播图 */
.swiper {
  height: 360rpx;
  
  .swiper-image {
    width: 100%;
    height: 100%;
  }
}

/* 功能宫格 */
.grid-section {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  padding: 24rpx 0;
  margin-bottom: 20rpx;
  
  .grid-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;
    
    .grid-icon {
      width: 96rpx;
      height: 96rpx;
      border-radius: 24rpx;
      background: $primary-bg;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
      color: $primary;
      margin-bottom: 12rpx;
    }
    
    .grid-title {
      font-size: 24rpx;
      color: $text-secondary;
    }
  }
}

/* 紧急公告栏 */
.notice-bar {
  display: flex;
  align-items: center;
  background: #FFF3E0;
  padding: 16rpx 32rpx;
  margin-bottom: 20rpx;
  
  .notice-icon {
    font-size: 32rpx;
    margin-right: 16rpx;
  }
  
  .notice-swiper {
    flex: 1;
    height: 40rpx;
    
    .notice-text {
      font-size: 26rpx;
      color: #E65100;
      line-height: 40rpx;
    }
  }
}

/* 板块通用 */
.section {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 20rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .section-title {
      font-size: 36rpx;
      font-weight: bold;
      color: $text-primary;
    }
    
    .section-more {
      font-size: 26rpx;
      color: $text-hint;
    }
  }
}

/* 村务动态列表 */
.news-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border-light;
  
  .news-image {
    width: 160rpx;
    height: 120rpx;
    border-radius: 12rpx;
    flex-shrink: 0;
  }
  
  .news-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .news-title {
      font-size: 30rpx;
      color: $text-primary;
      font-weight: 500;
    }
    
    .news-meta {
      display: flex;
      justify-content: space-between;
      
      text {
        font-size: 24rpx;
        color: $text-hint;
      }
    }
  }
}

/* 特色农产品横滑 */
.product-scroll {
  white-space: nowrap;
  
  .product-item {
    display: inline-block;
    width: 240rpx;
    margin-right: 20rpx;
    vertical-align: top;
    
    .product-image {
      width: 240rpx;
      height: 240rpx;
      border-radius: 16rpx;
    }
    
    .product-name {
      display: block;
      font-size: 28rpx;
      color: $text-primary;
      margin-top: 12rpx;
    }
    
    .product-price {
      display: block;
      font-size: 32rpx;
      color: $aux-red;
      font-weight: bold;
      margin-top: 8rpx;
    }
    
    .product-origin {
      display: block;
      font-size: 22rpx;
      color: $text-hint;
      margin-top: 4rpx;
    }
  }
}
</style>

<script setup>
import { ref } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { getMarketList } from '@/api/marketplace'

// 当前Tab
const currentTab = ref(0)
const tabs = ref(['全部', '闲置物品', '免费赠送'])

// 筛选
const categories = ref(['全部', '家具', '电器', '农具', '衣物', '其他'])

// 列表数据
const itemList = ref([])
const page = ref(1)
const hasMore = ref(true)
const loading = ref(false)

// 加载数据
async function loadData() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  
  try {
    const res = await getMarketList({
      page: page.value,
      size: 10,
      type: currentTab.value === 0 ? '' : currentTab.value === 1 ? 'sell' : 'free'
    })
    const list = res.data.list || []
    
    if (page.value === 1) {
      itemList.value = list
    } else {
      itemList.value.push(...list)
    }
    
    hasMore.value = list.length >= 10
  } catch (e) {
    console.error('加载失败', e)
  } finally {
    loading.value = false
  }
}

// 切换Tab
function switchTab(index) {
  currentTab.value = index
  resetList()
}

// 重置列表
function resetList() {
  page.value = 1
  hasMore.value = true
  itemList.value = []
  loadData()
}

// 下拉刷新
onPullDownRefresh(() => {
  resetList()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})

// 查看详情
function goDetail(id) {
  uni.navigateTo({ url: `/pages/marketplace/detail?id=${id}` })
}

// 发布
function goPublish() {
  uni.navigateTo({ url: '/pages/marketplace/publish' })
}

// 联系卖家
function contactSeller(phone, e) {
  e.stopPropagation()
  uni.makePhoneCall({ phoneNumber: phone })
}

// 初始化
loadData()
</script>

<template>
  <view class="page-market">
    <!-- 顶部Tab -->
    <view class="tabs">
      <view class="tab-item" v-for="(tab, index) in tabs" :key="index"
        :class="{ active: currentTab === index }" @click="switchTab(index)">
        <text>{{ tab }}</text>
        <view class="tab-line" v-if="currentTab === index"></view>
      </view>
    </view>

    <!-- 分类筛选 -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="cat-item" v-for="(cat, index) in categories" :key="index"
        :class="{ active: index === 0 }">
        {{ cat }}
      </view>
    </scroll-view>

    <!-- 瀑布流列表 -->
    <view class="waterfall">
      <view class="waterfall-column">
        <view class="market-card" v-for="item in itemList.filter((_, i) => i % 2 === 0)" 
          :key="item.id" @click="goDetail(item.id)">
          <image class="market-image" :src="item.image" mode="widthFix" />
          <view class="market-info">
            <text class="market-title text-ellipsis-2">{{ item.title }}</text>
            <view class="market-price-row">
              <text class="market-price" :class="{ free: item.price === 0 }">
                {{ item.price === 0 ? '免费' : `¥${item.price}` }}
              </text>
            </view>
            <view class="market-author">
              <image class="author-avatar" :src="item.avatar" mode="aspectFill" />
              <text class="author-name">{{ item.nickname }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="waterfall-column">
        <view class="market-card" v-for="item in itemList.filter((_, i) => i % 2 === 1)" 
          :key="item.id" @click="goDetail(item.id)">
          <image class="market-image" :src="item.image" mode="widthFix" />
          <view class="market-info">
            <text class="market-title text-ellipsis-2">{{ item.title }}</text>
            <view class="market-price-row">
              <text class="market-price" :class="{ free: item.price === 0 }">
                {{ item.price === 0 ? '免费' : `¥${item.price}` }}
              </text>
            </view>
            <view class="market-author">
              <image class="author-avatar" :src="item.avatar" mode="aspectFill" />
              <text class="author-name">{{ item.nickname }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 发布按钮 -->
    <view class="publish-btn" @click="goPublish">
      <text class="iconfont icon-add">+</text>
    </view>

    <!-- 加载状态 -->
    <view class="load-status">
      <text v-if="loading">加载中...</text>
      <text v-else-if="!hasMore">没有更多了</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-market {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 120rpx;
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

/* 分类滚动 */
.category-scroll {
  white-space: nowrap;
  background: #fff;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $border-light;
  
  .cat-item {
    display: inline-block;
    padding: 8rpx 24rpx;
    font-size: 26rpx;
    color: $text-secondary;
    background: $bg-section;
    border-radius: 20rpx;
    margin-left: 16rpx;
    
    &.active {
      background: $primary;
      color: #fff;
    }
    
    &:last-child {
      margin-right: 16rpx;
    }
  }
}

/* 瀑布流 */
.waterfall {
  display: flex;
  padding: 16rpx;
  
  .waterfall-column {
    flex: 1;
    padding: 0 8rpx;
  }
}

/* 闲置卡片 */
.market-card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
  box-shadow: $shadow-light;
  
  .market-image {
    width: 100%;
    display: block;
  }
  
  .market-info {
    padding: 16rpx;
    
    .market-title {
      font-size: 26rpx;
      color: $text-primary;
      line-height: 1.4;
    }
    
    .market-price-row {
      margin-top: 12rpx;
      
      .market-price {
        font-size: 32rpx;
        color: $aux-red;
        font-weight: bold;
        
        &.free {
          color: $aux-green;
          font-size: 28rpx;
        }
      }
    }
    
    .market-author {
      display: flex;
      align-items: center;
      margin-top: 16rpx;
      
      .author-avatar {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        margin-right: 8rpx;
      }
      
      .author-name {
        font-size: 22rpx;
        color: $text-hint;
      }
    }
  }
}

/* 发布按钮 */
.publish-btn {
  position: fixed;
  right: 40rpx;
  bottom: 200rpx;
  width: 100rpx;
  height: 100rpx;
  background: $primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(46, 125, 50, 0.4);
  z-index: 999;
  
  .icon-add {
    font-size: 48rpx;
    color: #fff;
  }
}

/* 加载状态 */
.load-status {
  text-align: center;
  padding: 32rpx;
  color: $text-hint;
  font-size: 24rpx;
}
</style>

<script setup>
import { ref } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { getProductList } from '@/api/mall'

// 分类
const categories = ref(['全部', '水果', '蔬菜', '粮油', '家畜', '加工食品'])
const currentCat = ref(0)

// 排序
const sortTypes = ref(['综合', '销量', '价格'])
const currentSort = ref(0)
const sortAsc = ref(true)

// 商品列表
const productList = ref([])
const page = ref(1)
const hasMore = ref(true)
const loading = ref(false)

// 切换分类
function switchCat(index) {
  currentCat.value = index
  resetList()
}

// 切换排序
function switchSort(index) {
  if (currentSort.value === index) {
    sortAsc.value = !sortAsc.value
  } else {
    currentSort.value = index
    sortAsc.value = true
  }
  resetList()
}

// 重置列表
function resetList() {
  page.value = 1
  hasMore.value = true
  productList.value = []
  loadData()
}

// 加载数据
async function loadData() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  
  try {
    const res = await getProductList({
      page: page.value,
      size: 10,
      category: currentCat.value === 0 ? '' : categories.value[currentCat.value],
      sort: currentSort.value,
      order: sortAsc.value ? 'asc' : 'desc'
    })
    const list = res.data.list || []
    
    if (page.value === 1) {
      productList.value = list
    } else {
      productList.value.push(...list)
    }
    
    hasMore.value = list.length >= 10
  } catch (e) {
    console.error('加载失败', e)
  } finally {
    loading.value = false
  }
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
  uni.navigateTo({ url: `/pages/mall/detail?id=${id}` })
}

// 初始化
loadData()
</script>

<template>
  <view class="page-mall">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @click="goSearch">
        <text class="iconfont icon-search"></text>
        <text class="search-placeholder">搜索农产品</text>
      </view>
    </view>

    <!-- 分类横向滚动 -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="category-item" v-for="(cat, index) in categories" :key="index"
        :class="{ active: currentCat === index }" @click="switchCat(index)">
        {{ cat }}
      </view>
    </scroll-view>

    <!-- 排序栏 -->
    <view class="sort-bar">
      <view class="sort-item" v-for="(sort, index) in sortTypes" :key="index"
        :class="{ active: currentSort === index }" @click="switchSort(index)">
        <text>{{ sort }}</text>
        <text class="sort-arrow" v-if="currentSort === index">
          {{ sortAsc ? '↑' : '↓' }}
        </text>
      </view>
    </view>

    <!-- 商品双列布局 -->
    <view class="product-grid">
      <view class="product-card" v-for="item in productList" :key="item.id"
        @click="goDetail(item.id)">
        <image class="product-image" :src="item.image" mode="aspectFill" />
        <view class="product-tags" v-if="item.tags && item.tags.length">
          <text class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
        </view>
        <view class="product-info">
          <text class="product-name text-ellipsis-2">{{ item.name }}</text>
          <view class="product-price-row">
            <text class="price">¥{{ item.price }}</text>
            <text class="origin-price" v-if="item.originPrice">¥{{ item.originPrice }}</text>
          </view>
          <text class="product-sales">已售{{ item.sales }}件</text>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="load-status">
      <text v-if="loading">加载中...</text>
      <text v-else-if="!hasMore">没有更多了</text>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="!productList.length && !loading">
      <text class="empty-text">暂无商品</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-mall {
  background: $bg-page;
  min-height: 100vh;
}

/* 搜索栏 */
.search-bar {
  padding: 16rpx 32rpx;
  background: $primary;
  
  .search-input {
    height: 72rpx;
    background: #fff;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    
    .search-placeholder {
      margin-left: 12rpx;
      color: $text-hint;
      font-size: 28rpx;
    }
  }
}

/* 分类滚动 */
.category-scroll {
  white-space: nowrap;
  background: #fff;
  padding: 20rpx 0;
  
  .category-item {
    display: inline-block;
    padding: 12rpx 32rpx;
    font-size: 28rpx;
    color: $text-secondary;
    border-radius: 28rpx;
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

/* 排序栏 */
.sort-bar {
  display: flex;
  background: #fff;
  padding: 16rpx 32rpx;
  border-bottom: 1rpx solid $border-light;
  
  .sort-item {
    flex: 1;
    text-align: center;
    font-size: 28rpx;
    color: $text-secondary;
    
    &.active {
      color: $primary;
      font-weight: bold;
    }
    
    .sort-arrow {
      margin-left: 4rpx;
    }
  }
}

/* 商品双列 */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 16rpx;
  
  .product-card {
    width: calc(50% - 16rpx);
    margin: 8rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: $shadow-light;
    
    .product-image {
      width: 100%;
      height: 340rpx;
    }
    
    .product-tags {
      position: absolute;
      top: 12rpx;
      left: 12rpx;
      
      .tag {
        display: inline-block;
        background: $primary;
        color: #fff;
        font-size: 20rpx;
        padding: 4rpx 12rpx;
        border-radius: 6rpx;
        margin-right: 8rpx;
      }
    }
    
    .product-info {
      padding: 16rpx;
      
      .product-name {
        font-size: 28rpx;
        color: $text-primary;
        line-height: 1.4;
        height: 80rpx;
      }
      
      .product-price-row {
        display: flex;
        align-items: baseline;
        margin-top: 12rpx;
        
        .price {
          font-size: 36rpx;
          color: $aux-red;
          font-weight: bold;
        }
        
        .origin-price {
          font-size: 24rpx;
          color: $text-hint;
          text-decoration: line-through;
          margin-left: 12rpx;
        }
      }
      
      .product-sales {
        font-size: 22rpx;
        color: $text-hint;
        margin-top: 8rpx;
        display: block;
      }
    }
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

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getServiceCategories, getServiceList } from '@/api/village'

// 分类列表
const categories = ref([])
const currentCat = ref(0)

// 办事事项列表
const serviceList = ref([])

// 加载分类
async function loadCategories() {
  try {
    const res = await getServiceCategories()
    categories.value = res.data || []
    if (categories.value.length) {
      loadServiceList()
    }
  } catch (e) {
    console.error('加载分类失败', e)
  }
}

// 加载办事事项
async function loadServiceList() {
  try {
    const res = await getServiceList({
      categoryId: categories.value[currentCat.value]?.id
    })
    serviceList.value = res.data || []
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 切换分类
function switchCat(index) {
  currentCat.value = index
  loadServiceList()
}

// 查看办事指南
function viewGuide(id) {
  uni.navigateTo({ url: `/pages/village/service-detail?id=${id}` })
}

// 在线办理
function goApply(id) {
  if (!checkLogin()) return
  uni.navigateTo({ url: `/pages/village/apply?id=${id}` })
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

onLoad(() => {
  loadCategories()
})
</script>

<template>
  <view class="page-service">
    <!-- 分类左右布局 -->
    <view class="service-layout">
      <!-- 左侧分类 -->
      <scroll-view class="cat-sidebar" scroll-y>
        <view class="cat-item" v-for="(cat, index) in categories" :key="cat.id"
          :class="{ active: currentCat === index }" @click="switchCat(index)">
          <text>{{ cat.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧事项列表 -->
      <scroll-view class="service-list" scroll-y>
        <view class="service-card" v-for="item in serviceList" :key="item.id">
          <view class="service-icon">📋</view>
          <view class="service-info">
            <text class="service-name">{{ item.name }}</text>
            <text class="service-desc">{{ item.description }}</text>
            <view class="service-meta">
              <text class="meta-time">办理时限：{{ item.duration }}</text>
            </view>
          </view>
          <view class="service-actions">
            <button class="btn-guide" @click="viewGuide(item.id)">办事指南</button>
            <button class="btn-apply" @click="goApply(item.id)">在线办理</button>
          </view>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="!serviceList.length">
          <text class="empty-text">暂无办事事项</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-service {
  background: $bg-page;
  min-height: 100vh;
}

/* 左右布局 */
.service-layout {
  display: flex;
  height: calc(100vh - var(--status-bar-height));
}

/* 左侧分类 */
.cat-sidebar {
  width: 200rpx;
  background: #fff;
  height: 100%;
  
  .cat-item {
    padding: 28rpx 16rpx;
    font-size: 26rpx;
    color: $text-secondary;
    text-align: center;
    border-left: 6rpx solid transparent;
    background: $bg-page;
    
    &.active {
      background: #fff;
      color: $primary;
      font-weight: bold;
      border-left-color: $primary;
    }
  }
}

/* 右侧列表 */
.service-list {
  flex: 1;
  height: 100%;
  padding: 16rpx;
}

.service-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: $shadow-light;
  
  .service-icon {
    font-size: 48rpx;
    margin-bottom: 12rpx;
  }
  
  .service-info {
    margin-bottom: 16rpx;
    
    .service-name {
      font-size: 30rpx;
      font-weight: 500;
      color: $text-primary;
      display: block;
    }
    
    .service-desc {
      font-size: 24rpx;
      color: $text-secondary;
      margin-top: 8rpx;
      display: block;
      @include text-ellipsis-2;
    }
    
    .service-meta {
      margin-top: 12rpx;
      
      .meta-time {
        font-size: 22rpx;
        color: $text-hint;
      }
    }
  }
  
  .service-actions {
    display: flex;
    gap: 16rpx;
    
    button {
      flex: 1;
      height: 64rpx;
      line-height: 64rpx;
      font-size: 26rpx;
      border-radius: 8rpx;
      border: none;
      
      &.btn-guide {
        background: $bg-page;
        color: $text-secondary;
      }
      
      &.btn-apply {
        background: $primary;
        color: #fff;
      }
    }
  }
}
</style>

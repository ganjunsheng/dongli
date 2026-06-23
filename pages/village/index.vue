<script setup>
import { ref } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { getNoticeList } from '@/api/village'

// 标签页
const tabs = ref(['全部', '通知', '公示', '政策'])
const currentTab = ref(0)

// 公告列表
const noticeList = ref([])
const page = ref(1)
const hasMore = ref(true)
const loading = ref(false)

// 切换标签
function switchTab(index) {
  currentTab.value = index
  page.value = 1
  noticeList.value = []
  loadData()
}

// 加载数据
async function loadData() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  
  try {
    const res = await getNoticeList({
      page: page.value,
      size: 10,
      type: currentTab.value === 0 ? '' : tabs.value[currentTab.value]
    })
    const list = res.data.list || []
    
    if (page.value === 1) {
      noticeList.value = list
    } else {
      noticeList.value.push(...list)
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
  page.value = 1
  hasMore.value = true
  loadData().then(() => {
    uni.stopPullDownRefresh()
  })
})

// 上拉加载
function onReachBottom() {
  if (hasMore.value) {
    page.value++
    loadData()
  }
}

// 查看详情
function goDetail(id) {
  uni.navigateTo({ url: `/pages/village/detail?id=${id}` })
}

// 初始化
loadData()
</script>

<template>
  <view class="page-village">
    <!-- 标签页 -->
    <view class="tabs">
      <view class="tab-item" v-for="(tab, index) in tabs" :key="index"
        :class="{ active: currentTab === index }" @click="switchTab(index)">
        <text>{{ tab }}</text>
        <view class="tab-line" v-if="currentTab === index"></view>
      </view>
    </view>

    <!-- 公告列表 -->
    <view class="notice-list">
      <view class="notice-card" v-for="item in noticeList" :key="item.id"
        @click="goDetail(item.id)">
        <view class="notice-top">
          <text class="notice-tag top" v-if="item.isTop">置顶</text>
          <text class="notice-tag urgent" v-if="item.isUrgent">紧急</text>
          <text class="notice-title">{{ item.title }}</text>
        </view>
        <text class="notice-summary">{{ item.summary }}</text>
        <view class="notice-bottom">
          <text class="notice-source">{{ item.source }}</text>
          <text class="notice-time">{{ item.time }}</text>
          <text class="notice-views">{{ item.views }}次浏览</text>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="load-status">
      <text v-if="loading">加载中...</text>
      <text v-else-if="!hasMore">没有更多了</text>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="!noticeList.length && !loading">
      <text class="empty-text">暂无公告</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-village {
  background: $bg-page;
  min-height: 100vh;
}

/* 标签页 */
.tabs {
  display: flex;
  background: #fff;
  padding: 0 32rpx;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .tab-item {
    position: relative;
    padding: 24rpx 32rpx;
    font-size: 30rpx;
    color: $text-secondary;
    
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

/* 公告卡片 */
.notice-list {
  padding: 20rpx 32rpx;
  
  .notice-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: $shadow-light;
    
    .notice-top {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
      
      .notice-tag {
        font-size: 20rpx;
        padding: 4rpx 12rpx;
        border-radius: 6rpx;
        margin-right: 12rpx;
        flex-shrink: 0;
        
        &.top {
          background: $aux-red;
          color: #fff;
        }
        
        &.urgent {
          background: #FF9800;
          color: #fff;
        }
      }
      
      .notice-title {
        font-size: 32rpx;
        font-weight: 500;
        color: $text-primary;
        @include text-ellipsis;
      }
    }
    
    .notice-summary {
      font-size: 26rpx;
      color: $text-secondary;
      line-height: 1.6;
      @include text-ellipsis-2;
      margin-bottom: 16rpx;
      display: block;
    }
    
    .notice-bottom {
      display: flex;
      align-items: center;
      font-size: 22rpx;
      color: $text-hint;
      
      .notice-source {
        margin-right: 24rpx;
      }
      
      .notice-views {
        margin-left: auto;
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

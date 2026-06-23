<script setup>
import { ref } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { getJobList } from '@/api/job'

// 当前Tab
const currentTab = ref(0)
const tabs = ref(['招工信息', '求职信息'])

// 列表数据
const jobList = ref([])
const page = ref(1)
const hasMore = ref(true)
const loading = ref(false)

// 加载数据
async function loadData() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  
  try {
    const res = await getJobList({
      page: page.value,
      size: 10,
      type: currentTab.value === 0 ? 'hire' : 'seek'
    })
    const list = res.data.list || []
    
    if (page.value === 1) {
      jobList.value = list
    } else {
      jobList.value.push(...list)
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
  jobList.value = []
  loadData()
}

// 下拉刷新
onPullDownRefresh(() => {
  resetList()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})

// 拨打电话
function callPhone(phone) {
  uni.makePhoneCall({ phoneNumber: phone })
}

// 发布
function goPublish() {
  uni.navigateTo({ url: '/pages/job/publish' })
}

// 初始化
loadData()
</script>

<template>
  <view class="page-job">
    <!-- 顶部Tab -->
    <view class="tabs">
      <view class="tab-item" v-for="(tab, index) in tabs" :key="index"
        :class="{ active: currentTab === index }" @click="switchTab(index)">
        <text>{{ tab }}</text>
        <view class="tab-line" v-if="currentTab === index"></view>
      </view>
    </view>

    <!-- 招工信息列表 -->
    <view class="job-list" v-if="currentTab === 0">
      <view class="job-card hire-card" v-for="item in jobList" :key="item.id">
        <view class="job-top">
          <text class="job-title">{{ item.title }}</text>
          <text class="job-tag urgent" v-if="item.isUrgent">急招</text>
          <text class="job-salary">{{ item.salary }}</text>
        </view>
        <view class="job-meta">
          <text class="job-location">📍 {{ item.location }}</text>
          <text class="job-duration">⏰ {{ item.duration }}</text>
        </view>
        <view class="job-desc">
          <text>{{ item.requirement }}</text>
        </view>
        <view class="job-bottom">
          <text class="job-publisher">{{ item.publisher }}</text>
          <text class="job-time">{{ item.time }}</text>
          <view class="job-action">
            <button class="btn-call" @click="callPhone(item.phone)">拨打电话</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 求职信息列表 -->
    <view class="job-list" v-if="currentTab === 1">
      <view class="job-card seek-card" v-for="item in jobList" :key="item.id">
        <view class="job-top">
          <image class="seeker-avatar" :src="item.avatar" lazy-load mode="aspectFill" />
          <view class="seeker-info">
            <text class="seeker-name">{{ item.name }} · {{ item.gender }} · {{ item.age }}岁</text>
            <text class="seeker-expect">期望：{{ item.expectJob }} · {{ item.expectSalary }}</text>
          </view>
        </view>
        <view class="job-desc">
          <text>{{ item.experience }}</text>
        </view>
        <view class="job-bottom">
          <text class="job-time">{{ item.time }}</text>
          <view class="job-action">
            <button class="btn-contact" @click="callPhone(item.phone)">联系求职者</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 发布按钮 -->
    <view class="publish-btn" @click="goPublish">
      <text class="iconfont icon-add">+</text>
      <text class="publish-text">{{ currentTab === 0 ? '发布招工' : '发布求职' }}</text>
    </view>

    <!-- 加载状态 -->
    <view class="load-status">
      <text v-if="loading">加载中...</text>
      <text v-else-if="!hasMore">没有更多了</text>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="!jobList.length && !loading">
      <text class="empty-text">暂无{{ currentTab === 0 ? '招工' : '求职' }}信息</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-job {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 180rpx;
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

/* 招工卡片 */
.job-list {
  padding: 20rpx 32rpx;
}

.job-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: $shadow-light;
  
  .job-top {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    
    .job-title {
      flex: 1;
      font-size: 32rpx;
      font-weight: 500;
      color: $text-primary;
    }
    
    .job-tag {
      font-size: 20rpx;
      padding: 4rpx 12rpx;
      border-radius: 6rpx;
      margin-left: 12rpx;
      
      &.urgent {
        background: $aux-red;
        color: #fff;
      }
    }
    
    .job-salary {
      font-size: 32rpx;
      color: $aux-red;
      font-weight: bold;
      margin-left: 16rpx;
      flex-shrink: 0;
    }
  }
  
  .job-meta {
    display: flex;
    margin-bottom: 16rpx;
    
    text {
      font-size: 24rpx;
      color: $text-secondary;
      margin-right: 24rpx;
    }
  }
  
  .job-desc {
    font-size: 26rpx;
    color: $text-secondary;
    line-height: 1.6;
    margin-bottom: 16rpx;
    @include text-ellipsis-2;
  }
  
  .job-bottom {
    display: flex;
    align-items: center;
    padding-top: 16rpx;
    border-top: 1rpx solid $border-light;
    
    .job-publisher, .job-time {
      font-size: 22rpx;
      color: $text-hint;
    }
    
    .job-time {
      margin-left: 24rpx;
    }
    
    .job-action {
      margin-left: auto;
      
      .btn-call, .btn-contact {
        background: $primary;
        color: #fff;
        font-size: 24rpx;
        padding: 8rpx 24rpx;
        border-radius: 8rpx;
        border: none;
        line-height: 1.5;
      }
    }
  }
}

/* 求职卡片 */
.seeker-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.seeker-info {
  flex: 1;
  margin-left: 16rpx;
  
  .seeker-name {
    font-size: 30rpx;
    font-weight: 500;
    color: $text-primary;
    display: block;
  }
  
  .seeker-expect {
    font-size: 24rpx;
    color: $text-secondary;
    margin-top: 8rpx;
    display: block;
  }
}

/* 发布按钮 */
.publish-btn {
  position: fixed;
  right: 40rpx;
  bottom: 200rpx;
  background: $primary;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(46, 125, 50, 0.4);
  z-index: 999;
  
  .icon-add {
    font-size: 36rpx;
    color: #fff;
    margin-right: 8rpx;
  }
  
  .publish-text {
    font-size: 26rpx;
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

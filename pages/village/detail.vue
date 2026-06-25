<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getNoticeDetail } from '@/api/village'

// 公告ID
const noticeId = ref('')

// 公告详情
const detail = ref({
  title: '',
  content: '',
  source: '',
  time: '',
  views: 0,
  images: []
})

// 相关公告
const relatedList = ref([])

// 加载数据
async function loadDetail() {
  try {
    const res = await getNoticeDetail(noticeId.value)
    detail.value = res.data || {}
    
    // 设置页面标题
    uni.setNavigationBarTitle({
      title: detail.value.title || '公告详情'
    })
  } catch (e) {
    console.error('加载失败', e)
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

// 分享
function onShareAppMessage() {
  return {
    title: detail.value.title,
    path: `/pages/village/detail?id=${noticeId.value}`
  }
}

// 返回列表
function goBack() {
  uni.navigateBack()
}

onLoad((options) => {
  if (options.id) {
    noticeId.value = options.id
    loadDetail()
  }
})
</script>

<template>
  <view class="page-detail">
    <!-- 标题区 -->
    <view class="detail-header">
      <text class="detail-title">{{ detail.title }}</text>
      <view class="detail-meta">
        <text class="meta-source">{{ detail.source }}</text>
        <text class="meta-time">{{ detail.time }}</text>
        <text class="meta-views">浏览 {{ detail.views }} 次</text>
      </view>
    </view>

    <!-- 内容区 -->
    <view class="detail-content">
      <!-- 图片 -->
      <image v-for="(img, index) in detail.images" :key="index"
        class="content-image" :src="img" lazy-load mode="widthFix" />
      
      <!-- 正文（富文本） -->
      <rich-text class="content-text" :nodes="detail.content"></rich-text>
    </view>

    <!-- 相关公告 -->
    <view class="related-section" v-if="relatedList.length">
      <text class="related-title">相关公告</text>
      <view class="related-item" v-for="item in relatedList" :key="item.id"
        @click="goDetail(item.id)">
        <text class="related-item-title">{{ item.title }}</text>
        <text class="related-item-time">{{ item.time }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="detail-footer safe-bottom">
      <button class="footer-btn share-btn" open-type="share">
        <text>分享</text>
      </button>
      <button class="footer-btn back-btn" @click="goBack">
        <text>返回列表</text>
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-detail {
  background: #fff;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

/* 标题区 */
.detail-header {
  padding: 40rpx 32rpx 28rpx;
  background: #fff;
  
  .detail-title {
    font-size: 40rpx;
    font-weight: bold;
    color: $text-primary;
    line-height: 1.5;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .detail-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12rpx 24rpx;
    
    text {
      font-size: 24rpx;
      color: $text-hint;
      background: $bg-page;
      padding: 6rpx 16rpx;
      border-radius: 6rpx;
      
      &.meta-source {
        color: $primary;
        background: $primary-bg;
      }
      
      &.meta-views {
        color: $aux-orange;
        background: #FFF3E0;
      }
    }
  }
}

/* 内容区 */
.detail-content {
  padding: 32rpx;
  background: #fff;
  margin-top: 16rpx;
  
  .content-image {
    width: 100%;
    margin-bottom: 24rpx;
    border-radius: 12rpx;
    box-shadow: $shadow-light;
  }
  
  .content-text {
    font-size: 30rpx;
    color: $text-primary;
    line-height: 2;
    
    ::v-deep p {
      margin-bottom: 20rpx;
    }
    
    ::v-deep img {
      max-width: 100% !important;
      border-radius: 12rpx;
      margin: 16rpx 0;
    }
  }
}

/* 相关公告 */
.related-section {
  padding: 32rpx;
  border-top: 16rpx solid $bg-page;
  
  .related-title {
    font-size: 32rpx;
    font-weight: bold;
    color: $text-primary;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .related-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid $border-light;
    
    .related-item-title {
      flex: 1;
      font-size: 28rpx;
      color: $text-secondary;
      @include text-ellipsis;
      margin-right: 16rpx;
    }
    
    .related-item-time {
      font-size: 22rpx;
      color: $text-hint;
      flex-shrink: 0;
    }
  }
}

/* 底部操作栏 */
.detail-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.08);
  
  .footer-btn {
    flex: 1;
    height: 84rpx;
    line-height: 84rpx;
    text-align: center;
    border-radius: 42rpx;
    font-size: 30rpx;
    font-weight: 500;
    border: none;
    
    &.share-btn {
      background: linear-gradient(135deg, $primary, $primary-dark);
      color: #fff;
      margin-right: 20rpx;
      box-shadow: 0 4rpx 12rpx rgba(46,125,50,0.3);
    }
    
    &.back-btn {
      background: $bg-page;
      color: $text-primary;
    }
  }
}
</style>

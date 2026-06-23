<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 标题
  title: {
    type: String,
    default: '',
  },
  // 左侧图标
  leftIcon: {
    type: String,
    default: 'back', // back, home, none
  },
  // 右侧图标
  rightIcon: {
    type: String,
    default: '', // search, bell, more, none
  },
  // 右侧文字
  rightText: {
    type: String,
    default: '',
  },
  // 背景色
  bgColor: {
    type: String,
    default: '#2E7D32',
  },
  // 文字颜色
  textColor: {
    type: String,
    default: '#FFFFFF',
  },
  // 是否固定
  fixed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['leftClick', 'rightClick'])

// 获取状态栏高度
const statusBarHeight = computed(() => {
  const systemInfo = uni.getSystemInfoSync()
  return systemInfo.statusBarHeight || 20
})

function handleLeftClick() {
  if (props.leftIcon === 'back') {
    uni.navigateBack()
  } else {
    emit('leftClick')
  }
}

function handleRightClick() {
  emit('rightClick')
}
</script>

<template>
  <view class="base-navbar" :class="{ fixed }" :style="{ backgroundColor: bgColor }">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 导航栏内容 -->
    <view class="navbar-content">
      <!-- 左侧 -->
      <view class="navbar-left" @click="handleLeftClick">
        <text v-if="leftIcon === 'back'" class="iconfont icon-back">←</text>
        <text v-else-if="leftIcon === 'home'" class="iconfont icon-home">⌂</text>
        <slot name="left"></slot>
      </view>
      
      <!-- 标题 -->
      <view class="navbar-title" v-if="title">
        <text :style="{ color: textColor }">{{ title }}</text>
      </view>
      <view class="navbar-title" v-else>
        <slot name="title"></slot>
      </view>
      
      <!-- 右侧 -->
      <view class="navbar-right" @click="handleRightClick">
        <text v-if="rightIcon === 'search'" class="iconfont icon-search">🔍</text>
        <text v-else-if="rightIcon === 'bell'" class="iconfont icon-bell">🔔</text>
        <text v-else-if="rightText" class="right-text" :style="{ color: textColor }">{{ rightText }}</text>
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.base-navbar {
  width: 100%;
  z-index: 999;
  
  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
}

.status-bar {
  width: 100%;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 32rpx;
}

.navbar-left, .navbar-right {
  min-width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  font-size: 36rpx;
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: 500;
  
  text {
    @include text-ellipsis;
  }
}

.right-text {
  font-size: 28rpx;
}
</style>

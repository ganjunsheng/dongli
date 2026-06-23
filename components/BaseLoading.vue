<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 加载类型
  type: {
    type: String,
    default: 'spinner', // spinner, dots, pulse
  },
  // 加载文字
  text: {
    type: String,
    default: '加载中...',
  },
  // 显示加载
  show: {
    type: Boolean,
    default: true,
  },
  // 全屏遮罩
  fullscreen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

function handleClose() {
  emit('close')
}
</script>

<template>
  <view class="base-loading" v-if="show" :class="{ 'fullscreen': fullscreen }">
    <view class="loading-content">
      <!-- 旋转加载 -->
      <view class="loading-spinner" v-if="type === 'spinner'">
        <view class="spinner-circle"></view>
      </view>
      
      <!-- 点状加载 -->
      <view class="loading-dots" v-if="type === 'dots'">
        <view class="dot"></view>
        <view class="dot"></view>
        <view class="dot"></view>
      </view>
      
      <!-- 脉冲加载 -->
      <view class="loading-pulse" v-if="type === 'pulse'">
        <view class="pulse-circle"></view>
      </view>
      
      <text class="loading-text" v-if="text">{{ text }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.base-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  
  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: 9999;
  }
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 旋转加载 */
.loading-spinner {
  .spinner-circle {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid $border-light;
    border-top-color: $primary;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

/* 点状加载 */
.loading-dots {
  display: flex;
  align-items: center;
  
  .dot {
    width: 16rpx;
    height: 16rpx;
    background: $primary;
    border-radius: 50%;
    margin: 0 8rpx;
    animation: dotPulse 1.4s ease-in-out infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

/* 脉冲加载 */
.loading-pulse {
  .pulse-circle {
    width: 60rpx;
    height: 60rpx;
    background: $primary;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

.loading-text {
  font-size: 26rpx;
  color: $text-hint;
  margin-top: 20rpx;
}

/* 动画 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.6;
  }
}
</style>

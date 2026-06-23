<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 标题
  title: {
    type: String,
    default: '',
  },
  // 副标题
  subtitle: {
    type: String,
    default: '',
  },
  // 右侧文字
  rightText: {
    type: String,
    default: '',
  },
  // 显示箭头
  showArrow: {
    type: Boolean,
    default: true,
  },
  // 显示边框
  bordered: {
    type: Boolean,
    default: true,
  },
  // 内边距
  padding: {
    type: String,
    default: '28rpx 32rpx',
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<template>
  <view class="base-list-item" :class="{ bordered: bordered, disabled: disabled }" 
    :style="{ padding: padding }" @click="handleClick">
    <view class="item-left">
      <slot name="icon"></slot>
      <view class="item-text" v-if="title || subtitle">
        <text class="item-title" v-if="title">{{ title }}</text>
        <text class="item-subtitle" v-if="subtitle">{{ subtitle }}</text>
      </view>
      <slot></slot>
    </view>
    <view class="item-right">
      <text class="item-right-text" v-if="rightText">{{ rightText }}</text>
      <slot name="right"></slot>
      <text class="item-arrow" v-if="showArrow">></text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.base-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  transition: background 0.2s;
  
  &:active {
    background: $bg-hover;
  }
  
  &.bordered {
    border-bottom: 1rpx solid $border-light;
  }
  
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
}

.item-text {
  display: flex;
  flex-direction: column;
  margin-left: 16rpx;
  overflow: hidden;
}

.item-title {
  font-size: 30rpx;
  color: $text-primary;
  @include text-ellipsis;
}

.item-subtitle {
  font-size: 24rpx;
  color: $text-hint;
  margin-top: 4rpx;
  @include text-ellipsis;
}

.item-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.item-right-text {
  font-size: 28rpx;
  color: $text-hint;
  margin-right: 8rpx;
}

.item-arrow {
  font-size: 28rpx;
  color: $text-hint;
}
</style>

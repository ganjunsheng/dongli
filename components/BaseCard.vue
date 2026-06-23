<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: '24rpx'
  },
  radius: {
    type: String,
    default: '16rpx'
  },
  shadow: {
    type: Boolean,
    default: true
  },
  margin: {
    type: String,
    default: '0 0 20rpx 0'
  }
})

const emit = defineEmits(['click'])

const cardStyle = computed(() => {
  return {
    padding: props.padding,
    borderRadius: props.radius,
    margin: props.margin,
    boxShadow: props.shadow ? '0 2rpx 12rpx rgba(0,0,0,0.08)' : 'none'
  }
})

function handleClick() {
  emit('click')
}
</script>

<template>
  <view class="base-card" :style="cardStyle" @click="handleClick">
    <view class="card-header" v-if="title">
      <text class="card-title">{{ title }}</text>
      <slot name="header-right"></slot>
    </view>
    <slot></slot>
  </view>
</template>

<style lang="scss" scoped>
.base-card {
  background: #fff;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $text-primary;
}
</style>

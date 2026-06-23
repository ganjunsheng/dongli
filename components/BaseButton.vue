<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'primary', // primary, outline, text, danger
    validator: (val) => ['primary', 'outline', 'text', 'danger'].includes(val)
  },
  size: {
    type: String,
    default: 'large', // large, medium, small
    validator: (val) => ['large', 'medium', 'small'].includes(val)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const btnClass = computed(() => {
  return [
    'base-btn',
    `btn-${props.type}`,
    `btn-${props.size}`,
    {
      'btn-disabled': props.disabled,
      'btn-block': props.block,
      'btn-round': props.round
    }
  ]
})

function handleClick() {
  if (props.disabled || props.loading) return
  emit('click')
}
</script>

<template>
  <button :class="btnClass" @click="handleClick" :disabled="disabled">
    <text class="btn-loading" v-if="loading">⏳</text>
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s;
  
  &::after {
    border: none;
  }
}

/* 类型样式 */
.btn-primary {
  background: $primary;
  color: #fff;
  
  &:active {
    background: $primary-dark;
  }
}

.btn-outline {
  background: transparent;
  color: $primary;
  border: 2rpx solid $primary;
  
  &:active {
    background: $primary-bg;
  }
}

.btn-text {
  background: transparent;
  color: $primary;
  padding: 0;
  
  &:active {
    opacity: 0.7;
  }
}

.btn-danger {
  background: $aux-red;
  color: #fff;
  
  &:active {
    background: darken($aux-red, 10%);
  }
}

/* 尺寸样式 */
.btn-large {
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  padding: 0 48rpx;
}

.btn-medium {
  height: 72rpx;
  line-height: 72rpx;
  font-size: 28rpx;
  padding: 0 32rpx;
}

.btn-small {
  height: 56rpx;
  line-height: 56rpx;
  font-size: 24rpx;
  padding: 0 24rpx;
}

/* 圆角 */
.btn-round {
  border-radius: 999rpx;
}

.btn-large:not(.btn-round) {
  border-radius: 16rpx;
}

.btn-medium:not(.btn-round) {
  border-radius: 12rpx;
}

.btn-small:not(.btn-round) {
  border-radius: 8rpx;
}

/* 禁用状态 */
.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 块级按钮 */
.btn-block {
  display: flex;
  width: 100%;
}

/* 加载态 */
.btn-loading {
  margin-right: 8rpx;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

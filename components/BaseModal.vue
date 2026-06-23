<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  // 是否显示
  show: {
    type: Boolean,
    default: false,
  },
  // 标题
  title: {
    type: String,
    default: '',
  },
  // 内容
  content: {
    type: String,
    default: '',
  },
  // 显示取消按钮
  showCancel: {
    type: Boolean,
    default: true,
  },
  // 取消按钮文字
  cancelText: {
    type: String,
    default: '取消',
  },
  // 确认按钮文字
  confirmText: {
    type: String,
    default: '确定',
  },
  // 显示关闭按钮
  closable: {
    type: Boolean,
    default: true,
  },
  // 宽度
  width: {
    type: String,
    default: '80%',
  },
})

const emit = defineEmits(['update:show', 'confirm', 'cancel', 'close'])

// 监听 show 变化
watch(() => props.show, (val) => {
  if (val) {
    // 禁止背景滚动
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  emit('update:show', false)
}

function handleClose() {
  emit('close')
  emit('update:show', false)
}

function handleOverlayClick() {
  if (props.closable) {
    handleClose()
  }
}
</script>

<template>
  <view class="base-modal" v-if="show">
    <!-- 遮罩层 -->
    <view class="modal-overlay" @click="handleOverlayClick"></view>
    
    <!-- 弹窗内容 -->
    <view class="modal-content" :style="{ width: width }">
      <!-- 标题栏 -->
      <view class="modal-header" v-if="title">
        <text class="modal-title">{{ title }}</text>
        <text class="modal-close" v-if="closable" @click="handleClose">×</text>
      </view>
      
      <!-- 内容区 -->
      <view class="modal-body">
        <slot>
          <text class="modal-text">{{ content }}</text>
        </slot>
      </view>
      
      <!-- 按钮栏 -->
      <view class="modal-footer">
        <button class="modal-btn cancel-btn" v-if="showCancel" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="modal-btn confirm-btn" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.base-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  z-index: 1;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid $border-light;
  
  .modal-title {
    font-size: 34rpx;
    font-weight: bold;
    color: $text-primary;
    flex: 1;
  }
  
  .modal-close {
    font-size: 40rpx;
    color: $text-hint;
    padding: 0 16rpx;
  }
}

.modal-body {
  padding: 32rpx;
  overflow-y: auto;
  flex: 1;
  
  .modal-text {
    font-size: 30rpx;
    color: $text-secondary;
    line-height: 1.6;
  }
}

.modal-footer {
  display: flex;
  border-top: 1rpx solid $border-light;
  
  .modal-btn {
    flex: 1;
    height: 96rpx;
    line-height: 96rpx;
    text-align: center;
    font-size: 32rpx;
    border: none;
    background: transparent;
    
    &::after {
      border: none;
    }
    
    &.cancel-btn {
      color: $text-secondary;
      border-right: 1rpx solid $border-light;
    }
    
    &.confirm-btn {
      color: $primary;
      font-weight: bold;
    }
    
    &:active {
      background: $bg-hover;
    }
  }
}
</style>

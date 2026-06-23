<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 图标类型
  type: {
    type: String,
    default: 'default', // default, search, network, login
  },
  // 提示文字
  text: {
    type: String,
    default: '暂无数据',
  },
  // 按钮文字
  btnText: {
    type: String,
    default: '',
  },
  // 显示按钮
  showBtn: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['btnClick'])

// 根据类型返回图标
const iconMap = {
  default: '📭',
  search: '🔍',
  network: '📶',
  login: '👤',
}

const currentIcon = computed(() => {
  return iconMap[props.type] || iconMap.default
})

function handleBtnClick() {
  emit('btnClick')
}
</script>

<template>
  <view class="base-empty">
    <text class="empty-icon">{{ currentIcon }}</text>
    <text class="empty-text">{{ text }}</text>
    <button
      v-if="showBtn && btnText"
      class="empty-btn"
      @click="handleBtnClick"
    >
      {{ btnText }}
    </button>
  </view>
</template>

<style lang="scss" scoped>
.base-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: $text-hint;
  margin-bottom: 32rpx;
}

.empty-btn {
  background: $primary;
  color: #fff;
  font-size: 28rpx;
  padding: 16rpx 48rpx;
  border-radius: 40rpx;
  border: none;
}
</style>

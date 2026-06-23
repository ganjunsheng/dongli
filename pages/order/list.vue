<script setup>
import { ref, computed, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getOrderList, cancelOrder, payOrder } from '@/api/mall'

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'unpaid', label: '待付款' },
  { key: 'unshipped', label: '待发货' },
  { key: 'unreceived', label: '待收货' },
  { key: 'refund', label: '退款/售后' }
]
const currentTab = ref('all')
const orders = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

// 状态映射
const statusMap = {
  '待支付': 'unpaid',
  '已支付': 'unshipped',
  '已发货': 'unreceived',
  '已完成': 'all',
  '已取消': 'all'
}

// 根据 tab 过滤订单
const filteredOrders = computed(() => {
  if (currentTab.value === 'all') return orders.value
  return orders.value.filter(o => statusMap[o.status] === currentTab.value)
})

// 加载订单列表
async function loadOrders() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getOrderList({ page: page.value, size: 20 })
    const list = res.data && res.data.list ? res.data.list : (Array.isArray(res.data) ? res.data : [])
    if (page.value === 1) {
      orders.value = list
    } else {
      orders.value = orders.value.concat(list)
    }
    hasMore.value = list.length >= 20
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 切换 tab
function switchTab(key) {
  currentTab.value = key
}

// 支付订单
async function handlePay(order) {
  uni.showLoading({ title: '支付中...' })
  try {
    await payOrder(order.id, 'wechat')
    uni.hideLoading()
    uni.showToast({ title: '支付成功', icon: 'success' })
    order.status = '已支付'
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '支付失败', icon: 'none' })
  }
}

// 取消订单
async function handleCancel(order) {
  uni.showModal({
    title: '提示',
    content: '确定取消该订单？',
    success: async (modalRes) => {
      if (modalRes.confirm) {
        try {
          await cancelOrder(order.id)
          order.status = '已取消'
          uni.showToast({ title: '已取消', icon: 'success' })
        } catch (e) {
          uni.showToast({ title: '取消失败', icon: 'none' })
        }
      }
    }
  })
}

// 确认收货
function handleConfirm(order) {
  uni.showModal({
    title: '确认收货',
    content: '确定已收到商品？',
    success: () => {
      order.status = '已完成'
      uni.showToast({ title: '收货成功', icon: 'success' })
    }
  })
}

// 查看详情
function goDetail(id) {
  uni.navigateTo({ url: `/pages/order/detail?id=${id}` })
}

// 去商城逛逛
function goMall() {
  uni.switchTab({ url: '/pages/mall/index' })
}

// 获取状态文字样式
function getStatusClass(status) {
  switch (status) {
    case '待支付': return 'status-unpaid'
    case '已支付': return 'status-paid'
    case '已发货': return 'status-shipped'
    case '已完成': return 'status-done'
    case '已取消': return 'status-cancel'
    default: return ''
  }
}

// 加载更多
function onReachBottom() {
  if (hasMore.value && !loading.value) {
    page.value++
    loadOrders()
  }
}

onLoad((options) => {
  if (options && options.type && tabs.some(t => t.key === options.type)) {
    currentTab.value = options.type
  }
})

onShow(() => {
  page.value = 1
  hasMore.value = true
  loadOrders()
})
</script>

<template>
  <view class="page-order">
    <!-- 标签栏 -->
    <view class="tabs-bar">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: currentTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list" v-if="filteredOrders.length > 0">
      <view class="order-card" v-for="order in filteredOrders" :key="order.id">
        <!-- 订单头部 -->
        <view class="order-header" @click="goDetail(order.id)">
          <text class="order-id">订单号：{{ order.id }}</text>
          <text class="order-status" :class="getStatusClass(order.status)">{{ order.status }}</text>
        </view>

        <!-- 商品信息 -->
        <view class="order-goods" @click="goDetail(order.id)">
          <view class="goods-item" v-for="(item, idx) in (order.items || [])" :key="idx">
            <image class="goods-img" :src="item.image" lazy-load mode="aspectFill" />
            <view class="goods-info">
              <text class="goods-name">{{ item.name || '商品名称' }}</text>
              <text class="goods-spec" v-if="item.spec">{{ item.spec }}</text>
              <view class="goods-price-row">
                <text class="goods-price">¥{{ item.price }}</text>
                <text class="goods-count">x{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 合计 -->
        <view class="order-total">
          <text>共 {{ (order.items || []).reduce((s, i) => s + (i.quantity || 1), 0) }} 件</text>
          <text>合计：</text>
          <text class="total-price">¥{{ order.totalAmount || order.total || 0 }}</text>
        </view>

        <!-- 操作按钮 -->
        <view class="order-actions">
          <template v-if="order.status === '待支付'">
            <button class="btn-cancel" size="mini" @click="handleCancel(order)">取消订单</button>
            <button class="btn-pay" size="mini" @click="handlePay(order)">立即支付</button>
          </template>
          <template v-else-if="order.status === '已发货'">
            <button class="btn-confirm" size="mini" @click="handleConfirm(order)">确认收货</button>
          </template>
          <template v-else-if="order.status === '已完成'">
            <button class="btn-default" size="mini" @click="goDetail(order.id)">查看详情</button>
          </template>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty" v-else-if="!loading">
      <image class="empty-img" src="/static/images/default/avatar.png" mode="aspectFit" />
      <text class="empty-text">暂无相关订单</text>
      <button class="empty-btn" size="mini" @click="goMall">去逛逛</button>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="filteredOrders.length > 0">
      <text v-if="loading">加载中...</text>
      <text v-else-if="!hasMore">— 没有更多了 —</text>
    </view>

    <!-- 底部安全区 -->
    <view class="safe-bottom"></view>
  </view>
</template>

<style lang="scss" scoped>
.page-order {
  background: #f5f5f5;
  min-height: 100vh;
}

/* 标签栏 */
.tabs-bar {
  background: #fff;
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: #666;
    border-bottom: 4rpx solid transparent;

    &.active {
      color: #2E7D32;
      border-bottom-color: #2E7D32;
      font-weight: bold;
    }
  }
}

/* 订单卡片 */
.order-list {
  padding: 20rpx;
}

.order-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .order-id {
    font-size: 26rpx;
    color: #999;
  }

  .order-status {
    font-size: 26rpx;
    font-weight: bold;

    &.status-unpaid { color: #E6A23C; }
    &.status-paid { color: #409EFF; }
    &.status-shipped { color: #E6A23C; }
    &.status-done { color: #67C23A; }
    &.status-cancel { color: #999; }
  }
}

.order-goods {
  padding: 20rpx 24rpx;
}

.goods-item {
  display: flex;
  margin-bottom: 16rpx;

  &:last-child { margin-bottom: 0; }

  .goods-img {
    width: 140rpx;
    height: 140rpx;
    border-radius: 12rpx;
    background: #f5f5f5;
    flex-shrink: 0;
  }

  .goods-info {
    flex: 1;
    margin-left: 16rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .goods-name {
      font-size: 28rpx;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .goods-spec {
      font-size: 24rpx;
      color: #999;
    }

    .goods-price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-price {
        font-size: 28rpx;
        color: #E63946;
        font-weight: bold;
      }

      .goods-count {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.order-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20rpx 24rpx;
  border-top: 1rpx solid #f0f0f0;
  font-size: 26rpx;
  color: #666;
  gap: 8rpx;

  .total-price {
    font-size: 30rpx;
    color: #E63946;
    font-weight: bold;
  }
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  border-top: 1rpx solid #f0f0f0;

  button {
    font-size: 24rpx;
    padding: 12rpx 28rpx;
    border-radius: 32rpx;

    &.btn-cancel {
      background: #fff;
      color: #999;
      border: 1rpx solid #ddd;
    }

    &.btn-pay {
      background: #E63946;
      color: #fff;
    }

    &.btn-confirm {
      background: #2E7D32;
      color: #fff;
    }

    &.btn-default {
      background: #fff;
      color: #2E7D32;
      border: 1rpx solid #2E7D32;
    }
  }
}

/* 空状态 */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 160rpx;

  .empty-img {
    width: 200rpx;
    height: 200rpx;
    opacity: 0.4;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin: 24rpx 0 32rpx;
  }

  .empty-btn {
    background: #2E7D32;
    color: #fff;
    border-radius: 32rpx;
    padding: 12rpx 48rpx;
  }
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 32rpx;
  font-size: 24rpx;
  color: #999;
}

.safe-bottom {
  height: calc(env(safe-area-inset-bottom) + 40rpx);
}
</style>

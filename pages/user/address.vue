<script setup>
import { ref, onMounted } from 'vue'
import { getAddressList, deleteAddress } from '@/api/user'

// 地址列表
const addressList = ref([])

// 加载地址列表
async function loadAddressList() {
  try {
    const res = await getAddressList()
    addressList.value = res.data || []
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 添加地址
function goAddAddress() {
  uni.navigateTo({ url: '/pages/user/address-edit' })
}

// 编辑地址
function goEditAddress(id) {
  uni.navigateTo({ url: `/pages/user/address-edit?id=${id}` })
}

// 删除地址
function handleDelete(id) {
  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteAddress(id)
          uni.showToast({ title: '删除成功', icon: 'success' })
          loadAddressList()
        } catch (e) {
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}

// 设为默认
async function setDefault(id) {
  try {
    await updateAddress(id, { isDefault: true })
    uni.showToast({ title: '设置成功', icon: 'success' })
    loadAddressList()
  } catch (e) {
    uni.showToast({ title: '设置失败', icon: 'none' })
  }
}

onMounted(() => {
  loadAddressList()
})
</script>

<template>
  <view class="page-address">
    <!-- 地址列表 -->
    <view class="address-list">
      <view class="address-card" v-for="item in addressList" :key="item.id">
        <view class="address-info" @click="goEditAddress(item.id)">
          <view class="address-top">
            <text class="address-name">{{ item.name }}</text>
            <text class="address-phone">{{ item.phone }}</text>
            <text class="address-default" v-if="item.isDefault">默认</text>
          </view>
          <text class="address-detail">
            {{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}
          </text>
        </view>
        <view class="address-actions">
          <text class="action-set" v-if="!item.isDefault" @click="setDefault(item.id)">设为默认</text>
          <text class="action-edit" @click="goEditAddress(item.id)">编辑</text>
          <text class="action-delete" @click="handleDelete(item.id)">删除</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="!addressList.length">
      <text class="empty-text">暂无收货地址</text>
    </view>

    <!-- 添加按钮 -->
    <view class="add-section">
      <button class="add-btn" @click="goAddAddress">+ 添加新地址</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-address {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

/* 地址列表 */
.address-list {
  padding: 20rpx 32rpx;
}

.address-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: $shadow-light;
  
  .address-info {
    margin-bottom: 16rpx;
    
    .address-top {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
      
      .address-name {
        font-size: 32rpx;
        font-weight: 500;
        color: $text-primary;
        margin-right: 16rpx;
      }
      
      .address-phone {
        font-size: 28rpx;
        color: $text-secondary;
      }
      
      .address-default {
        font-size: 20rpx;
        background: $primary;
        color: #fff;
        padding: 4rpx 12rpx;
        border-radius: 6rpx;
        margin-left: 16rpx;
      }
    }
    
    .address-detail {
      font-size: 26rpx;
      color: $text-secondary;
      line-height: 1.6;
      display: block;
    }
  }
  
  .address-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 16rpx;
    border-top: 1rpx solid $border-light;
    
    text {
      font-size: 24rpx;
      margin-left: 32rpx;
      padding: 8rpx 0;
      
      &.action-set {
        color: $primary;
      }
      
      &.action-edit {
        color: $text-secondary;
      }
      
      &.action-delete {
        color: $aux-red;
      }
    }
  }
}

/* 添加按钮 */
.add-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.08);
  
  .add-btn {
    height: 88rpx;
    line-height: 88rpx;
    background: $primary;
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    border: none;
  }
}
</style>

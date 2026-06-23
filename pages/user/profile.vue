<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getUserInfo, updateUserInfo, uploadAvatar } from '@/api/user'

// 用户信息
const userInfo = ref({
  avatar: '/static/images/default/avatar.png',
  nickname: '',
  phone: '',
  gender: 0, // 0未知 1男 2女
  birthday: '',
  address: ''
})

// 性别选项
const genderOptions = ['未知', '男', '女']

// 加载用户信息
async function loadUserInfo() {
  try {
    const res = await getUserInfo()
    userInfo.value = res.data || {}
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 选择头像
function chooseAvatar() {
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    success: async (res) => {
      const tempFilePath = res.tempFiles[0].tempFilePath
      
      try {
        uni.showLoading({ title: '上传中...' })
        const uploadRes = await uploadAvatar(tempFilePath)
        userInfo.value.avatar = uploadRes.data.url
        uni.hideLoading()
        uni.showToast({ title: '上传成功', icon: 'success' })
      } catch (e) {
        uni.hideLoading()
        uni.showToast({ title: '上传失败', icon: 'none' })
      }
    }
  })
}

// 选择性别
function chooseGender() {
  uni.showActionSheet({
    itemList: genderOptions,
    success: (res) => {
      userInfo.value.gender = res.tapIndex
    }
  })
}

// 选择生日
function chooseBirthday() {
  uni.showDatePicker({
    mode: 'date',
    startDate: '1940-01-01',
    endDate: '2020-12-31',
    success: (res) => {
      userInfo.value.birthday = res.date
    }
  })
}

// 保存资料
async function saveProfile() {
  if (!userInfo.value.nickname) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }
  
  try {
    uni.showLoading({ title: '保存中...' })
    await updateUserInfo(userInfo.value)
    uni.hideLoading()
    
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}

onLoad(() => {
  loadUserInfo()
})
</script>

<template>
  <view class="page-profile">
    <!-- 头像 -->
    <view class="avatar-section" @click="chooseAvatar">
      <image class="avatar-image" :src="userInfo.avatar" mode="aspectFill" />
      <text class="avatar-tip">点击更换头像</text>
    </view>

    <!-- 表单 -->
    <view class="form-section">
      <view class="form-item" @click="goEdit('nickname')">
        <text class="form-label">昵称</text>
        <view class="form-value">
          <text>{{ userInfo.nickname || '未设置' }}</text>
          <text class="form-arrow">></text>
        </view>
      </view>

      <view class="form-item" @click="chooseGender">
        <text class="form-label">性别</text>
        <view class="form-value">
          <text>{{ genderOptions[userInfo.gender] }}</text>
          <text class="form-arrow">></text>
        </view>
      </view>

      <view class="form-item" @click="chooseBirthday">
        <text class="form-label">生日</text>
        <view class="form-value">
          <text>{{ userInfo.birthday || '未设置' }}</text>
          <text class="form-arrow">></text>
        </view>
      </view>

      <view class="form-item" @click="goEdit('address')">
        <text class="form-label">地址</text>
        <view class="form-value">
          <text>{{ userInfo.address || '未设置' }}</text>
          <text class="form-arrow">></text>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">手机号</text>
        <view class="form-value">
          <text>{{ userInfo.phone || '未绑定' }}</text>
          <text class="form-arrow">></text>
        </view>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="save-section">
      <button class="save-btn" @click="saveProfile">保存资料</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-profile {
  background: $bg-page;
  min-height: 100vh;
}

/* 头像区 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 0;
  background: #fff;
  margin-bottom: 20rpx;
  
  .avatar-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    margin-bottom: 16rpx;
  }
  
  .avatar-tip {
    font-size: 24rpx;
    color: $text-hint;
  }
}

/* 表单区 */
.form-section {
  background: #fff;
  margin-bottom: 20rpx;
  
  .form-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 32rpx;
    border-bottom: 1rpx solid $border-light;
    
    &:last-child {
      border-bottom: none;
    }
    
    .form-label {
      font-size: 30rpx;
      color: $text-primary;
      width: 160rpx;
    }
    
    .form-value {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      
      text {
        font-size: 28rpx;
        color: $text-hint;
        margin-right: 12rpx;
      }
      
      .form-arrow {
        color: $text-hint;
        font-size: 28rpx;
      }
    }
  }
}

/* 保存按钮 */
.save-section {
  padding: 40rpx 32rpx;
  
  .save-btn {
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

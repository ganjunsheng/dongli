<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { publishHire, publishSeek, getJobDetail, updateJob } from '@/api/job'

// 是否为编辑模式
const isEdit = ref(false)
const itemId = ref('')
const currentType = ref('hire') // hire: 招工, seek: 求职

// 招工表单
const hireForm = ref({
  title: '',
  salary: '',
  location: '',
  duration: '',
  requirement: '',
  phone: ''
})

// 求职表单
const seekForm = ref({
  name: '',
  gender: 0, // 0: 未知, 1: 男, 2: 女
  age: '',
  expectJob: '',
  expectSalary: '',
  experience: '',
  phone: ''
})

// 性别选项
const genderOptions = ['未知', '男', '女']

// 加载详情（编辑模式）
async function loadDetail() {
  if (!itemId.value) return
  try {
    const res = await getJobDetail(itemId.value)
    const data = res.data || {}
    if (currentType.value === 'hire') {
      hireForm.value = data
    } else {
      seekForm.value = data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 选择性别
function selectGender() {
  uni.showActionSheet({
    itemList: genderOptions,
    success: (res) => {
      seekForm.value.gender = res.tapIndex
    }
  })
}

// 切换类型
function switchType(type) {
  currentType.value = type
}

// 提交
async function handleSubmit() {
  if (!checkLogin()) return
  
  try {
    uni.showLoading({ title: '提交中...' })
    
    if (currentType.value === 'hire') {
      // 验证招工表单
      if (!hireForm.value.title) {
        uni.hideLoading()
        uni.showToast({ title: '请输入岗位标题', icon: 'none' })
        return
      }
      if (!hireForm.value.phone) {
        uni.hideLoading()
        uni.showToast({ title: '请输入联系电话', icon: 'none' })
        return
      }
      
      if (isEdit.value) {
        await updateJob(itemId.value, hireForm.value)
      } else {
        await publishHire(hireForm.value)
      }
    } else {
      // 验证求职表单
      if (!seekForm.value.name) {
        uni.hideLoading()
        uni.showToast({ title: '请输入姓名', icon: 'none' })
        return
      }
      if (!seekForm.value.phone) {
        uni.hideLoading()
        uni.showToast({ title: '请输入联系电话', icon: 'none' })
        return
      }
      
      if (isEdit.value) {
        await updateJob(itemId.value, seekForm.value)
      } else {
        await publishSeek(seekForm.value)
      }
    }
    
    uni.hideLoading()
    uni.showToast({ title: '发布成功', icon: 'success' })
    
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '发布失败', icon: 'none' })
  }
}

// 检查登录
function checkLogin() {
  const token = uni.getStorageSync('token')
  if (!token) {
    uni.navigateTo({ url: '/pages/user/login' })
    return false
  }
  return true
}

onLoad((options) => {
  if (options.type) {
    currentType.value = options.type
  }
  if (options.id) {
    isEdit.value = true
    itemId.value = options.id
    loadDetail()
  }
})
</script>

<template>
  <view class="page-job-publish">
    <!-- 类型切换 -->
    <view class="type-tabs">
      <view class="type-tab" :class="{ active: currentType === 'hire' }" @click="switchType('hire')">
        <text>发布招工</text>
      </view>
      <view class="type-tab" :class="{ active: currentType === 'seek' }" @click="switchType('seek')">
        <text>发布求职</text>
      </view>
    </view>

    <!-- 招工表单 -->
    <view class="form-section" v-if="currentType === 'hire'">
      <view class="form-item">
        <text class="form-label">岗位标题</text>
        <input class="form-input" v-model="hireForm.title" placeholder="如：采摘工/建筑工" />
      </view>
      <view class="form-item">
        <text class="form-label">薪资待遇</text>
        <input class="form-input" v-model="hireForm.salary" placeholder="如：120元/天" />
      </view>
      <view class="form-item">
        <text class="form-label">工作地点</text>
        <input class="form-input" v-model="hireForm.location" placeholder="请输入工作地点" />
      </view>
      <view class="form-item">
        <text class="form-label">工作时间</text>
        <input class="form-input" v-model="hireForm.duration" placeholder="如：1-2个月" />
      </view>
      <view class="form-item">
        <text class="form-label">岗位要求</text>
        <textarea class="form-textarea" v-model="hireForm.requirement" placeholder="请输入岗位要求" />
      </view>
      <view class="form-item">
        <text class="form-label">联系电话</text>
        <input class="form-input" v-model="hireForm.phone" placeholder="请输入联系电话" type="number" />
      </view>
    </view>

    <!-- 求职表单 -->
    <view class="form-section" v-if="currentType === 'seek'">
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input class="form-input" v-model="seekForm.name" placeholder="请输入姓名" />
      </view>
      <view class="form-item" @click="selectGender">
        <text class="form-label">性别</text>
        <view class="form-value">
          <text>{{ genderOptions[seekForm.gender] }}</text>
          <text class="form-arrow">></text>
        </view>
      </view>
      <view class="form-item">
        <text class="form-label">年龄</text>
        <input class="form-input" v-model="seekForm.age" placeholder="请输入年龄" type="number" />
      </view>
      <view class="form-item">
        <text class="form-label">期望岗位</text>
        <input class="form-input" v-model="seekForm.expectJob" placeholder="如：家政/保洁" />
      </view>
      <view class="form-item">
        <text class="form-label">期望薪资</text>
        <input class="form-input" v-model="seekForm.expectSalary" placeholder="如：3000元/月" />
      </view>
      <view class="form-item">
        <text class="form-label">工作经历</text>
        <textarea class="form-textarea" v-model="seekForm.experience" placeholder="请输入工作经历" />
      </view>
      <view class="form-item">
        <text class="form-label">联系电话</text>
        <input class="form-input" v-model="seekForm.phone" placeholder="请输入联系电话" type="number" />
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-btn" @click="handleSubmit">
        {{ isEdit ? '保存修改' : '发布' }}
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-job-publish {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

/* 类型切换 */
.type-tabs {
  display: flex;
  background: #fff;
  margin-bottom: 20rpx;
  
  .type-tab {
    flex: 1;
    text-align: center;
    padding: 24rpx 0;
    font-size: 30rpx;
    color: $text-secondary;
    position: relative;
    
    &.active {
      color: $primary;
      font-weight: bold;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 48rpx;
        height: 4rpx;
        background: $primary;
        border-radius: 2rpx;
      }
    }
  }
}

/* 表单区 */
.form-section {
  background: #fff;
  margin-bottom: 20rpx;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid $border-light;
  
  &:last-child {
    border-bottom: none;
  }
  
  .form-label {
    font-size: 30rpx;
    color: $text-primary;
    width: 160rpx;
    flex-shrink: 0;
  }
  
  .form-input {
    flex: 1;
    font-size: 28rpx;
    color: $text-primary;
  }
  
  .form-textarea {
    flex: 1;
    font-size: 28rpx;
    color: $text-primary;
    height: 200rpx;
  }
  
  .form-value {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    text {
      font-size: 28rpx;
      color: $text-primary;
    }
    
    .form-arrow {
      font-size: 28rpx;
      color: $text-hint;
    }
  }
}

/* 提交按钮 */
.submit-section {
  padding: 40rpx 32rpx;
  
  .submit-btn {
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

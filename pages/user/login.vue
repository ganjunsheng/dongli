<script setup>
import { ref, onUnmounted } from 'vue'
import { login } from '@/api/user'
import { getPhoneNumber } from '@/utils/auth'

// 登录方式
const loginType = ref('phone') // phone, wechat

// 手机号登录
const phone = ref('')
const code = ref('')
const codeText = ref('获取验证码')
const codeTimer = ref(null)

// 协议勾选
const agreeProtocol = ref(false)

// 获取验证码
function getCode() {
  if (codeTimer.value) return
  
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  
  // 模拟发送验证码
  uni.showToast({ title: '验证码已发送', icon: 'success' })
  
  let count = 60
  codeTimer.value = setInterval(() => {
    count--
    codeText.value = `${count}秒后重发`
    if (count <= 0) {
      clearInterval(codeTimer.value)
      codeTimer.value = null
      codeText.value = '获取验证码'
    }
  }, 1000)
}

// 手机号登录
async function phoneLogin() {
  if (!agreeProtocol.value) {
    uni.showToast({ title: '请同意用户协议和隐私政策', icon: 'none' })
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  
  if (!code.value) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return
  }
  
  try {
    // 先调用 uni.login 获取微信 code（供后端换取 openId）
    let wxCode = ''
    // #ifdef MP-WEIXIN
    const loginRes = await new Promise((resolve, reject) => {
      uni.login({ success: resolve, fail: reject })
    })
    wxCode = loginRes.code
    // #endif

    const res = await login({ phone: phone.value, code: code.value, wxCode })
    // 后端返回: { code:0, data: { token, nickname, avatar, phone, ... } }
    const userData = { ...res.data }
    delete userData.token
    uni.setStorageSync('token', res.data.token)
    uni.setStorageSync('userInfo', userData)
    
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    uni.showToast({ title: '登录失败', icon: 'none' })
  }
}

// 微信一键登录
function wechatLogin() {
  if (!agreeProtocol.value) {
    uni.showToast({ title: '请同意用户协议和隐私政策', icon: 'none' })
    return
  }
  
  // #ifdef MP-WEIXIN
  // getUserProfile 必须由用户点击同步触发，不能用 await
  uni.getUserProfile({
    desc: '用于完善用户资料',
    success: (profileRes) => {
      // 获取到用户信息后，再调用 uni.login
      uni.login({
        provider: 'weixin',
        success: async (loginRes) => {
          try {
            const res = await login({ 
              code: loginRes.code,
              userInfo: profileRes.userInfo || {}
            })
            // 后端返回: { code:0, data: { token, nickname, avatar, phone, ... } }
            const userData = { ...res.data }
            delete userData.token
            uni.setStorageSync('token', res.data.token)
            uni.setStorageSync('userInfo', userData)
            
            uni.showToast({ title: '登录成功', icon: 'success' })
            setTimeout(() => { uni.navigateBack() }, 1500)
          } catch (e) {
            uni.showToast({ title: '登录失败', icon: 'none' })
          }
        },
        fail: () => {
          uni.showToast({ title: '微信登录失败', icon: 'none' })
        }
      })
    },
    fail: () => {
      // 用户拒绝授权，仍尝试静默登录（只拿 code，不带用户信息）
      uni.login({
        provider: 'weixin',
        success: async (loginRes) => {
          try {
            const res = await login({ code: loginRes.code })
            // 后端返回: { code:0, data: { token, nickname, avatar, phone, ... } }
            const userData = { ...res.data }
            delete userData.token
            uni.setStorageSync('token', res.data.token)
            uni.setStorageSync('userInfo', userData)
            uni.showToast({ title: '登录成功', icon: 'success' })
            setTimeout(() => { uni.navigateBack() }, 1500)
          } catch (e) {
            uni.showToast({ title: '登录失败', icon: 'none' })
          }
        },
        fail: () => {
          uni.showToast({ title: '微信登录失败', icon: 'none' })
        }
      })
    }
  })
  // #endif

  // #ifndef MP-WEIXIN
  uni.showToast({ title: '请使用手机号登录', icon: 'none' })
  // #endif
}

// 查看协议
function viewProtocol(type) {
  uni.navigateTo({ url: `/pages/user/protocol?type=${type}` })
}

// 清除定时器
onUnmounted(() => {
  if (codeTimer.value) {
    clearInterval(codeTimer.value)
  }
})
</script>

<template>
  <view class="page-login">
    <!-- Logo -->
    <view class="login-header">
      <image class="logo" src="/static/images/logo.png" mode="aspectFit" />
      <text class="app-name">村里事儿</text>
      <text class="app-desc">乡村综合服务平台</text>
    </view>

    <!-- 登录表单 -->
    <view class="login-form">
      <!-- 手机号登录 -->
      <view class="form-section" v-if="loginType === 'phone'">
        <view class="input-group">
          <text class="input-label">手机号</text>
          <input class="input-field" type="number" v-model="phone" 
            placeholder="请输入手机号" maxlength="11" />
        </view>
        <view class="input-group">
          <text class="input-label">验证码</text>
          <input class="input-field" type="number" v-model="code" 
            placeholder="请输入验证码" maxlength="6" />
          <text class="code-btn" @click="getCode">{{ codeText }}</text>
        </view>
        <button class="login-btn" @click="phoneLogin">登录</button>
      </view>

      <!-- 微信登录 -->
      <view class="wechat-login" v-if="loginType === 'wechat'">
        <button class="wechat-btn" @click="wechatLogin">
          <text>微信一键登录</text>
        </button>
      </view>

      <!-- 切换登录方式 -->
      <view class="switch-type">
        <text @click="loginType = loginType === 'phone' ? 'wechat' : 'phone'">
          {{ loginType === 'phone' ? '微信登录' : '手机号登录' }}
        </text>
      </view>
    </view>

    <!-- 协议勾选 -->
    <view class="protocol-section">
      <view class="protocol-check" @click="agreeProtocol = !agreeProtocol">
        <view class="check-box" :class="{ checked: agreeProtocol }">✓</view>
        <text class="protocol-text">
          我已阅读并同意
          <text class="protocol-link" @click.stop="viewProtocol('user')">《用户协议》</text>
          和
          <text class="protocol-link" @click.stop="viewProtocol('privacy')">《隐私政策》</text>
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-login {
  background: #fff;
  min-height: 100vh;
  padding: 0 48rpx;
}

/* Logo区 */
.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 160rpx;
  margin-bottom: 80rpx;
  
  .logo {
    width: 160rpx;
    height: 160rpx;
    border-radius: 32rpx;
    margin-bottom: 24rpx;
  }
  
  .app-name {
    font-size: 40rpx;
    font-weight: bold;
    color: $primary;
    margin-bottom: 12rpx;
  }
  
  .app-desc {
    font-size: 26rpx;
    color: $text-hint;
  }
}

/* 登录表单 */
.login-form {
  .input-group {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid $border-light;
    margin-bottom: 20rpx;
    
    .input-label {
      font-size: 28rpx;
      color: $text-primary;
      width: 120rpx;
      flex-shrink: 0;
    }
    
    .input-field {
      flex: 1;
      font-size: 28rpx;
      color: $text-primary;
    }
    
    .code-btn {
      font-size: 26rpx;
      color: $primary;
      flex-shrink: 0;
      padding: 8rpx 16rpx;
      border-left: 1rpx solid $border-light;
    }
  }
  
  .login-btn {
    margin-top: 60rpx;
    height: 88rpx;
    line-height: 88rpx;
    background: $primary;
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    border: none;
  }
}

/* 微信登录 */
.wechat-login {
  margin-top: 40rpx;
  
  .wechat-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    background: #07C160;
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    border: none;
    
    .icon-wechat {
      margin-right: 12rpx;
    }
  }
}

/* 切换登录方式 */
.switch-type {
  text-align: center;
  margin-top: 40rpx;
  font-size: 26rpx;
  color: $primary;
}

/* 协议 */
.protocol-section {
  position: fixed;
  bottom: 80rpx;
  left: 0;
  right: 0;
  padding: 0 48rpx;
  
  .protocol-check {
    display: flex;
    align-items: flex-start;
    
    .check-box {
      width: 32rpx;
      height: 32rpx;
      border: 2rpx solid $border-normal;
      border-radius: 50%;
      margin-right: 12rpx;
      flex-shrink: 0;
      margin-top: 4rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20rpx;
      color: #fff;
      
      &.checked {
        background: $primary;
        border-color: $primary;
      }
    }
    
    .protocol-text {
      font-size: 22rpx;
      color: $text-hint;
      line-height: 1.6;
      
      .protocol-link {
        color: $primary;
      }
    }
  }
}
</style>

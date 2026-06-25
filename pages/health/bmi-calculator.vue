<script setup>
import { ref, computed } from 'vue'

// 输入值
const heightVal = ref('')
const weightVal = ref('')

// BMI 结果
const bmiResult = computed(() => {
  const h = parseFloat(heightVal.value)
  const w = parseFloat(weightVal.value)
  if (!h || !w || h <= 0 || w <= 0) return null
  
  const m = h / 100
  return Math.round((w / (m * m)) * 10) / 10
})

// BMI 状态信息
const bmiStatus = computed(() => {
  if (bmiResult.value === null) return null
  const v = bmiResult.value
  
  if (v < 18.5) return { label: '偏瘦', color: '#1976D2', bg: '#E3F2FD', advice: '建议适当增加营养摄入，加强运动锻炼。', range: '<18.5' }
  if (v < 24)   return { label: '正常', color: '#43A047', bg: '#E8F5E9', advice: '恭喜！请继续保持良好的饮食和运动习惯。', range: '18.5~23.9' }
  if (v < 28)   return { label: '偏胖', color: '#FF8F00', bg: '#FFF3E0', advice: '建议控制饮食热量，增加有氧运动。', range: '24~27.9' }
  return { label: '肥胖', color: '#D32F2F', bg: '#FFEBEE', advice: '建议咨询营养师制定科学的减重方案。', range: '≥28' }
})

// 计算
function calculate() {
  if (!heightVal.value || !weightVal.value) {
    uni.showToast({ title: '请输入身高体重', icon: 'none' })
    return
  }
  
  if (bmiResult.value !== null) {
    uni.vibrateShort()
  }
}

// 重置
function reset() {
  heightVal.value = ''
  weightVal.value = ''
}
</script>

<template>
  <view class="page-bmi">
    <!-- 标题说明 -->
    <view class="bmi-intro">
      <text class="intro-title">BMI 身体质量指数</text>
      <text class="intro-desc">BMI = 体重(kg) ÷ 身高²(m²)</text>
    </view>

    <!-- 输入区域 -->
    <view class="input-card">
      <view class="input-group">
        <text class="input-label">身高</text>
        <view class="input-field-wrap">
          <input class="input-field" type="digit" v-model="heightVal" placeholder="请输入身高"
            maxlength="4" />
          <text class="input-unit">cm</text>
        </view>
      </view>

      <view class="divider-line"></view>

      <view class="input-group">
        <text class="input-label">体重</text>
        <view class="input-field-wrap">
          <input class="input-field" type="digit" v-model="weightVal" placeholder="请输入体重"
            maxlength="5" />
          <text class="input-unit">kg</text>
        </view>
      </view>

      <view class="btn-row">
        <button class="calc-btn" @click="calculate">计算BMI</button>
        <button class="reset-btn" @click="reset">重置</button>
      </view>
    </view>

    <!-- 结果展示 -->
    <view class="result-card" v-if="bmiStatus">
      <view class="result-value-wrap">
        <text class="bmi-number">{{ bmiResult }}</text>
        <text class="bmi-unit">kg/m²</text>
      </view>
      
      <view class="status-badge" :style="{ background: bmiStatus.bg, color: bmiStatus.color }">
        <text>{{ bmiStatus.label }}</text>
        <text class="range-text">正常范围: 18.5 ~ 23.9</text>
      </view>

      <view class="advice-box">
        <text class="advice-title">健康建议</text>
        <text class="advice-text">{{ bmiStatus.advice }}</text>
      </view>
    </view>

    <!-- BMI 对照表 -->
    <view class="reference-card">
      <text class="ref-title">BMI 参考标准</text>
      <view class="ref-list">
        <view class="ref-item">
          <view class="ref-color ref-slim"></view>
          <text class="ref-range">&lt;18.5</text>
          <text class="ref-status">偏瘦</text>
        </view>
        <view class="ref-item">
          <view class="ref-color ref-normal"></view>
          <text class="ref-range">18.5~23.9</text>
          <text class="ref-status">正常</text>
        </view>
        <view class="ref-item">
          <view class="ref-color ref-fat"></view>
          <text class="ref-range">24~27.9</text>
          <text class="ref-status">偏胖</text>
        </view>
        <view class="ref-item">
          <view class="ref-color ref-obese"></view>
          <text class="ref-range">≥28</text>
          <text class="ref-status">肥胖</text>
        </view>
      </view>
      
      <text class="ref-note">注：BMI 不适用于运动员、孕妇及未成年人</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-bmi {
  background: $bg-page;
  min-height: 100vh;
  padding: 24rpx 32rpx;
}

.bmi-intro {
  text-align: center;
  padding: 32rpx 0 24rpx;
  
  .intro-title {
    font-size: 36rpx;
    font-weight: bold;
    color: $text-primary;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .intro-desc {
    font-size: 26rpx;
    color: $text-hint;
  }
}

.input-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: $shadow-light;
  margin-bottom: 24rpx;
  
  .input-group {
    display: flex;
    align-items: center;
    padding: 16rpx 0;
    
    .input-label {
      width: 100rpx;
      font-size: 30rpx;
      color: $text-primary;
      font-weight: 500;
    }
    
    .input-field-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      background: $bg-page;
      padding: 16rpx 24rpx;
      border-radius: 12rpx;
      
      .input-field {
        flex: 1;
        font-size: 30rpx;
        color: $text-primary;
      }
      
      .input-unit {
        font-size: 28rpx;
        color: $text-hint;
        margin-left: 12rpx;
      }
    }
  }
  
  .divider-line {
    height: 1rpx;
    background: #eee;
    margin: 8rpx 0;
  }
  
  .btn-row {
    display: flex;
    gap: 20rpx;
    margin-top: 32rpx;
    
    button {
      flex: 1;
      height: 84rpx;
      font-size: 30rpx;
      border-radius: 42rpx;
      border: none;
    }
    
    .calc-btn {
      background: $primary;
      color: #fff;
      font-weight: bold;
    }
    
    .reset-btn {
      background: $bg-page;
      color: $text-secondary;
    }
  }
}

.result-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx 32rpx;
  box-shadow: $shadow-light;
  text-align: center;
  margin-bottom: 24rpx;
  animation: fadeInUp 0.3s ease;
  
  .result-value-wrap {
    margin-bottom: 24rpx;
    
    .bmi-number {
      font-size: 96rpx;
      font-weight: bold;
      color: $text-primary;
    }
    
    .bmi-unit {
      font-size: 28rpx;
      color: $text-hint;
      margin-left: 8rpx;
    }
  }
  
  .status-badge {
    display: inline-flex;
    flex-direction: column;
    padding: 16rpx 48rpx;
    border-radius: 32rpx;
    margin-bottom: 28rpx;
    
    text {
      font-size: 32rpx;
      font-weight: bold;
    }
    
    .range-text {
      font-size: 22rpx;
      font-weight: normal;
      margin-top: 4rpx;
    }
  }
  
  .advice-box {
    background: $bg-page;
    border-radius: 12rpx;
    padding: 24rpx;
    text-align: left;
    
    .advice-title {
      font-size: 26rpx;
      font-weight: bold;
      color: $text-primary;
      display: block;
      margin-bottom: 8rpx;
    }
    
    .advice-text {
      font-size: 26rpx;
      color: $text-secondary;
      line-height: 1.6;
    }
  }
}

.reference-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx 32rpx;
  box-shadow: $shadow-light;
  
  .ref-title {
    font-size: 28rpx;
    font-weight: bold;
    color: $text-primary;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .ref-list {
    .ref-item {
      display: flex;
      align-items: center;
      padding: 14rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .ref-color {
        width: 16rpx;
        height: 16rpx;
        border-radius: 4rpx;
        margin-right: 16rpx;
        
        &.ref-slim { background: #1976D2; }
        &.ref-normal { background: #43A047; }
        &.ref-fat { background: #FF8F00; }
        &.ref-obese { background: #D32F2F; }
      }
      
      .ref-range {
        font-size: 26rpx;
        color: $text-primary;
        width: 160rpx;
      }
      
      .ref-status {
        font-size: 26rpx;
        color: $text-secondary;
      }
    }
  }
  
  .ref-note {
    font-size: 22rpx;
    color: $text-hint;
    display: block;
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx dashed #eee;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

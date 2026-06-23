<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { publishMarket, updateMarket, getMarketDetail } from '@/api/marketplace'

// 是否为编辑模式
const isEdit = ref(false)
const itemId = ref('')

// 表单数据
const formData = ref({
  title: '',
  price: '',
  isFree: false,
  category: '',
  condition: '',
  description: '',
  images: []
})

// 分类选项
const categories = ref(['家具', '电器', '农具', '衣物', '其他'])

// 成色选项
const conditions = ref(['全新', '九成新', '八成新', '七成新', '五成新及以下'])

// 选择图片
function chooseImages() {
  const remaining = 9 - formData.value.images.length
  if (remaining <= 0) {
    uni.showToast({ title: '最多上传9张图片', icon: 'none' })
    return
  }
  
  uni.chooseMedia({
    count: remaining,
    mediaType: ['image'],
    success: (res) => {
      const newImages = res.tempFiles.map(file => file.tempFilePath)
      formData.value.images.push(...newImages)
    }
  })
}

// 删除图片
function removeImage(index) {
  formData.value.images.splice(index, 1)
}

// 选择分类
function selectCategory() {
  uni.showActionSheet({
    itemList: categories.value,
    success: (res) => {
      formData.value.category = categories.value[res.tapIndex]
    }
  })
}

// 选择成色
function selectCondition() {
  uni.showActionSheet({
    itemList: conditions.value,
    success: (res) => {
      formData.value.condition = conditions.value[res.tapIndex]
    }
  })
}

// 切换免费
function toggleFree() {
  formData.value.isFree = !formData.value.isFree
  if (formData.value.isFree) {
    formData.value.price = '0'
  } else {
    formData.value.price = ''
  }
}

// 提交
async function handleSubmit() {
  if (!formData.value.title) {
    uni.showToast({ title: '请输入标题', icon: 'none' })
    return
  }
  
  if (!formData.value.isFree && !formData.value.price) {
    uni.showToast({ title: '请输入价格', icon: 'none' })
    return
  }
  
  if (!formData.value.category) {
    uni.showToast({ title: '请选择分类', icon: 'none' })
    return
  }
  
  try {
    uni.showLoading({ title: '提交中...' })
    
    if (isEdit.value) {
      await updateMarket(itemId.value, formData.value)
    } else {
      await publishMarket(formData.value)
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

onLoad((options) => {
  if (options.id) {
    isEdit.value = true
    itemId.value = options.id
    loadDetail()
  }
})

// 加载详情（编辑模式）
async function loadDetail() {
  try {
    const res = await getMarketDetail(itemId.value)
    formData.value = res.data || {}
  } catch (e) {
    console.error('加载失败', e)
  }
}
</script>

<template>
  <view class="page-publish">
    <!-- 图片上传 -->
    <view class="image-section">
      <view class="image-list">
        <view class="image-item" v-for="(img, index) in formData.images" :key="index">
          <image class="preview-image" :src="img" mode="aspectFill" />
          <text class="remove-btn" @click="removeImage(index)">×</text>
        </view>
        <view class="image-add" @click="chooseImages" v-if="formData.images.length < 9">
          <text class="add-icon">+</text>
          <text class="add-text">添加图片</text>
        </view>
      </view>
      <text class="image-tip">最多上传9张图片</text>
    </view>

    <!-- 表单 -->
    <view class="form-section">
      <view class="form-item">
        <text class="form-label">标题</text>
        <input class="form-input" v-model="formData.title" placeholder="请输入物品标题" />
      </view>

      <view class="form-item">
        <text class="form-label">价格</text>
        <view class="price-row">
          <input class="form-input" v-model="formData.price" 
            placeholder="请输入价格" type="digit" :disabled="formData.isFree" />
          <view class="free-check" @click="toggleFree">
            <view class="check-box" :class="{ checked: formData.isFree }">✓</view>
            <text>免费赠送</text>
          </view>
        </view>
      </view>

      <view class="form-item" @click="selectCategory">
        <text class="form-label">分类</text>
        <view class="form-value">
          <text :class="{ placeholder: !formData.category }">
            {{ formData.category || '请选择分类' }}
          </text>
          <text class="form-arrow">></text>
        </view>
      </view>

      <view class="form-item" @click="selectCondition">
        <text class="form-label">成色</text>
        <view class="form-value">
          <text :class="{ placeholder: !formData.condition }">
            {{ formData.condition || '请选择成色' }}
          </text>
          <text class="form-arrow">></text>
        </view>
      </view>

      <view class="form-item desc-item">
        <text class="form-label">描述</text>
        <textarea class="form-textarea" v-model="formData.description" 
          placeholder="请输入物品描述" maxlength="500" />
        <text class="word-count">{{ formData.description.length }}/500</text>
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
.page-publish {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

/* 图片上传 */
.image-section {
  padding: 24rpx 32rpx;
  background: #fff;
  margin-bottom: 20rpx;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.image-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  
  .preview-image {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
  }
  
  .remove-btn {
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    width: 40rpx;
    height: 40rpx;
    background: $aux-red;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
  }
}

.image-add {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed $border-normal;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .add-icon {
    font-size: 48rpx;
    color: $text-hint;
  }
  
  .add-text {
    font-size: 22rpx;
    color: $text-hint;
    margin-top: 8rpx;
  }
}

.image-tip {
  font-size: 22rpx;
  color: $text-hint;
  margin-top: 16rpx;
  display: block;
}

/* 表单 */
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
  
  .form-value {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    text {
      font-size: 28rpx;
      color: $text-primary;
      
      &.placeholder {
        color: $text-hint;
      }
    }
    
    .form-arrow {
      color: $text-hint;
      font-size: 28rpx;
    }
  }
}

.price-row {
  flex: 1;
  display: flex;
  align-items: center;
  
  .form-input {
    flex: 1;
  }
  
  .free-check {
    display: flex;
    align-items: center;
    margin-left: 24rpx;
    font-size: 26rpx;
    color: $text-secondary;
    flex-shrink: 0;
    
    .check-box {
      width: 32rpx;
      height: 32rpx;
      border: 2rpx solid $border-normal;
      border-radius: 50%;
      margin-right: 8rpx;
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
  }
}

.desc-item {
  flex-direction: column;
  align-items: flex-start;
  
  .form-label {
    margin-bottom: 16rpx;
  }
  
  .form-textarea {
    width: 100%;
    height: 200rpx;
    font-size: 28rpx;
    color: $text-primary;
    line-height: 1.6;
  }
  
  .word-count {
    font-size: 22rpx;
    color: $text-hint;
    text-align: right;
    width: 100%;
    display: block;
    margin-top: 8rpx;
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

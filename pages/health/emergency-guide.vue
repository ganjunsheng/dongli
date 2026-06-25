<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 当前选中项
const currentIndex = ref(0)

// 急救指南数据
const guides = ref([
  {
    id: 1,
    name: '心肺复苏(CPR)',
    icon: '❤️‍🩹',
    color: '#D32F2F',
    steps: [
      '判断意识：轻拍患者双肩大声呼唤',
      '拨打120急救电话',
      '摆放体位：仰卧在硬质平面上',
      '胸外按压：两乳头连线中点，深度5-6cm，频率100-120次/分',
      '开放气道：清理口腔异物，仰头抬颏',
      '人工呼吸：捏鼻包口吹气，每次1秒',
      '按压与呼吸比：30:2循环进行'
    ],
    tips: [
      '按压时手臂伸直，利用上半身重量垂直向下压',
      '每次按压后要让胸廓充分回弹',
      '避免中断按压，直到专业人员到达'
    ]
  },
  {
    id: 2,
    name: '烧烫伤处理',
    icon: '🔥',
    color: '#FF8F00',
    steps: [
      '立即脱离热源',
      '用流动冷水冲洗伤口15-30分钟',
      '轻轻脱去受伤部位衣物（粘连时剪开）',
      '用干净纱布或毛巾覆盖伤口',
      '不要涂抹任何药物（如牙膏、酱油等）',
      '严重时尽快送医'
    ],
    tips: [
      '不要用冰块直接冰敷，以免加重损伤',
      '不要刺破水泡',
      '头面部、手部、会阴部烧伤需及时就医'
    ]
  },
  {
    id: 3,
    name: '异物卡喉(海姆立克)',
    icon: '😷',
    color: '#1976D2',
    steps: [
      '站在患者背后，环抱腰部',
      '一手握拳放在肚脐上方两指处',
      '另一只手包住拳头',
      '快速向内向上冲击',
      '重复操作直到异物排出',
      '若患者昏迷，立即开始CPR'
    ],
    tips: [
      '自救时可借助椅背或桌角',
      '婴幼儿采用拍背+胸部冲击法',
      '孕妇和肥胖者冲击位置改为胸骨中部'
    ]
  },
  {
    id: 4,
    name: '中暑急救',
    icon: '☀️',
    color: '#F57C00',
    steps: [
      '迅速转移到阴凉通风处',
      '解开衣扣，平卧休息',
      '用凉水擦拭全身或冷敷头部',
      '少量多次补充淡盐水',
      '重症者（高热、昏迷）立即送医'
    ],
    tips: [
      '避免大量饮水以免引起胃痉挛',
      '不可快速冰敷以免血管收缩',
      '高温作业应定时休息补水'
    ]
  },
  {
    id: 5,
    name: '动物咬伤',
    icon: '🐕',
    color: '#7B1FA2',
    steps: [
      '立即用肥皂水和流动清水交替冲洗15分钟',
      '用碘伏或酒精消毒伤口',
      '不缝合不包扎（让伤口开放）',
      '尽快到疾控中心接种狂犬疫苗',
      '记录动物情况供医生参考'
    ],
    tips: [
      '被猫狗等哺乳动物咬伤都需接种疫苗',
      '24小时内接种效果最佳',
      '全程需接种5针（0-3-7-14-28天）'
    ]
  },
  {
    id: 6,
    name: '食物中毒',
    icon: '🤢',
    color: '#00796B',
    steps: [
      '停止食用可疑食物',
      '催吐（清醒者可用手指刺激咽喉）',
      '保留呕吐物和剩余食物样本',
      '多喝淡盐水防止脱水',
      '出现严重症状（剧烈腹痛、脱水）立即就医'
    ],
    tips: [
      '误食强酸强碱禁止催吐',
      '老人儿童中毒风险更高',
      '集体用餐多人不适可能是食物中毒'
    ]
  }
])

// 切换指南
function switchGuide(index) {
  currentIndex.value = index
}

// 拨打急救电话
function callEmergency() {
  uni.makePhoneCall({ phoneNumber: '120' })
}

onLoad(() => {})
</script>

<template>
  <view class="page-emergency">
    <!-- 头部警告 -->
    <view class="warning-header">
      <text class="warning-icon">⚠️</text>
      <text class="warning-text">以下为应急参考，非专业医学指导。紧急情况请直接拨打 120</text>
    </view>

    <!-- 左侧目录 -->
    <view class="guide-layout">
      <!-- 左侧导航 -->
      <scroll-view class="guide-nav" scroll-y>
        <view class="nav-item" v-for="(g, index) in guides" :key="g.id"
          :class="{ active: currentIndex === index }"
          @click="switchGuide(index)">
          <view class="nav-dot" :style="{ background: g.color }"></view>
          <text class="nav-name">{{ g.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧内容 -->
      <scroll-view class="guide-content" scroll-y :scroll-into-view="'step-' + currentIndex">
        <view v-if="guides[currentIndex]" class="detail-panel">
          <!-- 标题 -->
          <view class="panel-header">
            <text class="header-icon">{{ guides[currentIndex].icon }}</text>
            <text class="header-title">{{ guides[currentIndex].name }}</text>
          </view>

          <!-- 步骤 -->
          <view class="steps-section">
            <text class="steps-title">操作步骤</text>
            <view class="step-item" v-for="(step, i) in guides[currentIndex].steps" :key="i" :id="'step-' + i">
              <view class="step-num" :style="{ background: guides[currentIndex].color }">
                {{ i + 1 }}
              </view>
              <text class="step-text">{{ step }}</text>
            </view>
          </view>

          <!-- 注意事项 -->
          <view class="tips-section" v-if="guides[currentIndex].tips?.length">
            <text class="tips-title">注意事项</text>
            <view class="tip-item" v-for="(tip, i) in guides[currentIndex].tips" :key="i">
              <text class="tip-bullet">●</text>
              <text class="tip-text">{{ tip }}</text>
            </view>
          </view>
        </view>

        <!-- 底部急救按钮 -->
        <view class="emergency-btn-area">
          <button class="emergency-btn" @click="callEmergency">
            <text class="btn-icon">🚑</text>
            <text class="btn-text">拨打 120</text>
          </button>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-emergency {
  background: $bg-page;
  min-height: 100vh;
}

/* ====== 警告头部 ====== */
.warning-header {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background: #FFF3E0;
  gap: 12rpx;
  
  .warning-icon {
    font-size: 28rpx;
    flex-shrink: 0;
  }
  
  .warning-text {
    font-size: 24rpx;
    color: #E65100;
    line-height: 1.4;
  }
}

/* ====== 左右布局 ====== */
.guide-layout {
  display: flex;
  height: calc(100vh - 90rpx);
}

/* 左侧导航 */
.guide-nav {
  width: 240rpx;
  background: #fff;
  height: 100%;
  border-right: 1rpx solid #eee;
  
  .nav-item {
    display: flex;
    align-items: center;
    padding: 28rpx 20rpx;
    position: relative;
    
    &.active {
      background: $primary-bg;
      
      .nav-name {
        color: $primary;
        font-weight: bold;
      }
      
      .nav-dot {
        transform: scale(1.3);
        box-shadow: 0 0 8rpx rgba(46,125,50,0.4);
      }
    }
    
    .nav-dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      margin-right: 16rpx;
      transition: all 0.2s;
    }
    
    .nav-name {
      font-size: 25rpx;
      color: $text-secondary;
      @include text-ellipsis;
    }
  }
}

/* 右侧内容 */
.guide-content {
  flex: 1;
  height: 100%;
  background: #fff;
  padding: 24rpx;
}

.detail-panel {
  .panel-header {
    display: flex;
    align-items: center;
    padding-bottom: 24rpx;
    border-bottom: 2rpx solid $bg-page;
    margin-bottom: 28rpx;
    
    .header-icon {
      font-size: 44rpx;
      margin-right: 16rpx;
    }
    
    .header-title {
      font-size: 36rpx;
      font-weight: bold;
      color: $text-primary;
    }
  }
}

/* 步骤区 */
.steps-section {
  margin-bottom: 32rpx;
  
  .steps-title {
    font-size: 30rpx;
    font-weight: bold;
    color: $text-primary;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .step-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20rpx;
    
    .step-num {
      width: 44rpx;
      height: 44rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 24rpx;
      font-weight: bold;
      flex-shrink: 0;
      margin-right: 16rpx;
      margin-top: 2rpx;
    }
    
    .step-text {
      font-size: 28rpx;
      color: $text-primary;
      line-height: 1.6;
      flex: 1;
    }
  }
}

/* 注意事项 */
.tips-section {
  background: #FFF8E1;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 32rpx;
  
  .tips-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #E65100;
    display: block;
    margin-bottom: 16rpx;
  }
  
  .tip-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .tip-bullet {
      color: #F57C00;
      margin-right: 12rpx;
      flex-shrink: 0;
      font-size: 24rpx;
    }
    
    .tip-text {
      font-size: 26rpx;
      color: $text-secondary;
      line-height: 1.6;
    }
  }
}

/* 底部急救按钮 */
.emergency-btn-area {
  padding: 24rpx 0;
  
  .emergency-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 96rpx;
    background: linear-gradient(135deg, #D32F2F, #B71C1C);
    color: #fff;
    font-size: 34rpx;
    font-weight: bold;
    border-radius: 48rpx;
    border: none;
    box-shadow: 0 8rpx 24rpx rgba(211,47,47,0.35);
    
    .btn-icon {
      font-size: 36rpx;
      margin-right: 12rpx;
    }
    
    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }
}
</style>

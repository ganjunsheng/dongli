<script setup>
import { ref, onMounted } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'

// Tab 切换
const tabs = ref(['健康资讯', '在线问诊', '附近医院'])
const currentTab = ref(0)

// 健康资讯列表
const newsList = ref([
  {
    id: 1,
    title: '夏季防暑降温小常识',
    summary: '高温天气如何科学防暑？医生教你几招...',
    cover: '/static/images/health/heat.jpg',
    source: '乡村卫生院',
    time: '2024-06-20',
    views: 256
  },
  {
    id: 2,
    title: '老年人高血压预防与护理指南',
    summary: '高血压是老年群体常见疾病，日常护理要点...',
    cover: '/static/images/health/bp.jpg',
    source: '县人民医院',
    time: '2024-06-18',
    views: 389
  },
  {
    id: 3,
    title: '儿童疫苗接种时间表（最新版）',
    summary: '国家免疫规划疫苗儿童接种程序一览表...',
    cover: '/static/images/health/vaccine.jpg',
    source: '疾控中心',
    time: '2024-06-15',
    views: 512
  }
])

// 科室列表
const departments = ref([
  { id: 1, name: '内科', icon: '🏥', desc: '呼吸、消化、心血管' },
  { id: 2, name: '外科', icon: '🔧', desc: '普外、骨科、泌尿' },
  { id: 3, name: '儿科', icon: '👶', desc: '儿童常见疾病诊治' },
  { id: 4, name: '妇产科', icon: '👩', desc: '妇科、产科保健' },
  { id: 5, name: '中医科', icon: '🌿', desc: '针灸、推拿、中药调理' },
  { id: 6, name: '口腔科', icon: '🦷', desc: '牙病治疗、口腔保健' },
  { id: 7, name: '眼科', icon: '👁', desc: '视力检查、眼疾治疗' },
  { id: 8, name: '皮肤科', icon: '✋', desc: '皮肤病、美容整形' }
])

// 附近医院
const hospitals = ref([
  {
    id: 1,
    name: '东篱镇中心卫生院',
    address: '东篱镇幸福路88号',
    distance: '0.8km',
    phone: '0571-88881001',
    level: '一级甲等',
    tags: ['医保定点', '24小时急诊'],
    image: '/static/images/health/hospital1.png'
  },
  {
    id: 2,
    name: '县人民医院',
    address: '县城健康大道100号',
    distance: '12km',
    phone: '0571-88886666',
    level: '二级乙等',
    tags: ['综合医院', '医保定点'],
    image: '/static/images/health/hospital2.png'
  },
  {
    id: 3,
    name: '仁爱社区卫生服务中心',
    address: '社区文化广场旁',
    distance: '2.3km',
    phone: '0571-88882233',
    level: '社区医疗',
    tags: ['家庭医生', '慢病管理'],
    image: '/static/images/health/hospital3.png'
  }
])

// 健康工具
const tools = ref([
  { id: 1, name: 'BMI计算器', icon: '⚖', color: '#2E7D32' },
  { id: 2, name: '用药提醒', icon: '💊', color: '#1976D2' },
  { id: 3, name: '体检预约', icon: '📋', color: '#FF8F00' },
  { id: 4, name: '急救指南', icon: '🚑', color: '#D32F2F' },
  { id: 5, name: '健康档案', icon: '📁', color: '#7B1FA2' },
  { id: 6, name: '医保查询', icon: '💳', color: '#00897B' }
])

// 加载状态
const loading = ref(false)
const hasMore = ref(true)

// 切换 tab
function switchTab(index) {
  currentTab.value = index
}

// 跳转详情
function goNewsDetail(id) {
  uni.navigateTo({ url: `/pages/health/news-detail?id=${id}` })
}

// 选择科室
function chooseDept(dept) {
  uni.showToast({ title: `正在连接${dept.name}...`, icon: 'none' })
}

// 查看医院
function goHospital(id) {
  uni.navigateTo({ url: `/pages/health/hospital-detail?id=${id}` })
}

// 拨打电话
function callPhone(phone) {
  uni.makePhoneCall({ phoneNumber: phone })
}

// 打开地图导航
function openNav(item) {
  uni.openLocation({
    latitude: 30.27 + (item.id * 0.001),
    longitude: 120.15 + (item.id * 0.001),
    name: item.name,
    address: item.address
  })
}

// 工具点击
function useTool(tool) {
  if (tool.id === 4) {
    // 急救指南
    uni.navigateTo({ url: '/pages/health/emergency-guide' })
  } else if (tool.id === 1) {
    // BMI 计算器
    uni.navigateTo({ url: '/pages/health/bmi-calculator' })
  } else {
    uni.showToast({ title: `${tool.name}功能开发中`, icon: 'none' })
  }
}

// 下拉刷新
onPullDownRefresh(async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  loading.value = false
  uni.stopPullDownRefresh()
})
</script>

<template>
  <view class="page-health">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @click="uni.navigateTo({ url: '/pages/search/index?from=health' })">
        <text class="iconfont icon-search"></text>
        <text class="search-placeholder">搜索疾病症状、药品、医院...</text>
      </view>
    </view>

    <!-- Tab 切换 -->
    <view class="tab-bar">
      <scroll-view scroll-x class="tab-scroll">
        <view class="tab-list">
          <view class="tab-item" v-for="(tab, index) in tabs" :key="index"
            :class="{ active: currentTab === index }"
            @click="switchTab(index)">
            <text>{{ tab }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 内容区 -->
    <view class="content-area">
      <!-- Tab 0: 健康资讯 -->
      <view v-show="currentTab === 0">
        <!-- 轮播 Banner -->
        <swiper class="news-banner" autoplay circular indicator-dots
          indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
          <swiper-item>
            <view class="banner-item banner-1">
              <view class="banner-content">
                <text class="banner-title">夏季健康防护指南</text>
                <text class="banner-desc">防暑降温 · 食品安全 · 防蚊虫叮咬</text>
              </view>
            </view>
          </swiper-item>
          <swiper-item>
            <view class="banner-item banner-2">
              <view class="banner-content">
                <text class="banner-title">免费体检活动通知</text>
                <text class="banner-desc">65岁以上老人每年一次免费体检</text>
              </view>
            </view>
          </swiper-item>
        </swiper>

        <!-- 健康工具入口 -->
        <view class="tools-section">
          <text class="section-title">常用工具</text>
          <view class="tools-grid">
            <view class="tool-item" v-for="tool in tools" :key="tool.id" @click="useTool(tool)">
              <view class="tool-icon" :style="{ background: tool.color + '15', color: tool.color }">
                <text>{{ tool.icon }}</text>
              </view>
              <text class="tool-name">{{ tool.name }}</text>
            </view>
          </view>
        </view>

        <!-- 健康资讯列表 -->
        <view class="news-section">
          <text class="section-title">健康资讯</text>
          <view class="news-card" v-for="item in newsList" :key="item.id" @click="goNewsDetail(item.id)">
            <image class="news-cover" :src="item.cover" lazy-load mode="aspectFill" />
            <view class="news-info">
              <text class="news-title">{{ item.title }}</text>
              <text class="news-summary">{{ item.summary }}</text>
              <view class="news-meta">
                <text class="meta-source">{{ item.source }}</text>
                <text class="meta-time">{{ item.time }}</text>
                <text class="meta-views">👁 {{ item.views }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Tab 1: 在线问诊 -->
      <view v-show="currentTab === 1">
        <!-- 问诊提示 -->
        <view class="consult-tip">
          <text class="tip-text">💡 在线咨询仅作参考，紧急情况请拨打120或就近就医</text>
        </view>

        <!-- 科室分类 -->
        <view class="dept-section">
          <text class="section-title">选择科室</text>
          <view class="dept-grid">
            <view class="dept-card" v-for="dept in departments" :key="dept.id" @click="chooseDept(dept)">
              <view class="dept-icon"><text>{{ dept.icon }}</text></view>
              <text class="dept-name">{{ dept.name }}</text>
              <text class="dept-desc">{{ dept.desc }}</text>
            </view>
          </view>
        </view>

        <!-- 快速挂号 -->
        <view class="quick-book">
          <view class="book-header">
            <text class="book-title">快速挂号</text>
            <text class="book-more" @click="goHospital(0)">更多 ></text>
          </view>
          <view class="hospital-mini" v-for="item in hospitals.slice(0, 2)" :key="item.id" @click="goHospital(item.id)">
            <image class="mini-image" :src="item.image" lazy-load mode="aspectFill" />
            <view class="mini-info">
              <text class="mini-name">{{ item.name }}</text>
              <text class="mini-level">{{ item.level }} · {{ item.distance }}</text>
              <view class="mini-tags">
                <text class="mini-tag" v-for="tag in item.tags.slice(0, 2)" :key="tag">{{ tag }}</text>
              </view>
            </view>
            <button class="btn-book">挂号</button>
          </view>
        </view>
      </view>

      <!-- Tab 2: 附近医院 -->
      <view v-show="currentTab === 2">
        <!-- 医院列表 -->
        <view class="hospital-list">
          <view class="hospital-card" v-for="item in hospitals" :key="item.id" @click="goHospital(item.id)">
            <image class="hospital-image" :src="item.image" lazy-load mode="aspectFill" />
            <view class="hospital-info">
              <view class="info-top">
                <text class="hospital-name">{{ item.name }}</text>
                <text class="hospital-level" :class="'level-' + (item.level.includes('一') ? 1 : item.level.includes('二') ? 2 : 3)">
                  {{ item.level }}
                </text>
              </view>
              <text class="hospital-address">{{ item.address }}</text>
              <view class="hospital-bottom">
                <text class="hospital-distance">{{ item.distance }}</text>
                <view class="hospital-tags">
                  <text class="tag" v-for="tag in item.tags" :key="tag">#{{ tag }}</text>
                </view>
              </view>
            </view>
            <view class="hospital-actions">
              <button class="action-call" @click.stop="callPhone(item.phone)">电话</button>
              <button class="action-nav" @click.stop="openNav(item)">导航</button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-health {
  background: $bg-page;
  min-height: 100vh;
}

/* ====== 搜索栏 ====== */
.search-bar {
  padding: 16rpx 32rpx;
  background: #fff;
  
  .search-input {
    display: flex;
    align-items: center;
    background: $bg-page;
    padding: 16rpx 24rpx;
    border-radius: 36rpx;
    
    .icon-search {
      font-size: 28rpx;
      color: $text-hint;
      margin-right: 12rpx;
    }
    
    .search-placeholder {
      font-size: 26rpx;
      color: $text-hint;
    }
  }
}

/* ====== Tab 栏 ====== */
.tab-bar {
  background: #fff;
  border-bottom: 1rpx solid #eee;
  
  .tab-scroll {
    white-space: nowrap;
  }
  
  .tab-list {
    display: flex;
    padding: 0 16rpx;
  }
  
  .tab-item {
    display: inline-flex;
    padding: 24rpx 28rpx;
    font-size: 28rpx;
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

/* ====== 内容区通用 ====== */
.content-area {
  min-height: calc(100vh - 180rpx);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $text-primary;
  display: block;
  padding: 32rpx 32rpx 20rpx;
}

/* ====== Banner 轮播 ====== */
.news-banner {
  height: 280rpx;
  
  .banner-item {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
    
    &.banner-1 {
      background: linear-gradient(135deg, #43A047 0%, #2E7D32 100%);
    }
    
    &.banner-2 {
      background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
    }
    
    .banner-content {
      text-align: left;
      width: 100%;
    }
    
    .banner-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #fff;
      display: block;
      margin-bottom: 12rpx;
    }
    
    .banner-desc {
      font-size: 26rpx;
      color: rgba(255,255,255,0.85);
    }
  }
}

/* ====== 健康工具网格 ====== */
.tools-section {
  background: #fff;
  margin-bottom: 16rpx;
  
  .section-title {
    padding-top: 24rpx;
  }
  
  .tools-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16rpx;
    padding: 0 32rpx 32rpx;
    
    .tool-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 28rpx 16rpx;
      background: $bg-page;
      border-radius: 16rpx;
      
      &:active {
        opacity: 0.75;
      }
      
      .tool-icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12rpx;
        
        text {
          font-size: 36rpx;
        }
      }
      
      .tool-name {
        font-size: 24rpx;
        color: $text-primary;
      }
    }
  }
}

/* ====== 健康资讯列表 ====== */
.news-section {
  background: #fff;
  
  .news-card {
    display: flex;
    padding: 24rpx 32rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:active {
      background: $bg-hover;
    }
    
    .news-cover {
      width: 200rpx;
      height: 150rpx;
      border-radius: 12rpx;
      flex-shrink: 0;
      background: $bg-page;
    }
    
    .news-info {
      flex: 1;
      margin-left: 24rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .news-title {
        font-size: 30rpx;
        font-weight: 500;
        color: $text-primary;
        line-height: 1.4;
        display: block;
        @include text-ellipsis-2;
      }
      
      .news-summary {
        font-size: 24rpx;
        color: $text-secondary;
        margin-top: 8rpx;
        display: block;
        @include text-ellipsis;
      }
      
      .news-meta {
        display: flex;
        align-items: center;
        gap: 16rpx;
        margin-top: 8rpx;
        
        text {
          font-size: 20rpx;
          color: $text-hint;
        }
      }
    }
  }
}

/* ====== 问诊提示 ====== */
.consult-tip {
  padding: 16rpx 32rpx;
  background: #FFF8E1;
  
  .tip-text {
    font-size: 24rpx;
    color: #F57C00;
  }
}

/* ====== 科室网格 ====== */
.dept-section {
  background: #fff;
  margin-bottom: 16rpx;
  
  .section-title {
    padding-top: 24rpx;
  }
  
  .dept-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16rpx;
    padding: 0 24rpx 32rpx;
    
    .dept-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24rpx 12rpx;
      background: $bg-page;
      border-radius: 16rpx;
      
      &:active {
        background: darken($bg-page, 3%);
      }
      
      .dept-icon {
        width: 72rpx;
        height: 72rpx;
        background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12rpx;
        
        text {
          font-size: 32rpx;
        }
      }
      
      .dept-name {
        font-size: 26rpx;
        color: $text-primary;
        font-weight: 500;
      }
      
      .dept-desc {
        font-size: 20rpx;
        color: $text-hint;
        margin-top: 4rpx;
        @include text-ellipsis;
        max-width: 140rpx;
        text-align: center;
      }
    }
  }
}

/* ====== 快速挂号 ====== */
.quick-book {
  background: #fff;
  
  .book-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 32rpx;
    
    .book-title {
      font-size: 32rpx;
      font-weight: bold;
      color: $text-primary;
    }
    
    .book-more {
      font-size: 26rpx;
      color: $primary;
    }
  }
  
  .hospital-mini {
    display: flex;
    align-items: center;
    padding: 20rpx 32rpx;
    border-top: 1rpx solid #f0f0f0;
    
    .mini-image {
      width: 120rpx;
      height: 90rpx;
      border-radius: 12rpx;
      flex-shrink: 0;
      background: $bg-page;
    }
    
    .mini-info {
      flex: 1;
      margin-left: 20rpx;
      
      .mini-name {
        font-size: 28rpx;
        color: $text-primary;
        font-weight: 500;
        display: block;
      }
      
      .mini-level {
        font-size: 22rpx;
        color: $text-hint;
        display: block;
        margin-top: 4rpx;
      }
      
      .mini-tags {
        margin-top: 8rpx;
        display: flex;
        gap: 8rpx;
        
        .mini-tag {
          font-size: 20rpx;
          color: $primary;
          background: $primary-bg;
          padding: 2rpx 12rpx;
          border-radius: 6rpx;
        }
      }
    }
    
    .btn-book {
      background: $primary;
      color: #fff;
      font-size: 24rpx;
      padding: 10rpx 28rpx;
      border-radius: 24rpx;
      border: none;
      flex-shrink: 0;
      margin-left: 16rpx;
    }
  }
}

/* ====== 医院列表 ====== */
.hospital-list {
  padding: 0 24rpx 32rpx;
  
  .hospital-card {
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: $shadow-light;
    margin-bottom: 24rpx;
    
    .hospital-image {
      width: 100%;
      height: 240rpx;
      background: $bg-page;
    }
    
    .hospital-info {
      padding: 24rpx;
      
      .info-top {
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;
        
        .hospital-name {
          font-size: 32rpx;
          font-weight: bold;
          color: $text-primary;
          flex: 1;
          @include text-ellipsis;
        }
        
        .hospital-level {
          font-size: 22rpx;
          padding: 4rpx 14rpx;
          border-radius: 6rpx;
          flex-shrink: 0;
          margin-left: 12rpx;
          
          &.level-1 {
            background: #E8F5E9;
            color: #2E7D32;
          }
          
          &.level-2 {
            background: #FFF3E0;
            color: #EF6C00;
          }
          
          &.level-3 {
            background: #E3F2FD;
            color: #1976D2;
          }
        }
      }
      
      .hospital-address {
        font-size: 26rpx;
        color: $text-secondary;
        display: block;
        margin-bottom: 16rpx;
      }
      
      .hospital-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .hospital-distance {
          font-size: 24rpx;
          color: $aux-orange;
          font-weight: 500;
        }
        
        .hospital-tags {
          display: flex;
          gap: 8rpx;
          
          .tag {
            font-size: 22rpx;
            color: $text-hint;
            background: $bg-page;
            padding: 4rpx 14rpx;
            border-radius: 6rpx;
          }
        }
      }
    }
    
    .hospital-actions {
      display: flex;
      padding: 0 24rpx 24rpx;
      gap: 16rpx;
      
      button {
        flex: 1;
        height: 68rpx;
        font-size: 28rpx;
        border-radius: 34rpx;
        border: none;
        
        &.action-call {
          background: #E3F2FD;
          color: #1976D2;
        }
        
        &.action-nav {
          background: $primary-bg;
          color: $primary;
        }
      }
    }
  }
}
</style>

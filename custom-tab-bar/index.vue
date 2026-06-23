<template>
  <view class="tab-bar">
    <!-- 左侧两个 -->
    <view
      v-for="(item, index) in leftTabs"
      :key="item.pagePath"
      class="tab-item"
      @click="onSwitchTab(item)"
    >
      <image
        :src="currentPage === item.pagePath ? item.selectedIconPath : item.iconPath"
        class="tab-icon"
        mode="aspectFit"
      />
      <text :class="['tab-text', currentPage === item.pagePath ? 'active' : '']">{{ item.text }}</text>
    </view>

    <!-- 中间凸起按钮 -->
    <view class="center-btn-wrapper" @click="onSwitchTab(mallTab)">
      <view class="center-btn" :class="{ 'mall-active': currentPage === mallTab.pagePath }">
        <view class="circle-bg">
          <view class="inner-circle">
            <image src="/static/tab/mall-mid.png" class="mid-icon" mode="aspectFit" />
          </view>
        </view>
        <text class="center-text">商城</text>
      </view>
    </view>

    <!-- 右侧两个 -->
    <view
      v-for="(item, index) in rightTabs"
      :key="item.pagePath"
      class="tab-item"
      @click="onSwitchTab(item)"
    >
      <image
        :src="currentPage === item.pagePath ? item.selectedIconPath : item.iconPath"
        class="tab-icon"
        mode="aspectFit"
      />
      <text :class="['tab-text', currentPage === item.pagePath ? 'active' : '']">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    const list = [
      { pagePath: '/pages/index/index', text: '首页', iconPath: '/static/tab/home.png', selectedIconPath: '/static/tab/home-active.png' },
      { pagePath: '/pages/village/index', text: '村务', iconPath: '/static/tab/village.png', selectedIconPath: '/static/tab/village-active.png' },
      { pagePath: '/pages/mall/index', text: '商城', iconPath: '/static/tab/mall.png', selectedIconPath: '/static/tab/mall-active.png' },
      { pagePath: '/pages/travel/index', text: '旅游', iconPath: '/static/tab/travel.png', selectedIconPath: '/static/tab/travel-active.png' },
      { pagePath: '/pages/user/index', text: '我的', iconPath: '/static/tab/user.png', selectedIconPath: '/static/tab/user-active.png' }
    ];
    return {
      leftTabs: [list[0], list[1]],
      rightTabs: [list[3], list[4]],
      mallTab: list[2],
      currentPage: '/pages/index/index'
    };
  },
  created() {
    this.updateCurrent();
    // 监听页面切换
    uni.$on('_tabbar_change', this.updateCurrent);
  },
  beforeUnmount() {
    uni.$off('_tabbar_change', this.updateCurrent);
  },
  methods: {
    updateCurrent() {
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const route = '/' + pages[pages.length - 1].route;
        this.currentPage = route;
      }
    },
    onSwitchTab(item) {
      if (this.currentPage === item.pagePath) return;
      uni.switchTab({ url: item.pagePath });
    }
  }
};
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #FFFFFF;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 9999;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100rpx;
  padding-bottom: 10rpx;
}

.tab-icon {
  width: 44rpx;
  height: 44rpx;
  margin-bottom: 6rpx;
}

.tab-text {
  font-size: 20rpx;
  color: #999999;
  line-height: 1;
  height: 28rpx;
  display: flex;
  align-items: center;
}

.tab-text.active {
  color: #2E7D32;
}

/* ========== 中间凸起按钮 ========== */
.center-btn-wrapper {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  height: 100rpx;
  padding-bottom: 10rpx;
}

.center-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
}

/* 凸起圆形 - 向上大幅凸出 */
.circle-bg {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF4400 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 30rpx rgba(255, 68, 0, 0.45), 0 0 0 6rpx #FFFFFF;
  transition: all 0.3s ease;
  position: absolute;
  bottom: 40rpx;
  z-index: 10;
}

/* 商城激活态 */
.mall-active .circle-bg {
  background: linear-gradient(135deg, #FF8F00 0%, #FF4400 100%);
  box-shadow: 0 10rpx 35rpx rgba(255, 68, 0, 0.55), 0 0 0 6rpx #FFFFFF;
  transform: scale(1.05);
}

.inner-circle {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mid-icon {
  width: 50rpx;
  height: 50rpx;
}

/* 文字与其他 Tab 水平对齐 */
.center-text {
  font-size: 20rpx;
  color: #999;
  height: 28rpx;
  display: flex;
  align-items: center;
  font-weight: bold;
  z-index: 5;
}

.mall-active .center-text {
  color: #FF4400;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { searchProducts } from '@/api/mall'
import { getNoticeList } from '@/api/village'
import { getJobList } from '@/api/job'
import { getMarketList } from '@/api/marketplace'
import { getSpotList } from '@/api/travel'

/* ========== 搜索输入 ========== */
const keyword = ref('')
const inputRef = ref(null)
let searchTimer = null

/* ========== 状态栏高度 ========== */
const statusBarHeight = computed(() => {
  const info = uni.getSystemInfoSync()
  return info.statusBarHeight || 20
})

/* ========== 分类 Tab ========== */
const tabs = [
  { id: 'all', label: '全部', icon: 'search' },
  { id: 'village', label: '村务', icon: 'notice' },
  { id: 'mall', label: '商城', icon: 'shop' },
  { id: 'travel', label: '旅游', icon: 'travel' },
  { id: 'market', label: '集市', icon: 'market' },
  { id: 'job', label: '招工', icon: 'job' }
]
const activeTab = ref('all')

/* ========== 搜索历史 ========== */
const historyKey = 'search_history'
const historyList = ref([])

function loadHistory() {
  const raw = uni.getStorageSync(historyKey)
  historyList.value = raw ? JSON.parse(raw) : []
}

function saveHistory(word) {
  if (!word.trim()) return
  const list = historyList.value.filter(h => h !== word)
  list.unshift(word)
  if (list.length > 15) list.pop()
  historyList.value = list
  uni.setStorageSync(historyKey, JSON.stringify(list))
}

function clearHistory() {
  historyList.value = []
  uni.removeStorageSync(historyKey)
}

function deleteHistoryItem(index) {
  historyList.value.splice(index, 1)
  uni.setStorageSync(historyKey, JSON.stringify(historyList.value))
}

/* ========== 热门搜索 ========== */
const hotList = ref([
  '有机蔬菜', '土鸡蛋', '乡村旅游', '招工信息',
  '闲置农具', '村务公告', '便民办事', '民宿预订'
])

/* ========== 搜索结果 ========== */
const loading = ref(false)
const resultList = ref([])
const hasSearched = ref(false)
const page = ref(1)
const hasMore = ref(false)
const total = ref(0)

// 按分类过滤本地结果
const filteredResults = computed(() => {
  if (activeTab.value === 'all') return resultList.value
  return resultList.value.filter(item => item.module === activeTab.value)
})

// 是否显示历史/热门（未搜索时）
const showSuggest = computed(() => !hasSearched.value && !keyword.value.trim())

/* ========== 搜索状态描述 ========== */
const emptyText = computed(() => {
  if (!hasSearched.value) return ''
  if (loading.value) return '搜索中...'
  if (filteredResults.value.length === 0) return '未找到相关内容'
  return ''
})

/* ========== 执行搜索 ========== */
async function doSearch(isLoadMore = false) {
  const word = keyword.value.trim()
  if (!word) return

  if (!isLoadMore) {
    page.value = 1
    resultList.value = []
  }

  loading.value = true
  hasSearched.value = true

  try {
    // 根据 Tab 决定调用哪些 API
    const requests = []
    const tab = activeTab.value

    if (tab === 'all' || tab === 'mall') {
      requests.push(
        searchProducts({ keyword: word, page: page.value, size: 10 })
          .then(res => formatResults(res.data.list || [], 'mall'))
          .catch(() => [])
      )
    }
    if (tab === 'all' || tab === 'village') {
      requests.push(
        getNoticeList({ page: page.value, size: 10, keyword: word })
          .then(res => formatResults(res.data.list || [], 'village'))
          .catch(() => [])
      )
    }
    if (tab === 'all' || tab === 'travel') {
      requests.push(
        getSpotList({ page: page.value, size: 10, keyword: word })
          .then(res => formatResults(res.data.list || [], 'travel'))
          .catch(() => [])
      )
    }
    if (tab === 'all' || tab === 'market') {
      requests.push(
        getMarketList({ page: page.value, size: 10, keyword: word })
          .then(res => formatResults(res.data.list || [], 'market'))
          .catch(() => [])
      )
    }
    if (tab === 'all' || tab === 'job') {
      requests.push(
        getJobList({ page: page.value, size: 10, keyword: word })
          .then(res => formatResults(res.data.list || [], 'job'))
          .catch(() => [])
      )
    }

    const results = await Promise.all(requests)
    const merged = results.flat()

    if (page.value === 1) {
      resultList.value = merged
      // 搜索成功后保存历史
      saveHistory(word)
    } else {
      resultList.value.push(...merged)
    }

    hasMore.value = merged.length >= 10
    total.value = resultList.value.length
  } catch (e) {
    console.error('搜索失败', e)
    uni.showToast({ title: '搜索失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 将 API 返回统一格式
function formatResults(list, module) {
  return (list || []).map(item => ({
    ...item,
    _module: module,
    module,
    // 统一字段名
    title: item.title || item.name || '',
    image: item.image || item.cover || item.images?.[0] || '',
    desc: item.description || item.summary || item.desc || item.intro || '',
    tag: module === 'mall' ? (item.price ? '¥' + item.price : '') :
         module === 'village' ? '公告' :
         module === 'travel' ? '景点' :
         module === 'market' ? '闲置' : '招工'
  }))
}

// 防抖搜索
function onInput(e) {
  keyword.value = e.detail?.value ?? e
  if (searchTimer) clearTimeout(searchTimer)
  if (keyword.value.trim()) {
    searchTimer = setTimeout(() => doSearch(), 400)
  } else {
    hasSearched.value = false
    resultList.value = []
  }
}

// 点击搜索按钮
function onSearch() {
  if (keyword.value.trim()) {
    doSearch()
  }
}

// 清除输入
function onClear() {
  keyword.value = ''
  hasSearched.value = false
  resultList.value = []
  if (searchTimer) clearTimeout(searchTimer)
}

// 点击搜索建议
function onTapSuggestion(word) {
  keyword.value = word
  doSearch()
}

// 切换 Tab
function switchTab(tabId) {
  activeTab.value = tabId
  if (keyword.value.trim()) {
    doSearch()
  }
}

// 加载更多
function loadMore() {
  if (loading.value || !hasMore.value) return
  page.value++
  doSearch(true)
}

// 跳转详情
function goDetail(item) {
  let url = ''
  switch (item.module) {
    case 'mall':
      url = `/pages/mall/detail?id=${item.id}`
      break
    case 'village':
      url = `/pages/village/detail?id=${item.id}`
      break
    case 'travel':
      url = `/pages/travel/index?id=${item.id}`
      break
    case 'market':
      url = `/pages/marketplace/index?id=${item.id}`
      break
    case 'job':
      url = `/pages/job/index?id=${item.id}`
      break
  }
  if (url) uni.navigateTo({ url })
}

// 返回上一页
function goBack() {
  uni.navigateBack()
}

onMounted(() => {
  // 关闭首页传来的 loading
  uni.hideLoading()
  
  loadHistory()
  
  // 从 URL 参数读取预选 tab
  // #ifdef MP-WEIXIN
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const tab = currentPage?.options?.tab
  if (tab && tabs.find(t => t.id === tab)) {
    activeTab.value = tab
  }
  // #endif
})
</script>

<template>
  <view class="page-search">
    <!-- 搜索头部（自定义导航，填满状态栏区域） -->
    <view class="search-header-wrap">
      <view class="search-status-bar" :style="{ height: (statusBarHeight + 44) + 'px' }"></view>
      <view class="search-header">
        <view class="search-back" @click="goBack">
          <text class="iconfont icon-back"></text>
        </view>
        <view class="search-input-wrapper">
          <text class="iconfont icon-search search-input-icon"></text>
          <input
            class="search-input"
            v-model="keyword"
            placeholder="搜索服务、商品、公告..."
            confirm-type="search"
            @input="onInput"
            @confirm="onSearch"
            :focus="true"
          />
          <text
            v-if="keyword"
            class="iconfont icon-add search-clear"
            @click="onClear"
          ></text>
        </view>
        <text class="search-btn" @click="onSearch">搜索</text>
      </view>
    </view>

    <!-- 分类 Tab -->
    <scroll-view class="tab-scroll" scroll-x>
      <view
        class="tab-item"
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        <text class="tab-label">{{ tab.label }}</text>
      </view>
    </scroll-view>

    <!-- 搜索历史 & 热门（未搜索时） -->
    <view class="suggest-section" v-if="showSuggest">
      <!-- 搜索历史 -->
      <view class="history-section" v-if="historyList.length">
        <view class="suggest-header">
          <text class="suggest-title">搜索历史</text>
          <text class="suggest-action" @click="clearHistory">
            <text class="iconfont icon-add suggest-del-icon"></text>
            清空
          </text>
        </view>
        <view class="history-tags">
          <view
            class="history-tag"
            v-for="(word, index) in historyList"
            :key="index"
            @click="onTapSuggestion(word)"
          >
            <text class="tag-text">{{ word }}</text>
            <text
              class="tag-close iconfont icon-add"
              @click.stop="deleteHistoryItem(index)"
            ></text>
          </view>
        </view>
      </view>

      <!-- 热门搜索 -->
      <view class="hot-section">
        <view class="suggest-header">
          <text class="suggest-title">🔥 热门搜索</text>
        </view>
        <view class="hot-tags">
          <view
            class="hot-tag"
            v-for="(word, index) in hotList"
            :key="index"
            :class="{ 'hot-top': index < 3 }"
            @click="onTapSuggestion(word)"
          >
            <text class="hot-index" v-if="index < 3">{{ index + 1 }}</text>
            <text class="hot-text">{{ word }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="result-section" v-if="hasSearched">
      <!-- 加载中 -->
      <view class="loading-state" v-if="loading && !resultList.length">
        <text>搜索中...</text>
      </view>

      <!-- 结果列表 -->
      <view class="result-list" v-if="filteredResults.length">
        <view class="result-item" v-for="item in filteredResults" :key="item.id"
          @click="goDetail(item)">
          <image
            class="result-image"
            :src="item.image || '/static/images/placeholder.png'"
            mode="aspectFill"
          />
          <view class="result-info">
            <view class="result-title-row">
              <text class="result-tag" :class="`tag-${item.module}`">{{ item.tag }}</text>
              <text class="result-title text-ellipsis">{{ item.title }}</text>
            </view>
            <text class="result-desc text-ellipsis-2" v-if="item.desc">{{ item.desc }}</text>
            <view class="result-meta" v-if="item.price">
              <text class="result-price">¥{{ item.price }}</text>
            </view>
          </view>
          <text class="iconfont icon-arrow-right result-arrow"></text>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="filteredResults.length && hasMore">
        <text v-if="loading">加载中...</text>
        <text v-else class="load-more-text" @click="loadMore">加载更多</text>
      </view>

      <!-- 没有更多 -->
      <view class="no-more" v-if="filteredResults.length && !hasMore">
        <text>— 共 {{ total }} 条结果 —</text>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="!loading && !filteredResults.length">
        <text class="empty-icon iconfont icon-search"></text>
        <text class="empty-text">未找到相关内容</text>
        <text class="empty-hint">换个关键词试试吧</text>
      </view>
    </view>

    <!-- 底部安全区 -->
    <view class="safe-bottom"></view>
  </view>
</template>

<style lang="scss" scoped>
.page-search {
  min-height: 100vh;
  background: $bg-page;
}

/* ===== 搜索头部（填满状态栏区域） ===== */
.search-header-wrap {
  background: $primary;
}

.search-status-bar {
  width: 100%;
}

.search-header {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 24rpx;
  margin-bottom: 0;

  .search-back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 36rpx;
  }

  .search-input-wrapper {
    flex: 1;
    height: 64rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    padding: 0 16rpx;

    .search-input-icon {
      color: $text-hint;
      font-size: 32rpx;
      margin: 0 8rpx;
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      height: 100%;
      font-size: 28rpx;
      color: $text-primary;
      padding: 0 8rpx;
    }

    .search-clear {
      color: $text-hint;
      font-size: 32rpx;
      padding: 8rpx;
      transform: rotate(45deg);
    }
  }

  .search-btn {
    color: #fff;
    font-size: 28rpx;
    padding: 0 16rpx;
    flex-shrink: 0;
  }
}

/* ===== 分类 Tab ===== */
.tab-scroll {
  white-space: nowrap;
  background: #fff;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $border-light;

  .tab-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 100rpx;
    height: 56rpx;
    padding: 0 28rpx;
    margin: 0 8rpx;
    border-radius: 28rpx;
    background: $bg-page;
    transition: all 0.2s;

    .tab-label {
      font-size: 26rpx;
      color: $text-secondary;
    }

    &.active {
      background: $primary-bg;

      .tab-label {
        color: $primary;
        font-weight: 600;
      }
    }
  }
}

/* ===== 搜索建议区域 ===== */
.suggest-section {
  padding: 24rpx 32rpx;
}

.suggest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .suggest-title {
    font-size: 30rpx;
    font-weight: 600;
    color: $text-primary;
  }

  .suggest-action {
    font-size: 24rpx;
    color: $text-hint;
    display: flex;
    align-items: center;

    .suggest-del-icon {
      font-size: 28rpx;
      margin-right: 4rpx;
      transform: rotate(45deg);
    }
  }
}

/* 历史标签 */
.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .history-tag {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 24rpx;
    padding: 10rpx 16rpx 10rpx 24rpx;
    border: 1rpx solid $border-light;

    .tag-text {
      font-size: 26rpx;
      color: $text-secondary;
      max-width: 200rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tag-close {
      font-size: 24rpx;
      color: $text-hint;
      margin-left: 8rpx;
      padding: 4rpx;
      transform: rotate(45deg);
    }
  }
}

/* 热门标签 */
.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .hot-tag {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 24rpx;
    padding: 10rpx 24rpx;
    border: 1rpx solid $border-light;

    .hot-index {
      font-size: 22rpx;
      color: $primary;
      font-weight: bold;
      margin-right: 6rpx;
    }

    .hot-text {
      font-size: 26rpx;
      color: $text-secondary;
    }

    &.hot-top {
      background: $primary-bg;
      border-color: $primary-light;

      .hot-text {
        color: $primary;
      }
    }
  }
}

/* ===== 搜索结果 ===== */
.result-section {
  padding: 0 0 40rpx;
}

.loading-state {
  text-align: center;
  padding: 80rpx 0;
  color: $text-hint;
  font-size: 28rpx;
}

.result-list {
  .result-item {
    display: flex;
    align-items: center;
    padding: 24rpx 32rpx;
    background: #fff;
    margin-bottom: 1rpx;
    border-bottom: 1rpx solid $border-light;

    .result-image {
      width: 120rpx;
      height: 120rpx;
      border-radius: $radius-md;
      flex-shrink: 0;
      background: $bg-page;
    }

    .result-info {
      flex: 1;
      margin-left: 20rpx;
      min-width: 0;

      .result-title-row {
        display: flex;
        align-items: center;

        .result-tag {
          flex-shrink: 0;
          font-size: 20rpx;
          padding: 2rpx 10rpx;
          border-radius: 6rpx;
          margin-right: 12rpx;
          color: #fff;

          &.tag-mall { background: $aux-orange; }
          &.tag-village { background: $aux-blue; }
          &.tag-travel { background: $aux-purple; }
          &.tag-market { background: $aux-green; }
          &.tag-job { background: $primary; }
        }

        .result-title {
          font-size: 28rpx;
          color: $text-primary;
          font-weight: 500;
          flex: 1;
        }
      }

      .result-desc {
        font-size: 24rpx;
        color: $text-hint;
        margin-top: 8rpx;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .result-meta {
        margin-top: 8rpx;

        .result-price {
          font-size: 32rpx;
          color: $aux-red;
          font-weight: bold;
        }
      }
    }

    .result-arrow {
      color: $text-hint;
      font-size: 28rpx;
      flex-shrink: 0;
      margin-left: 12rpx;
    }
  }
}

.load-more {
  text-align: center;
  padding: 32rpx;
  color: $text-hint;
  font-size: 26rpx;

  .load-more-text {
    color: $primary;
  }
}

.no-more {
  text-align: center;
  padding: 32rpx;
  color: $text-hint;
  font-size: 24rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;

  .empty-icon {
    font-size: 80rpx;
    color: $text-hint;
    opacity: 0.4;
  }

  .empty-text {
    font-size: 30rpx;
    color: $text-secondary;
    margin-top: 24rpx;
  }

  .empty-hint {
    font-size: 24rpx;
    color: $text-hint;
    margin-top: 12rpx;
  }
}

/* 底部安全区 */
.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>

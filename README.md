# 东篱 · 乡村综合服务小程序

> 采菊东篱下，悠然见南山 —— 陶渊明

基于 uni-app (Vue 3) 开发的乡村综合服务平台微信小程序，涵盖村务公告、农产品商城、乡村旅游、闲置集市、招工求职等功能。

## 技术栈

| 分类 | 技术 |
|------|------|
| 前端框架 | uni-app (Vue 3 + Composition API) |
| 状态管理 | Pinia |
| 日期处理 | dayjs |
| 样式方案 | SCSS |
| 构建工具 | Vite + @dcloudio/vite-plugin-uni |
| 后端模拟 | Express (Mock 数据) |
| 目标平台 | 微信小程序 / H5 |

## 项目结构

```
uni-app/
├── api/                  # 接口封装（按模块划分）
│   ├── user.js           # 用户接口
│   ├── mall.js           # 商城接口
│   ├── village.js        # 村务接口
│   ├── travel.js         # 旅游接口
│   ├── job.js            # 招工接口
│   ├── marketplace.js    # 集市接口
│   └── index.js          # 首页接口
├── components/           # 公共组件
├── custom-tab-bar/       # 自定义 TabBar
├── pages/                # 页面目录
│   ├── index/            # 首页
│   ├── village/          # 村务公告
│   ├── mall/             # 农产品商城
│   ├── travel/           # 乡村旅游
│   ├── marketplace/      # 闲置集市
│   ├── job/              # 招工求职
│   ├── user/             # 个人中心
│   └── order/            # 订单管理
├── server/               # Mock 后端服务
├── static/               # 静态资源
├── styles/               # 全局样式
├── utils/                # 工具函数
│   ├── request.js        # 网络请求封装
│   └── auth.js           # 鉴权工具
├── App.vue               # 应用入口
├── main.js               # 主入口
├── manifest.json         # 应用配置
├── pages.json            # 页面路由配置
├── vite.config.js        # Vite 构建配置
└── uni.scss              # uni-app 全局样式变量
```

## 环境要求

- **Node.js** >= 16
- **微信开发者工具** （小程序开发）
- **uni-app CLI**（全局安装）

## 快速开始

### 1. 安装依赖

```bash
# 全局安装 uni-app CLI
npm install -g @dcloudio/uni-cli

# 安装项目依赖
npm install
```

### 2. 启动 Mock 后端

```bash
cd server
node index.js
# 服务运行在 http://localhost:3001
```

### 3. 启动开发服务

```bash
# 微信小程序
npm run dev:mp-weixin

# H5
npm run dev:h5
```

### 4. 预览

- **微信小程序**：打开微信开发者工具 → 导入 `unpackage/dist/dev/mp-weixin`
- **H5**：浏览器打开 `http://localhost:3000`

## 生产构建

```bash
# 微信小程序
npm run build:mp-weixin

# H5
npm run build:h5
```

生产构建会自动：
- 移除所有 `console.*` 和 `debugger` 语句
- 代码压缩与 Tree Shaking
- CSS 代码分割

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev:mp-weixin` | 微信小程序开发模式 |
| `npm run dev:h5` | H5 开发模式 |
| `npm run build:mp-weixin` | 微信小程序生产构建 |
| `npm run build:h5` | H5 生产构建 |

## 功能模块

- **村务公告** — 通知公告、便民办事
- **农产品商城** — 商品浏览、购物车、下单支付、订单管理
- **乡村旅游** — 景点浏览、酒店预订
- **闲置集市** — 二手物品发布与浏览
- **招工求职** — 岗位发布与应聘
- **个人中心** — 登录注册、资料编辑、收货地址、消息通知

## License

MIT

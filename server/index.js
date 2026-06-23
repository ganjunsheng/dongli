const express = require('express');
const cors = require('cors');
const data = require('./mock-data');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ==================== 通用分页 ====================
function paginate(list, page = 1, size = 10) {
  const start = (page - 1) * size;
  const items = list.slice(start, start + size);
  return {
    list: items,
    total: list.length,
    page,
    size,
    totalPages: Math.ceil(list.length / size)
  };
}

// ==================== 用户 ====================
app.post('/api/user/login', (req, res) => {
  const { phone, code } = req.body;
  if (!phone && !code) {
    return res.json({ code: 401, msg: '手机号或验证码不能为空' });
  }
  res.json({ code: 0, msg: '登录成功', data: { token: data.users.token, ...data.users.info } });
});

app.get('/api/user/info', (req, res) => {
  res.json({ code: 0, data: data.users.info });
});

app.put('/api/user/update', (req, res) => {
  Object.assign(data.users.info, req.body);
  res.json({ code: 0, msg: '更新成功', data: data.users.info });
});

app.post('/api/user/phone', (req, res) => {
  res.json({ code: 0, data: { phoneNumber: '138****5678' } });
});

// 地址
const addresses = [];
let addrId = 0;
app.get('/api/user/address/list', (req, res) => {
  res.json({ code: 0, data: paginate(addresses, req.query.page, req.query.size) });
});
app.post('/api/user/address/add', (req, res) => {
  const addr = { id: ++addrId, ...req.body };
  addresses.push(addr);
  res.json({ code: 0, msg: '添加成功', data: addr });
});
app.put('/api/user/address/update/:id', (req, res) => {
  const idx = addresses.findIndex(a => a.id == req.params.id);
  if (idx > -1) addresses[idx] = { ...addresses[idx], ...req.body };
  res.json({ code: 0, msg: '更新成功' });
});
app.delete('/api/user/address/delete/:id', (req, res) => {
  const idx = addresses.findIndex(a => a.id == req.params.id);
  if (idx > -1) addresses.splice(idx, 1);
  res.json({ code: 0, msg: '删除成功' });
});

// ==================== 村务 ====================
app.get('/api/village/notice/list', (req, res) => {
  res.json({ code: 0, data: paginate(data.notices, req.query.page, req.query.size) });
});
app.get('/api/village/notice/detail/:id', (req, res) => {
  const item = data.notices.find(n => n.id == req.params.id);
  res.json(item ? { code: 0, data: item } : { code: 404, msg: '公告不存在' });
});

app.get('/api/village/service/categories', (req, res) => {
  res.json({ code: 0, data: data.serviceCategories });
});
app.get('/api/village/service/list', (req, res) => {
  let list = data.services;
  if (req.query.categoryId) list = list.filter(s => s.categoryId == req.query.categoryId);
  res.json({ code: 0, data: paginate(list, req.query.page, req.query.size) });
});
app.get('/api/village/service/guide/:id', (req, res) => {
  const item = data.services.find(s => s.id == req.params.id);
  res.json(item ? { code: 0, data: item } : { code: 404, msg: '不存在' });
});
app.post('/api/village/service/apply', (req, res) => {
  res.json({ code: 0, msg: '申请已提交', data: { id: Date.now() } });
});
app.get('/api/village/service/my', (req, res) => {
  res.json({ code: 0, data: paginate([], req.query.page, req.query.size) });
});

// ==================== 商城 ====================
app.get('/api/mall/product/list', (req, res) => {
  res.json({ code: 0, data: paginate(data.products, req.query.page, req.query.size) });
});
app.get('/api/mall/product/detail/:id', (req, res) => {
  const item = data.products.find(p => p.id == req.params.id);
  res.json(item ? { code: 0, data: item } : { code: 404, msg: '商品不存在' });
});
app.get('/api/mall/product/search', (req, res) => {
  const kw = req.query.keyword || '';
  const list = data.products.filter(p => p.name.includes(kw));
  res.json({ code: 0, data: paginate(list, req.query.page, req.query.size) });
});
app.get('/api/mall/category/list', (req, res) => {
  res.json({ code: 0, data: data.categories });
});

// 购物车
const cart = [];
let cartItemId = 0;
app.get('/api/mall/cart/list', (req, res) => {
  res.json({ code: 0, data: cart });
});
app.post('/api/mall/cart/add', (req, res) => {
  const item = { id: ++cartItemId, ...req.body, quantity: 1 };
  cart.push(item);
  res.json({ code: 0, msg: '已加入购物车', data: item });
});
app.put('/api/mall/cart/update/:id', (req, res) => {
  const idx = cart.findIndex(c => c.id == req.params.id);
  if (idx > -1) cart[idx].quantity = req.body.quantity;
  res.json({ code: 0, msg: '已更新' });
});
app.delete('/api/mall/cart/delete/:id', (req, res) => {
  const idx = cart.findIndex(c => c.id == req.params.id);
  if (idx > -1) cart.splice(idx, 1);
  res.json({ code: 0, msg: '已删除' });
});

// 订单
const orders = [];
let orderId = 6;

// 模拟订单数据
orders.push(
  { id: 1, orderNo: '202606230001', status: '待支付', createTime: '2026-06-23T08:00:00', totalAmount: 58.00,
    items: [{ name: '有机大米 5kg', image: '/static/images/default/avatar.png', price: 58.00, quantity: 1, spec: '5kg装' }] },
  { id: 2, orderNo: '202606230002', status: '待支付', createTime: '2026-06-23T09:00:00', totalAmount: 36.00,
    items: [{ name: '土鸡蛋 30枚', image: '/static/images/default/avatar.png', price: 36.00, quantity: 1, spec: '30枚装' }] },
  { id: 3, orderNo: '202606220001', status: '已支付', createTime: '2026-06-22T10:00:00', totalAmount: 128.00,
    items: [{ name: '新鲜蔬菜礼盒', image: '/static/images/default/avatar.png', price: 78.00, quantity: 1, spec: '礼盒装' },
            { name: '农家蜂蜜 500g', image: '/static/images/default/avatar.png', price: 50.00, quantity: 1, spec: '500g' }] },
  { id: 4, orderNo: '202606210001', status: '已发货', createTime: '2026-06-21T08:00:00', totalAmount: 45.00,
    items: [{ name: '手工豆腐干 2斤', image: '/static/images/default/avatar.png', price: 45.00, quantity: 1, spec: '2斤装' }] },
  { id: 5, orderNo: '202606200001', status: '已发货', createTime: '2026-06-20T09:00:00', totalAmount: 89.00,
    items: [{ name: '野生菌干货 500g', image: '/static/images/default/avatar.png', price: 89.00, quantity: 1, spec: '500g' }] },
  { id: 6, orderNo: '202606190001', status: '已发货', createTime: '2026-06-19T11:00:00', totalAmount: 156.00,
    items: [{ name: '农家腊肉 2斤', image: '/static/images/default/avatar.png', price: 78.00, quantity: 2, spec: '1斤装' }] }
);
app.post('/api/mall/order/create', (req, res) => {
  const order = { id: ++orderId, ...req.body, status: '待支付', createTime: new Date().toISOString() };
  orders.push(order);
  res.json({ code: 0, msg: '下单成功', data: order });
});
app.get('/api/mall/order/list', (req, res) => {
  res.json({ code: 0, data: paginate(orders, req.query.page, req.query.size) });
});
app.get('/api/mall/order/detail/:id', (req, res) => {
  const item = orders.find(o => o.id == req.params.id);
  res.json(item ? { code: 0, data: item } : { code: 404, msg: '订单不存在' });
});
app.put('/api/mall/order/cancel/:id', (req, res) => {
  const item = orders.find(o => o.id == req.params.id);
  if (item) item.status = '已取消';
  res.json({ code: 0, msg: '已取消' });
});
app.post('/api/mall/order/pay', (req, res) => {
  const item = orders.find(o => o.id == req.body.id);
  if (item) item.status = '已支付';
  res.json({ code: 0, msg: '支付成功' });
});

// ==================== 旅游 ====================
app.get('/api/travel/spot/list', (req, res) => {
  res.json({ code: 0, data: paginate(data.spots, req.query.page, req.query.size) });
});
app.get('/api/travel/spot/detail/:id', (req, res) => {
  const item = data.spots.find(s => s.id == req.params.id);
  res.json(item ? { code: 0, data: item } : { code: 404, msg: '不存在' });
});
app.get('/api/travel/hotel/list', (req, res) => {
  res.json({ code: 0, data: paginate(data.hotels, req.query.page, req.query.size) });
});
app.get('/api/travel/hotel/detail/:id', (req, res) => {
  const item = data.hotels.find(h => h.id == req.params.id);
  res.json(item ? { code: 0, data: item } : { code: 404, msg: '不存在' });
});
app.post('/api/travel/hotel/book', (req, res) => {
  res.json({ code: 0, msg: '预订成功', data: { bookingId: Date.now() } });
});
app.get('/api/travel/guide/list', (req, res) => {
  res.json({ code: 0, data: paginate([], req.query.page, req.query.size) });
});
app.get('/api/travel/guide/detail/:id', (req, res) => {
  res.json({ code: 404, msg: '攻略不存在' });
});

// ==================== 闲置集市 ====================
app.get('/api/marketplace/list', (req, res) => {
  res.json({ code: 0, data: paginate(data.markets, req.query.page, req.query.size) });
});
app.get('/api/marketplace/detail/:id', (req, res) => {
  const item = data.markets.find(m => m.id == req.params.id);
  res.json(item ? { code: 0, data: item } : { code: 404, msg: '不存在' });
});
app.post('/api/marketplace/publish', (req, res) => {
  const item = { id: Date.now(), ...req.body, publishTime: new Date().toISOString().split('T')[0] };
  data.markets.unshift(item);
  res.json({ code: 0, msg: '发布成功', data: item });
});
app.put('/api/marketplace/update/:id', (req, res) => {
  const idx = data.markets.findIndex(m => m.id == req.params.id);
  if (idx > -1) data.markets[idx] = { ...data.markets[idx], ...req.body };
  res.json({ code: 0, msg: '更新成功' });
});
app.delete('/api/marketplace/delete/:id', (req, res) => {
  const idx = data.markets.findIndex(m => m.id == req.params.id);
  if (idx > -1) data.markets.splice(idx, 1);
  res.json({ code: 0, msg: '已删除' });
});
app.get('/api/marketplace/my', (req, res) => {
  res.json({ code: 0, data: paginate(data.markets.slice(0, 2), req.query.page, req.query.size) });
});

// ==================== 招工求职 ====================
app.get('/api/job/list', (req, res) => {
  let list = data.jobs;
  if (req.query.type) list = list.filter(j => j.type == req.query.type);
  res.json({ code: 0, data: paginate(list, req.query.page, req.query.size) });
});
app.get('/api/job/detail/:id', (req, res) => {
  const item = data.jobs.find(j => j.id == req.params.id);
  res.json(item ? { code: 0, data: item } : { code: 404, msg: '不存在' });
});
app.post('/api/job/hire/publish', (req, res) => {
  const item = { id: Date.now(), type: 'hire', ...req.body, publishTime: new Date().toISOString().split('T')[0] };
  data.jobs.unshift(item);
  res.json({ code: 0, msg: '发布成功', data: item });
});
app.post('/api/job/seek/publish', (req, res) => {
  const item = { id: Date.now(), type: 'seek', ...req.body, publishTime: new Date().toISOString().split('T')[0] };
  data.jobs.unshift(item);
  res.json({ code: 0, msg: '发布成功', data: item });
});
app.put('/api/job/update/:id', (req, res) => {
  const idx = data.jobs.findIndex(j => j.id == req.params.id);
  if (idx > -1) data.jobs[idx] = { ...data.jobs[idx], ...req.body };
  res.json({ code: 0, msg: '更新成功' });
});
app.delete('/api/job/delete/:id', (req, res) => {
  const idx = data.jobs.findIndex(j => j.id == req.params.id);
  if (idx > -1) data.jobs.splice(idx, 1);
  res.json({ code: 0, msg: '已删除' });
});
app.get('/api/job/my', (req, res) => {
  res.json({ code: 0, data: paginate(data.jobs.slice(0, 2), req.query.page, req.query.size) });
});

// ==================== 上传 ====================
app.post('/api/upload/avatar', (req, res) => {
  res.json({ code: 0, data: { url: '/static/images/default-avatar.png' } });
});

// ==================== 启动 ====================
app.listen(PORT, () => {
  console.log(`\n  ✅ 东篱 API 服务已启动`);
  console.log(`  📡 地址: http://localhost:${PORT}`);
  console.log(`  📋 共 ${Object.keys(data).length} 个数据模块\n`);
});

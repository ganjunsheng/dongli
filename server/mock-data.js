// 模拟数据
module.exports = {
  // ========== 用户 ==========
  users: {
    token: 'mock_token_abc123',
    info: {
      id: 1,
      nickname: '村民小王',
      avatar: '/static/images/default-avatar.png',
      phone: '138****5678',
      village: '青山村',
      intro: '热爱乡村生活'
    }
  },

  // ========== 公告 ==========
  notices: [
    {
      id: 1,
      title: '关于2024年度新农合缴费的通知',
      content: '根据上级部门通知，2024年度新型农村合作医疗缴费工作即将开始。请各位村民携带身份证、户口本到村委会办理。缴费标准为每人每年380元，缴费时间为2024年1月1日至3月31日。请相互转告，按时缴费。',
      type: '紧急',
      tag: '重要',
      publishTime: '2024-01-10',
      publisher: '村委会',
      views: 1256
    },
    {
      id: 2,
      title: '青山村人居环境整治行动公告',
      content: '为改善我村人居环境，提升村民生活质量，村委会决定在全村范围内开展为期一个月的人居环境整治行动。请各户村民积极配合，自觉清理房前屋后垃圾，维护公共区域卫生。',
      type: '通知',
      tag: '环境',
      publishTime: '2024-01-08',
      publisher: '村委会',
      views: 892
    },
    {
      id: 3,
      title: '春节返乡人员信息登记通知',
      content: '春节将至，为做好返乡人员服务保障工作，请各村小组组长做好返乡人员信息登记，包括姓名、身份证号、返乡时间、出发地等信息，于1月20日前报村委会汇总。',
      type: '通知',
      tag: '返乡',
      publishTime: '2024-01-05',
      publisher: '村委会',
      views: 1568
    },
    {
      id: 4,
      title: '关于开展"美丽庭院"评选活动的通知',
      content: '为推进美丽乡村建设，激发村民参与环境整治的积极性，决定在全村开展"美丽庭院"评选活动。评选标准包括庭院整洁、绿化美化、垃圾分类等。欢迎各位村民踊跃报名参加。',
      type: '通知',
      tag: '活动',
      publishTime: '2024-01-03',
      publisher: '村妇联',
      views: 678
    },
    {
      id: 5,
      title: '冬季防火安全提醒',
      content: '冬季天干物燥，是火灾高发期。请各位村民注意用电安全，不私拉乱接电线，使用取暖设备时注意远离易燃物，外出时关闭电源。发现火情请立即拨打119。',
      type: '安全',
      tag: '安全',
      publishTime: '2024-01-01',
      publisher: '村委会',
      views: 2345
    }
  ],

  // ========== 商品 ==========
  products: [
    {
      id: 1,
      name: '青山村土鸡蛋（30枚装）',
      price: 45.00,
      originalPrice: 58.00,
      image: '/static/images/product/egg.png',
      images: ['/static/images/product/egg.png'],
      categoryId: 1,
      categoryName: '农副产品',
      sales: 2356,
      stock: 100,
      unit: '箱',
      origin: '青山村散养基地',
      desc: '纯天然散养土鸡蛋，不添加任何激素和抗生素，蛋黄金黄饱满，营养丰富。',
      isHot: true,
      isFree: false
    },
    {
      id: 2,
      name: '有机大米（5kg装）',
      price: 68.00,
      originalPrice: 88.00,
      image: '/static/images/product/rice.png',
      images: ['/static/images/product/rice.png'],
      categoryId: 1,
      categoryName: '农副产品',
      sales: 1523,
      stock: 200,
      unit: '袋',
      origin: '青山村有机农田',
      desc: '青山村自产有机大米，不使用化肥农药，口感香糯，健康放心。',
      isHot: true,
      isFree: false
    },
    {
      id: 3,
      name: '野生山茶油（500ml）',
      price: 128.00,
      originalPrice: 168.00,
      image: '/static/images/product/oil.png',
      images: ['/static/images/product/oil.png'],
      categoryId: 1,
      categoryName: '农副产品',
      sales: 856,
      stock: 50,
      unit: '瓶',
      origin: '青山村老茶树林',
      desc: '采用百年老茶树的茶籽，古法压榨，纯天然无添加。',
      isHot: false,
      isFree: false
    },
    {
      id: 4,
      name: '手工红薯粉条（1kg）',
      price: 25.00,
      originalPrice: 35.00,
      image: '/static/images/product/noodle.png',
      images: ['/static/images/product/noodle.png'],
      categoryId: 1,
      categoryName: '农副产品',
      sales: 3201,
      stock: 300,
      unit: '袋',
      origin: '青山村老作坊',
      desc: '传统手工制作，纯红薯淀粉，不含任何添加剂，Q弹爽滑。',
      isHot: true,
      isFree: false
    },
    {
      id: 5,
      name: '农家土蜂蜜（500g）',
      price: 88.00,
      originalPrice: 108.00,
      image: '/static/images/product/honey.png',
      images: ['/static/images/product/honey.png'],
      categoryId: 1,
      categoryName: '农副产品',
      sales: 567,
      stock: 30,
      unit: '瓶',
      origin: '青山村蜜蜂养殖基地',
      desc: '百花蜂蜜，自然成熟封盖蜜，不添加任何糖分，纯正天然。',
      isHot: false,
      isFree: true
    },
    {
      id: 6,
      name: '手工竹编制品（果篮）',
      price: 58.00,
      originalPrice: 78.00,
      image: '/static/images/product/bamboo.png',
      images: ['/static/images/product/bamboo.png'],
      categoryId: 2,
      categoryName: '手工艺品',
      sales: 234,
      stock: 20,
      unit: '个',
      origin: '青山村竹编合作社',
      desc: '选用优质毛竹，由老手艺人纯手工编制，美观实用。',
      isHot: false,
      isFree: false
    }
  ],

  // ========== 商品分类 ==========
  categories: [
    { id: 1, name: '农副产品', icon: 'farm' },
    { id: 2, name: '手工艺品', icon: 'craft' },
    { id: 3, name: '新鲜蔬菜', icon: 'vege' },
    { id: 4, name: '特色小吃', icon: 'snack' }
  ],

  // ========== 便民办事 ==========
  serviceCategories: [
    { id: 1, name: '户籍办理', icon: 'idcard', count: 3 },
    { id: 2, name: '社保医保', icon: 'social', count: 4 },
    { id: 3, name: '农业补贴', icon: 'farm', count: 2 },
    { id: 4, name: '建房审批', icon: 'house', count: 2 },
    { id: 5, name: '民政救助', icon: 'help', count: 3 },
    { id: 6, name: '其他服务', icon: 'more', count: 5 }
  ],

  services: [
    { id: 1, categoryId: 1, name: '新生儿入户登记', guide: '携带父母身份证、户口本、出生医学证明到户籍窗口办理。', deadline: '出生后一个月内', fee: '免费' },
    { id: 2, categoryId: 1, name: '户口迁移', guide: '携带身份证、户口本、迁移证明到户籍窗口办理。', deadline: '15个工作日', fee: '免费' },
    { id: 3, categoryId: 1, name: '身份证办理', guide: '携带户口本到派出所采集指纹和照片。', deadline: '20个工作日', fee: '20元' },
    { id: 4, categoryId: 2, name: '新农合参保', guide: '携带身份证、户口本到社保窗口办理。', deadline: '即办即结', fee: '380元/年' },
    { id: 5, categoryId: 2, name: '养老保险参保', guide: '年满16周岁未参加城镇职工养老保险的农村居民可参保。', deadline: '5个工作日', fee: '按档缴纳' },
    { id: 6, categoryId: 2, name: '医疗报销申请', guide: '携带医疗费用票据、身份证、社保卡到医保窗口办理。', deadline: '30个工作日', fee: '免费' },
    { id: 7, categoryId: 2, name: '社保卡办理', guide: '携带身份证到社保窗口或银行网点办理。', deadline: '30个工作日', fee: '免费' },
    { id: 8, categoryId: 3, name: '耕地地力保护补贴', guide: '种植粮食作物的农户可申请，携带土地承包合同办理。', deadline: '每年3月前', fee: '免费' },
    { id: 9, categoryId: 3, name: '农机购置补贴', guide: '购买指定农机具后可申请补贴，携带购机发票和身份证办理。', deadline: '购机后30日内', fee: '免费' }
  ],

  // ========== 旅游景点 ==========
  spots: [
    {
      id: 1,
      name: '青山湖生态景区',
      image: '/static/images/travel/spot1.png',
      images: ['/static/images/travel/spot1.png'],
      rating: 4.8,
      price: 30,
      address: '青山村北3公里',
      tags: ['自然风光', '垂钓', '露营'],
      desc: '青山湖水面面积约500亩，湖水清澈，四周青山环绕，是休闲度假的好去处。景区内设有垂钓区、露营区、烧烤区等设施。',
      openTime: '08:00-18:00',
      phone: '138xxxx5678'
    },
    {
      id: 2,
      name: '古村落文化遗址',
      image: '/static/images/travel/spot2.png',
      images: ['/static/images/travel/spot2.png'],
      rating: 4.5,
      price: 20,
      address: '青山村东2公里',
      tags: ['历史文化', '古建筑', '民俗'],
      desc: '保存完好的明清古建筑群，包括祠堂、戏台、古井等，展现了传统农村的建筑风貌和文化底蕴。',
      openTime: '09:00-17:00',
      phone: '139xxxx9012'
    },
    {
      id: 3,
      name: '百亩油菜花田',
      image: '/static/images/travel/spot3.png',
      images: ['/static/images/travel/spot3.png'],
      rating: 4.6,
      price: 0,
      address: '青山村南5公里',
      tags: ['田园风光', '拍照打卡', '免费'],
      desc: '每年3-4月，百亩油菜花竞相绽放，金黄一片，是摄影爱好者和游客的必到打卡地。',
      openTime: '全天开放',
      phone: ''
    }
  ],

  // ========== 民宿/农家乐 ==========
  hotels: [
    {
      id: 1,
      name: '青山湖畔农家乐',
      image: '/static/images/travel/hotel1.png',
      images: ['/static/images/travel/hotel1.png'],
      rating: 4.7,
      price: 188,
      address: '青山湖北岸',
      tags: ['湖景房', '农家菜', '棋牌'],
      desc: '位于青山湖畔，环境优美，提供正宗农家菜，可住宿、垂钓、烧烤。共有客房12间。',
      phone: '137xxxx3456',
      rooms: 12
    },
    {
      id: 2,
      name: '归田园居民宿',
      image: '/static/images/travel/hotel2.png',
      images: ['/static/images/travel/hotel2.png'],
      rating: 4.9,
      price: 268,
      address: '古村落旁',
      tags: ['精品民宿', '田园生活', '茶室'],
      desc: '由老宅改造而成的精品民宿，保留传统建筑风貌，融入现代舒适设施，体验真正的田园生活。',
      phone: '136xxxx7890',
      rooms: 6
    }
  ],

  // ========== 闲置集市 ==========
  markets: [
    {
      id: 1,
      title: '八成新电动三轮车转让',
      price: 2800,
      originalPrice: 4500,
      image: '/static/images/market/item1.png',
      images: ['/static/images/market/item1.png'],
      category: '交通工具',
      condition: '八成新',
      contact: '138xxxx1111',
      address: '青山村三组',
      desc: '去年买的电动三轮车，平时就拉点菜用，保养很好，电池续航还有40公里左右。因换四轮车故转让。',
      publishTime: '2024-01-12',
      publisher: '老李',
      isFree: false
    },
    {
      id: 2,
      title: '闲置农具一套（锄头、铁锹、镰刀）',
      price: 50,
      originalPrice: 120,
      image: '/static/images/market/item2.png',
      images: ['/static/images/market/item2.png'],
      category: '农用工具',
      condition: '七成新',
      contact: '139xxxx2222',
      address: '青山村一组',
      desc: '搬家清理出来的农具，都还能正常使用，便宜处理了。',
      publishTime: '2024-01-10',
      publisher: '张阿姨',
      isFree: false
    },
    {
      id: 3,
      title: '免费赠送小猫3只',
      price: 0,
      originalPrice: 0,
      image: '/static/images/market/item3.png',
      images: ['/static/images/market/item3.png'],
      category: '宠物',
      condition: '满月',
      contact: '137xxxx3333',
      address: '青山村五组',
      desc: '家里大猫生了4只小猫，自己留1只，剩下3只免费送给爱猫人士，要求善待猫咪。',
      publishTime: '2024-01-08',
      publisher: '小刘',
      isFree: true
    },
    {
      id: 4,
      title: '二手麻将桌出售',
      price: 300,
      originalPrice: 800,
      image: '/static/images/market/item4.png',
      images: ['/static/images/market/item4.png'],
      category: '家具家电',
      condition: '九成新',
      contact: '135xxxx4444',
      address: '青山村二组',
      desc: '全自动麻将桌，买来没用几次，功能完好，带两副麻将牌。',
      publishTime: '2024-01-05',
      publisher: '老王',
      isFree: false
    }
  ],

  // ========== 招工求职 ==========
  jobs: [
    {
      id: 1,
      type: 'hire',
      title: '招建筑小工2名',
      salary: '200元/天',
      address: '青山村附近',
      tags: ['日结', '包吃'],
      desc: '本村建房需要小工2名，要求身体健康，能吃苦耐劳，有建筑经验者优先。工作时间为早7点到晚6点，中午管饭。',
      contact: '138xxxx5555',
      publisher: '赵师傅',
      publishTime: '2024-01-12'
    },
    {
      id: 2,
      type: 'hire',
      title: '果园采摘临时工',
      salary: '150元/天',
      address: '青山村果园',
      tags: ['临时', '日结'],
      desc: '果园橙子成熟需要采摘工人5名，工期约10天，包午餐，日结工资。',
      contact: '136xxxx6666',
      publisher: '周老板',
      publishTime: '2024-01-10'
    },
    {
      id: 3,
      type: 'seek',
      title: '求职：保姆/月嫂',
      salary: '面议',
      address: '青山村及周边',
      tags: ['经验丰富', '住家'],
      desc: '本人45岁，有5年保姆经验，做过月嫂，有健康证，会做家常菜，勤劳能干，寻附近住家工作。',
      contact: '137xxxx7777',
      publisher: '李大姐',
      publishTime: '2024-01-08'
    },
    {
      id: 4,
      type: 'seek',
      title: '求职：送货司机',
      salary: '面议',
      address: '不限',
      tags: ['C1驾照', '5年驾龄'],
      desc: '本人持C1驾照，驾龄5年，熟悉周边路线，有货运经验，可自带面包车，寻送货或运输工作。',
      contact: '139xxxx8888',
      publisher: '小陈',
      publishTime: '2024-01-05'
    }
  ]
};

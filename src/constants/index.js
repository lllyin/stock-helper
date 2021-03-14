// 第三方股市报价api
export const API_BASE_URL = 'https://api.money.126.net/data/feed/';

// 第三方股市财务api
export const API_QUOTE_URL = 'https://stock.xueqiu.com/v5/stock/quote.json';

export const SINA_API = 'https://hq.sinajs.cn/list='

// 刷新间隔（毫秒）
export const UPDATE_INTERVAL = 3000;

// 期望承受亏损比率
export const EXPECT_LOSS_RATE = -0.06;

// 亏损建议值： 当亏损率为该值，计算建议
export const ADVICE_LOSS_RATE = -0.059;

// 持仓股
export const STOCKS = [
  {
    name: '伊利股份',
    // 股票代码
    symbol: '600887',
    // 成本价
    costPrice: 30.243,
    // 仓位，多少股
    position: 400,
  },
  {
    name: '中国平安',
    // 股票代码
    symbol: '601318',
    // 成本价
    costPrice: 77.987,
    // 仓位，多少股
    position: 200,
  },
  {
    name: '格力电器',
    // 股票代码
    symbol: '000651',
    // 成本价
    costPrice: 60.625,
    // 仓位，多少股
    position: 200,
  },
  {
    name: '东山精密',
    // 股票代码
    symbol: '002384',
    // 成本价
    costPrice: 28.213,
    // 仓位，多少股
    position: 400,
  },
  {
    name: '华天科技',
    // 股票代码
    symbol: '002185',
    // 成本价
    costPrice: 12.870,
    // 仓位，多少股
    position: 100,
  },
  {
    name: '华新水泥',
    // 股票代码
    symbol: '600801',
    // 成本价
    costPrice: 23.813,
    // 仓位，多少股
    position: 400,
  },
  {
    name: '海螺水泥',
    // 股票代码
    symbol: '600585',
    // 成本价
    costPrice: 51.851,
    // 仓位，多少股
    position: 100,
  },
];

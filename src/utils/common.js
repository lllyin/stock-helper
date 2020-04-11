import Big from 'big.js';
import { STOCKS, EXPECT_LOSS_RATE, ADVICE_LOSS_RATE } from '../constants';

// 对股票id进行处理
export function getStockCodes(stocks = []) {
  return stocks.map(code => {
    if (isNaN(code[0])) {
      if (code.toLowerCase().indexOf('us_') > -1) {
        return code.toUpperCase();
      } else if (code.indexOf('hk') > -1) {
        return code;
      } else {
        return code
          .toLowerCase()
          .replace('sz', '1')
          .replace('sh', '0');
      }
    } else {
      return (code[0] === '6' ? '0' : '1') + code;
    }
  });
}

// 生成补仓函数
export function genFnForBC(stocks = []) {
  return stocks.map(stock => {
    stock.bcFn = `((${stock.position}+x)${stock.price})/(${stock.costPrice}*${stock.position} + ${stock.price}x)`;
    return stock;
  });
}

export function soryBy(key, type) {}

/**
 * 根据反比函数公式，求一个最小近似值
 * @param {*} formula 公式，变量为x
 * @param {*} targetValue 目标值
 */
export function calcFnResult(formula = '', targetValue) {
  const ratio = 100;
  let i = 1;
  let flag = true;
  let realValue = targetValue;

  while (flag) {
    const formulaStr = formula.replace(/x/g, `*${ratio * i}`);
    // eslint-disable-next-line no-eval
    const result = eval(formulaStr);
    if (result <= targetValue) {
      realValue = result;
      flag = false;
    } else {
      i++;
    }
    // 设置边界值，大于100不在循环，避免进入死循环
    if (i > 100) {
      flag = false;
    }
  }
  return { x: ratio * i, y: realValue, targetValue, realValue };
}

//格式华
export function formatToLocalStocks(stocks = []) {
  return stocks.map(stock => ({
    name: stock.name,
    symbol: stock.symbol,
    costPrice: stock.costPrice,
    position: stock.position,
  }));
}

// 初始化数据
export function initData() {
  if (!localStorage.getItem('pageView')) {
    localStorage.setItem('stocks', JSON.stringify(STOCKS));
    localStorage.setItem('pageView', 1);
  } else {
    const pageView = localStorage.getItem('pageView');
    localStorage.setItem('pageView', Number(pageView) + 1);
  }
}

// 重置数据
export function resetData(defaultJson = STOCKS) {

  localStorage.setItem('stocks', JSON.stringify(defaultJson));
}

// 合并本地和接口数据
export function mergeStocks(serverStocks) {
  const localStockStr = localStorage.getItem('stocks');
  const STOCKS = localStockStr ? JSON.parse(localStockStr) : [];
  const stockMap = Object.values(serverStocks).reduce((sum, stock) => {
    sum[stock.symbol] = stock;
    return sum;
  }, {});
  // 合并成本价、持仓信息
  const stocks = STOCKS.map(localStock => {
    if (stockMap[localStock.symbol]) {
      const stockItem = {
        ...localStock,
        ...stockMap[localStock.symbol],
      };
      // 每股计算的建议信息
      let advice = {};
      const { costPrice, price, position } = stockItem;

      if (costPrice > price) {
        stockItem.bcFn = `1-(${(position * price).toFixed(2)}+${price}x)/(${(costPrice * position).toFixed(2)}+${price}x)`;
      } else {
        stockItem.jcFn = `(${(position * price).toFixed(2)}+${price}x)/(${(costPrice * position).toFixed(2)}+${price}x)-1`;
      }
      stockItem.earnRate = price / costPrice - 1;

      if (stockItem.earnRate < ADVICE_LOSS_RATE) {
        advice = calcFnResult(stockItem.bcFn, -EXPECT_LOSS_RATE);
        advice.amount = (advice.x * stockItem.price).toFixed(2);
      }

      stockItem.advice = advice;
      return stockItem;
    } else {
      return localStock;
    }
  });

  return [...stocks];
}

// 计算持仓汇总信息
export function calcStockSummary(stockList) {
  let summary = {
    // 市值
    marketValue: 0,
    // 成本金额
    costValue: 0,
    // 盈亏金额
    earnMoney: 0,
    // 平均盈亏率
    earnRate: 0,
    // 建议
    advice: {
      // 建议流动资金
      hotMoney: 0,
    },
  };

  summary = stockList.reduce((sum, item) => {
    const adviceAmount = item.advice ? item.advice.amount : 0;

    sum.marketValue = new Big(item.price).times(item.position).plus(sum.marketValue).valueOf();

    sum.costValue = new Big(item.costPrice).times(item.position).plus(sum.costValue).valueOf();

    sum.advice.hotMoney = new Big(sum.advice.hotMoney).plus(Number(adviceAmount || 0)).valueOf();

    return sum;
  }, summary);

  summary.earnRate = new Big(summary.marketValue).div(summary.costValue).minus(1).toFixed(4).valueOf();
  summary.earnMoney = new Big(summary.marketValue).minus(summary.costValue).valueOf();

  return summary;
}

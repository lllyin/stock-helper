/**
 *
 * @param {object} params 参数
 */
export function simulate(initValue, options) {
  const { costPrice, position, earnRate } = initValue;
  const { p, cycle, up, down } = options;

  // 持仓记录
  const onlineRecords = [
    {
      costPrice,
      position,
      earnRate,
    },
  ];
  // 减仓记录
  const soldRecords = [];
  // 加仓记录
  const buyRecords = [];
  // 上涨记录
  const upRecords = {
    percents: [],
  };
  // 下跌记录
  const downRecords = {
    percents: [],
  };
  // 无操作记录。例如：上涨打到阈值，但持仓为0，无法卖出
  const noneRecords = {
    percents: [],
  };

  for (let idx = 1; idx <= cycle; idx++) {
    let percent = 0;

    if (randomP(p) === 1) {
      // 概率为p的事件逻辑,即上涨逻辑
      percent = Math.random() * 0.1;
      upRecords.percents.push(percent);
    } else {
      // 概率为1-p的事件逻辑，即下跌逻辑
      percent = Math.random() * -0.1;
      downRecords.percents.push(percent);
    }

    const lastRecord = onlineRecords[onlineRecords.length - 1];
    if (percent >= up.threshold) {
      // 上涨卖
      if (lastRecord.position > 0) {
        const newRecord = doSold(lastRecord, { percent, position: up.position }, (soldRecord) => {
          // console.log('卖出部分：', soldRecord);
          soldRecords.push(soldRecord);
        });

        // console.log('上涨卖：', newRecord);
        onlineRecords.push({ ...newRecord, percent });
      } else {
        noneRecords.percents.push(percent);
        // console.log('上涨空窗期,position已经为0', lastRecord);
      }
    } else if (percent <= down.threshold) {
      // 下跌买
      const newRecord = doBuy(lastRecord, { percent, position: down.position }, (buyRecord) => {
        buyRecords.push(buyRecord);
      });

      // console.log('下跌买：', newRecord);
      onlineRecords.push({ ...newRecord, percent });
    } else {
      // 不操作
    }
  }

  const result = { cycle, onlineRecords, soldRecords, buyRecords, upRecords, downRecords, noneRecords };

  return result;
}

// 分析结果
function analyze(result) {
  const { cycle, upRecords, downRecords, onlineRecords, soldRecords, buyRecords } = result;

  // 卖出的收益
  const soldEarnAmount = soldRecords.reduce((sum, item) => {
    return (sum += item.earnMoney);
  }, 0);

  // 买入合计金额
  const buyAmount = buyRecords.reduce((sum, item) => {
    return (sum += item.amount);
  }, 0);

  const currentAccout = onlineRecords[onlineRecords.length - 1];

  return {
    cycle,
    up: {
      count: upRecords.percents.length,
    },
    down: {
      count: downRecords.percents.length,
    },
    earn: {
      online: {
        ...currentAccout,
        earmMoney: currentAccout.costPrice * currentAccout.position * currentAccout.earnRate,
      },
      sold: {
        count: soldRecords.length,
        earnAmount: soldEarnAmount,
      },
      buy: {
        count: buyRecords.length,
        buyAmout: buyAmount,
      },
    },
    source: result,
  };
}

// 生成概率p
function randomP(p) {
  if (Math.random() <= Number(p)) {
    return 1;
  } else {
    return 0;
  }
}

// 买操作
function doBuy(record, options, buyCb) {
  return addPostion(record, options, buyCb);
}

// 卖操作
function doSold(record, options, soldCb) {
  return reducePostion(record, options, soldCb);
}

// 加仓
function addPostion(prePostion, options, buyCb) {
  const { costPrice, position, earnRate } = prePostion;
  const optPostion = Number(options.position);
  const optPercent = Number(options.percent);

  // 原本的价格
  const price = (earnRate + 1) * costPrice;
  // 变动后的价格
  const newPrice = (optPercent + 1) * price;
  // 新的持仓
  const newPostion = position + optPostion;
  // 新的成本
  const newCostPrice = (costPrice * position + newPrice * optPostion) / newPostion;
  // 新的收益率
  const newEarnRate = newPrice / newCostPrice - 1;

  buyCb({
    percent: optPercent,
    price: newPrice,
    costPrice: newPrice,
    position: optPostion,
    amount: newPrice * optPostion,
  });

  return {
    percent: optPercent,
    price: newPrice,
    costPrice: newCostPrice,
    position: newPostion,
    earnRate: newEarnRate,
  };
}

// 减仓
function reducePostion(prePostion, options, soldCb) {
  const { costPrice, position, earnRate } = prePostion;
  const optPostion = Number(options.position);
  const optPercent = Number(options.percent);

  // 原本的价格
  const price = (earnRate + 1) * costPrice;
  // 变动后的价格
  const newPrice = (optPercent + 1) * price;
  // 新的持仓
  const newPostion = position + optPostion;
  // 新的收益率
  const newEarnRate = newPrice / costPrice - 1;

  const soldRecord = {
    percent: optPercent,
    costPrice: costPrice,
    price: newPrice,
    position: Math.abs(optPostion),
    earnRate: newEarnRate,
    earnMoney: costPrice * Math.abs(optPostion) * newEarnRate,
  };

  // console.log('上涨', optPercent, price, newPrice);
  soldCb(soldRecord);

  return {
    percent: optPercent,
    price: newPrice,
    costPrice: costPrice,
    position: newPostion,
    earnRate: newEarnRate,
  };
}

/**
 * 初始值
 */
const initValue = {
  /**
   * 成本
   */
  costPrice: 10,
  /**
   * 仓位
   */
  position: 1000,
  /**
   * 盈亏比
   */
  earnRate: 0,
};

const options = {
  /**
   * 上涨概率
   */
  p: 0.3,
  /**
   * 模拟轮数
   */
  cycle: 30,
  /**
   * 上涨时配置
   */
  up: {
    threshold: 0.02,
    position: -500,
  },
  /**
   * 下跌时配置
   */
  down: {
    threshold: -0.02,
    position: 100000,
  },
};

const result = simulate(initValue, options);

export { result };
// console.log(analyze(result));

// 对股票id进行处理
export function getStockCodes(stocks = []) {
  return stocks.map((code) => {
      if(isNaN(code[0])){
          if(code.toLowerCase().indexOf('us_') > -1){
              return code.toUpperCase();
          }else if(code.indexOf('hk') > -1){
              return code;
          }else{
              return code.toLowerCase().replace('sz', '1').replace('sh', '0');
          }
          
      }else{
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

export function soryBy(key, type) {
  
}

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

  while(flag) {
    const formulaStr  = formula.replace(/x/g, `*${ratio * i}`);
    const result = eval(formulaStr);
    if(result <= targetValue) {
      realValue = result;
      flag = false;
    } else {
      i++;
    }
    // 设置边界值，大于100不在循环，避免进入死循环
    if(i > 100) {
      flag = false;
    }
  }
  return { x: ratio*i, targetValue, realValue };
}
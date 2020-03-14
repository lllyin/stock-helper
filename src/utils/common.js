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

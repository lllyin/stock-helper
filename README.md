## 数据源格式
```typescript
export interface Stock {
  name?: string;
  // 股票代码
  code:      number|string;
  // 成本价
  costPrice: number;
  // 仓位，多少股
  position:  number;
}
```

## 第三方api
> 首先感谢第三方的提供的数据

* 第三方股市价格api

api
```js
// 网易[jsonp]
export const API_BASE_URL = 'https://api.money.126.net/data/feed/';
```
demo
```
http://api.money.126.net/data/feed/0000001,1399300,0600684,UD_HS3Z,UD_HS3D,UD_HS3P,money.api?callback=_ntes_quote_callback5655258
```

* 第三方股市财务api

api
```js
// 雪球[有同源限制，需要反代]
export const API_QUOTE_URL = 'https://stock.xueqiu.com/v5/stock/quote.json?symbol=SH601318&extend=detail';
```
demo
```
https://stock.xueqiu.com/v5/stock/quote.json?symbol=SH601318&extend=detail'
```

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


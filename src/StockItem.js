import React, { Component } from 'react';

import './StockItem.scss';

function caclClass(number) {
  if (number > 0) {
    return 'red';
  } else if (number < 0) {
    return 'green';
  } else {
    return 'default';
  }
}

function calcLink(data) {
  const bcLinkData = [
    { type: 0, eq: data.bcFn, color: '#13AD13' },
    { type: 1000, window: ['-300', '1500', '0', '0.2'] },
  ];
  const jcLinkData = [
    { type: 0, eq: data.jcFn, color: '#ED1717' },
    { type: 1000, window: ['-100', '500', '-0.1', '0.2'] },
  ];
  const linkData = data.costPrice > data.price ? bcLinkData : jcLinkData;

  return `http://fooplot.com/#${window.btoa(JSON.stringify(linkData))}`;
}

export default class StockItem extends Component {
  // 点击补仓函数跳转至函数绘图网站
  handleLinkClick(data) {
    const url = calcLink(data);
    window.open(url, data.name);
  }

  render() {
    const { data } = this.props;
    // 每股收益
    const earningsPerShare = data.price - data.costPrice;
    const earningCls = caclClass(earningsPerShare);

    // console.log('data', data, data.name);
    return (
      <div className="stock-item">
        <h3>{data.name}</h3>
        <div className="stock-spc-item">
          <label className="stock-item-label">{earningsPerShare < 0 ? '补仓函数' : '加仓函数'}:</label>
          <span
            className="stock-item-value link"
            onClick={() => {
              this.handleLinkClick(data);
            }}
          >
            {earningsPerShare < 0 ? data.bcFn : data.jcFn}
          </span>
        </div>
        <div className="stock-spc-item">
          <label className="stock-item-label">盈亏:</label>
          <span className={`stock-item-value ${earningCls}`}>
            {((earningsPerShare / data.costPrice) * 100).toFixed(3)}%
          </span>
        </div>
        <div className="stock-spc-item">
          <label className="stock-item-label">成本:</label>
          <span className="stock-item-value">{data.costPrice}</span>
        </div>
        <div className="white-blank"></div>
        <div className="stock-spc-item">
          <label className="stock-item-label">现价:</label>
          <span className="stock-item-value">{data.price}</span>
        </div>
        <div className="stock-spc-item">
          <label className="stock-item-label">涨幅:</label>
          <span className={`stock-item-value ${caclClass(data.percent)}`}>{(data.percent * 100).toFixed(2)}%</span>
        </div>
      </div>
    );
  }
}

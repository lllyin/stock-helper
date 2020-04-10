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
    { type: 1000, window: ['-200', '1500', '0', String(Math.abs(data.earnRate * (1.5).toFixed(2)))] },
  ];
  const jcLinkData = [
    { type: 0, eq: data.jcFn, color: '#ED1717' },
    { type: 1000, window: ['-100', '500', '0', String(Math.abs(data.earnRate * (1.5).toFixed(2)))] },
  ];
  const linkData = data.costPrice > data.price ? bcLinkData : jcLinkData;
  // replace这一步是因为绘图网站http://fooplot.com的base64算法使用-代替=填充
  const base64 = window.btoa(JSON.stringify(linkData)).replace(/=/g, '-');

  return `http://fooplot.com/#${base64}`;
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


    // 计算达到预期亏损的补仓建议
    let { advice } = data;

    return (
      <div className={`stock-item ${earningCls}`}>
        <h3>{data.name || '无名股票'}</h3>
        <div className="stock-spc-item">
          <label className="stock-item-label">盈亏比</label>
          <span className={`stock-item-value ${earningCls} weight`}>{(data.earnRate * 100).toFixed(3)}%</span>
        </div>
        <div className="stock-spc-item">
          <label className="stock-item-label">当前盈亏</label>
          <span className={`stock-item-value ${earningCls} earn-amount`}>{(data.earnRate * data.costPrice * data.position).toFixed(2)}</span>
        </div>

        <div className="white-blank"></div>

        <div className="stock-spc-item">
          <label className="stock-item-label">成本</label>
          <span className="stock-item-value">{data.costPrice}</span>
        </div>
        <div className="stock-spc-item">
          <label className="stock-item-label">现价</label>
          <span className="stock-item-value weight">{data.price}</span>
        </div>
        <div className="stock-spc-item">
          <label className="stock-item-label">当前涨幅</label>
          <span className={`stock-item-value weight ${caclClass(data.percent)}`}>{(data.percent * 100).toFixed(2)}%</span>
        </div>

        <div className="white-blank"></div>

        <div className="stock-spc-item">
          <label className="stock-item-label">{earningsPerShare < 0 ? '补仓函数' : '加仓函数'}</label>
          <span
            className="stock-item-value"
            onClick={() => {
              this.handleLinkClick(data);
            }}
          >
            <span className="link">查看</span>
            {/* <small className="text-weak">(灰色曲线为函数的导数图)</small> */}
          </span>
        </div>
        
        <div className="white-blank"></div>

        {advice.x && (
          <div className="stock-spc-item advice-item">
            <label className="stock-item-label">建议</label>
            <span className="stock-item-value advice-value">
              目前您的亏损超过了{Math.floor(Math.abs(data.earnRate) * 100)}%。建议补仓<b className="mark">{advice.x}</b>
              手， 需要资金
              <b className="mark">¥{Math.ceil(data.price * advice.x)}</b>, 可将亏损降至
              <b className="mark">{(advice.realValue * 100).toFixed(3)}%</b>。
            </span>
          </div>
        )}
      </div>
    );
  }
}

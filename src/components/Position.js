import React, { Component } from 'react';
import PositionItem from './PositionItem';

import './Position.scss';

export default class Position extends Component {
  componentDidMount() {
    const { stocks = [], core } = this.props;

    this.stocks = stocks;
    core && core(this);
  }

  handleComplete = data => {
    const { stocks = [] } = this.props;
    this.stocks = stocks;
    const stocksMap = stocks.reduce((map, stock) => {
      map[stock.code] = stock;
      return map;
    }, {});

    if(stocksMap[data.code]) {
      alert('该股票已存在了，你可以点击修改~');
    } else {
      this.stocks.push(data);
    }
  };

  render() {
    const { stocks } = this.props;
    return (
      <div className="stocks-list-wrap">
        <div className="postion-list-header">
          <div className="th">名称</div>
          <div className="th">代码</div>
          <div className="th">成本</div>
          <div className="th">持仓</div>
        </div>
        {stocks.map(stock => (
          <PositionItem key={stock.code} data={stock}  onComplete={this.handleComplete} />
        ))}
        {/* <PositionItem data={{}} edit={true} onComplete={this.handleComplete} /> */}
      </div>
    );
  }
}

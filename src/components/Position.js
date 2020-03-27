import React, { Component } from 'react';
import PositionItem from './PositionItem';
import AddPostionItem from './AddPostionItem';

import './Position.scss';

export default class Position extends Component {
  componentDidMount() {
    const { stocks = [], core } = this.props;

    this.stocks = stocks;
    core && core(this);
  }

  handleComplete = (data, index) => {
    const { stocks = [], onItemComplete } = this.props;
    const stocksMap = stocks.reduce((map, stock, index) => {
      stock.index = index;
      map[stock.symbol] = stock;
      return map;
    }, {});

    const sameCodeStocks = Object.values(stocksMap).filter(v => String(v.symbol) === String(data.symbol));

    if (sameCodeStocks.length > 1) {
      alert('该股票已存在了，你可以点击修改~');
    } else {
      data.index = index;
      stocksMap[data.symbol] = data;

      this.stocks = Object.values(stocksMap).sort((a, b) => a.index - b.index);
      onItemComplete && onItemComplete(data, this.stocks);
    }
  };

  // 点击添加一行按钮
  handleAddRowClick = (addStockItem) => {
    const { onAdd } = this.props;

    onAdd && onAdd(this.stocks);
  };

  onDelete = data => {
    const { onDelete } = this.props;

    onDelete && onDelete(data);
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
        {stocks.map((stock, index) => (
          <PositionItem
            key={stock.symbol}
            data={stock}
            onComplete={data => this.handleComplete(data, index)}
            onDelete={this.onDelete}
          />
        ))}
        {/*添加行 */}
        <AddPostionItem
          key={stocks.length}
          stocks={stocks}
          onComplete={data => this.handleComplete(data, stocks.length)}
          onAdd={this.handleAddRowClick}
        />
      </div>
    );
  }
}

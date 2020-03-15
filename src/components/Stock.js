import React, { Component } from 'react';
import StockItem from './StockItem';
import { getStockCodes } from '../utils/common';
import { API_BASE_URL, STOCKS, UPDATE_INTERVAL } from '../constants';
// import MOCK_DATA from './mockdata';

import './Stock.scss';

const $ = window.$;
const TYPE_MAP = {
  asce: 1,
  desc: -1,
};

let timer = null;

export default class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks: [],
      sort: 'default',
    };
  }

  componentDidMount() {
    this.fetchStocks();
    // this.setSotcks(MOCK_DATA);
    setInterval(() => {
      this.fetchStocks();
    }, UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(timer);
  }

  fetchStocks() {
    const stockCodes = STOCKS.map(stock => String(stock.code));
    const _this = this;
    
    $ &&
      $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: `${API_BASE_URL}${getStockCodes(stockCodes).join(',')}`,
        success: function(serverData, status, xhr) {
          _this.setSotcks(serverData);
        },
        error: function(e) {
          console.error('请求接口错误');
        },
      });
  }

  setSotcks = serverData => {
    const stockMap = Object.values(serverData).reduce((sum, stock) => {
      sum[stock.symbol] = stock;
      return sum;
    }, {});
    // 合并成本价、持仓信息
    const stocks = STOCKS.map(localStock => {
      if (stockMap[localStock.code]) {
        const stockItem = {
          ...localStock,
          ...stockMap[localStock.code],
        };
        const { costPrice, price, position } = stockItem;

        if (costPrice > price) {
          stockItem.bcFn = `1-(${(position * price).toFixed(2)}+${price}x)/(${costPrice}*${position}+${price}x)`;
        } else {
          stockItem.jcFn = `(${(position * price).toFixed(2)}+${price}x)/(${costPrice}*${position}+${price}x)-1`;
        }
        stockItem.earnRate = price / costPrice - 1;
        return stockItem;
      } else {
        return localStock;
      }
    });

    this.stocks = [...stocks];
    this.setState({
      stocks,
    });
  };

  handleSortChange = e => {
    this.setState({
      sort: e.target.value,
    })
  };

  render() {
    const { stocks, sort } = this.state;
    const [key, type] = sort.split(':');
    let sortedStocks = [...stocks];

    if (key === 'default') {
      sortedStocks = this.stocks || [];
    } else {
      const ratio = TYPE_MAP[type] || 1;
      sortedStocks = stocks.sort((s1, s2) => (s1[key] - s2[key]) * ratio);
    }

    return (
      <div className="stock-list-wrap">
        <h2>STOCK HELPER</h2>
        <div>
          sort by
          <select onChange={this.handleSortChange}>
            <option value="default">default</option>
            <option value="earnRate:asce">盈亏⬆</option>
            <option value="earnRate:desc">盈亏⬇</option>
          </select>
        </div>
        <div>
          {sortedStocks.map(stock => (
            <StockItem key={stock.code} data={stock} />
          ))}
        </div>
      </div>
    );
  }
}

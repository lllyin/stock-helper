import React, { Component } from 'react';
import StockItem from './StockItem';
import { getStockCodes } from './utils/common';
import { API_BASE_URL, STOCKS, UPDATE_INTERVAL } from './constants';

import './Stock.scss';

const $ = window.$;

const STOCK_CODE_MAP = STOCKS.reduce((sum, stock) => {
  sum[stock.code] = stock;
  return sum;
}, {});

let timer = null;

export default class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks: [],
    };
  }

  componentDidMount() {
    this.fetchStocks();
    setInterval(() => {
      // this.fetchStocks();
    }, UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(timer);
  }

  fetchStocks() {
    const stockCodes = STOCKS.map(stock => String(stock.code));
    const _this = this;

    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: `${API_BASE_URL}${getStockCodes(stockCodes).join(',')}`,
      success: function(data, status, xhr) {
        // 合并成本价、持仓信息
        const stocks = Object.values(data).map(stockItem => {
          if (STOCK_CODE_MAP[stockItem.symbol]) {
            const newStockItem = {
              ...stockItem,
              ...STOCK_CODE_MAP[stockItem.symbol],
            };

            if (newStockItem.costPrice > newStockItem.price) {
              newStockItem.bcFn = `1-(${(newStockItem.position * newStockItem.price).toFixed(2)}+${
                newStockItem.price
              }x)/(${newStockItem.costPrice}*${newStockItem.position}+${newStockItem.price}x)`;
            } else {
              newStockItem.jcFn = `(${(newStockItem.position * newStockItem.price).toFixed(2)}+${
                newStockItem.price
              }x)/(${newStockItem.costPrice}*${newStockItem.position}+${newStockItem.price}x)-1`;
            }
            return newStockItem;
          } else {
            return stockItem;
          }
        });

        _this.setState({
          stocks,
        });
      },
      error: function(e) {
        console.error('请求接口错误');
      },
    });
  }

  handleSortChange = (e) => {
    console.log('sort', e.target.value);
  }

  render() {
    const { stocks } = this.state;
    return (
      <div className="stock-list-wrap">
        <h2>STOCK HELPER</h2>
        <div>
          sort by 
          <select onChange={this.handleSortChange}>
            <option value="earn:asce">盈亏⬆</option>
            <option value="earn:desc">盈亏⬇</option>
            <option value="opel">Opel</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div>
          {stocks.map(stock => (
            <StockItem key={stock.code} data={stock} />
          ))}
        </div>
      </div>
    );
  }
}

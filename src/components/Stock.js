import React, { Component } from 'react';
import StockItem from './StockItem';
import { getStockCodes, formatToLocalStocks, initData } from '../utils/common';
import { API_BASE_URL, UPDATE_INTERVAL } from '../constants';
import EditIconSrc from '../images/edit-icon.svg';
import SaveIconSrc from '../images/save-icon.svg';
import Position from './Position';
import MOCK_DATA from '../constants/mockdata';

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
      showPostion: false,
    };
  }

  componentDidMount() {
    initData();
    // this.fetchStocks();
    this.setSotcks(MOCK_DATA);
    setInterval(() => {
      // this.fetchStocks();
    }, UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(timer);
  }

  fetchStocks() {
    const localStockStr = localStorage.getItem('stocks');
    const STOCKS = localStockStr ? JSON.parse(localStockStr) : [];
    const stockCodes = STOCKS.map(stock => String(stock.symbol));
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

  setSotcks = (serverData = {}) => {
    const localStockStr = localStorage.getItem('stocks');
    const STOCKS = localStockStr ? JSON.parse(localStockStr) : [];
    const stockMap = Object.values(serverData).reduce((sum, stock) => {
      sum[stock.symbol] = stock;
      return sum;
    }, {});
    // 合并成本价、持仓信息
    const stocks = STOCKS.map(localStock => {
      if (stockMap[localStock.symbol]) {
        const stockItem = {
          ...localStock,
          ...stockMap[localStock.symbol],
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
    });
  };

  // 保存/修改持仓
  hanldPostionClick = type => {
    this.setState({
      showPostion: !this.state.showPostion,
    });
    if (type === 'save') {
      const localStocks = formatToLocalStocks(this.core.stocks);
      localStorage.setItem('stocks', JSON.stringify(localStocks));
      this.setSotcks(MOCK_DATA);
    }
  };

  // 持仓添加/修改改变
  handlePostionComplete = (data, stocks) => {
    console.log('编辑', data, stocks);
  };

  // 点击添加按钮
  handleAdd = stocks => {
    this.setState({
      editStocks: stocks,
    });
  };

  // 处理删除持仓
  handleDletePosition = data => {
    const filterStocks = this.core.stocks.filter(v => String(v.symbol) !== String(data.symbol));

    this.setState({
      editStocks: [...filterStocks],
    });
    this.core.stocks = filterStocks;
    console.log('删除后', data, this.core.stocks, filterStocks);
  };

  render() {
    const { stocks, sort, showPostion, editStocks } = this.state;
    const [key, type] = sort.split(':');
    let sortedStocks = [...stocks];

    if (key === 'default') {
      sortedStocks = this.stocks || [];
    } else {
      const ratio = TYPE_MAP[type] || 1;
      sortedStocks = stocks.sort((s1, s2) => (s1[key] - s2[key]) * ratio);
    }

    console.log('render editStocks', this.state);

    return (
      <div className="stock-list-wrap">
        <h2>STOCK HELPER</h2>
        <div className="tools-box">
          <div className="sort-tool">
            sort by
            <select onChange={this.handleSortChange}>
              <option value="default">default</option>
              <option value="earnRate:asce">盈亏⬆</option>
              <option value="earnRate:desc">盈亏⬇</option>
            </select>
          </div>
          <div className="position-tool" onClick={() => this.hanldPostionClick(showPostion ? 'save' : 'edit')}>
            <span>{showPostion ? '保存' : '持仓'}</span>
            <img src={showPostion ? SaveIconSrc : EditIconSrc} alt="edit-icon" />
          </div>
        </div>
        {showPostion && (
          <Position
            core={core => (this.core = core)}
            stocks={editStocks || this.stocks || []}
            onItemComplete={this.handlePostionComplete}
            onAdd={this.handleAdd}
            onDelete={this.handleDletePosition}
          />
        )}
        <div>
          {sortedStocks.map(stock => (
            <StockItem key={stock.symbol} data={stock} />
          ))}
        </div>
      </div>
    );
  }
}

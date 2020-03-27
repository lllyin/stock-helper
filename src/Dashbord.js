import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StockPanel from './components/StockPanel';
import SummaryPanel from './components/SummaryPanel';
import { API_BASE_URL, UPDATE_INTERVAL } from './constants';
import { getStockCodes, formatToLocalStocks, initData, mergeStocks } from './utils/common';

const $ = window.$;
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
}));
// 定时器
let timer = null;

export default function ControlledExpansionPanels() {
  const classes = useStyles();
  const [stocksMap, setStocksMap] = useState({});
  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    initData();
    fetchStocks();

    timer = setInterval(() => {
      // fetchStocks();
    }, UPDATE_INTERVAL);
    return () => {
      console.log('组件卸载');
      clearInterval(timer);
    };
  }, []);

  // 获取股票信息
  function fetchStocks() {
    const localStockStr = localStorage.getItem('stocks');
    const STOCKS = localStockStr ? JSON.parse(localStockStr) : [];
    const stockCodes = STOCKS.map(stock => String(stock.symbol));

    $ &&
      stockCodes.length > 0 &&
      $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: `${API_BASE_URL}${getStockCodes(stockCodes).join(',')}`,
        success: function(serverData, status, xhr) {
          const stockList = mergeStocks(serverData);
          setStocksMap(serverData);
          setStockList(stockList);
        },
        error: function(e) {
          console.error('请求接口错误');
        },
      });
  }

  return (
    <div className={classes.root}>
      <SummaryPanel map={stocksMap} list={stockList} />
      <StockPanel map={stocksMap} list={stockList} />
    </div>
  );
}

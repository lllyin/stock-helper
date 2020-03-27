import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StockPanel from './components/StockPanel';
import SummaryPanel from './components/SummaryPanel';
import { API_BASE_URL, UPDATE_INTERVAL } from './constants';
import { getStockCodes, calcStockSummary, initData, mergeStocks } from './utils/common';

const $ = window.$;
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
}));
// 定时器
let timer = null;

export default function DashBord() {
  const classes = useStyles();
  const [stocksMap, setStocksMap] = useState({});
  const [stockList, setStockList] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    initData();
    fetchStocks();

    timer = setInterval(() => {
      fetchStocks();
    }, UPDATE_INTERVAL);
    return () => {
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
          const summary = calcStockSummary(stockList);
          setStocksMap(serverData);
          setStockList(stockList);
          setSummary(summary);
        },
        error: function(e) {
          console.error('请求接口错误');
        },
      });
  }

  function handleSave() {
    fetchStocks();
  }

  return (
    <div className={classes.root}>
      <SummaryPanel map={stocksMap} list={stockList} summary={summary} />
      <StockPanel map={stocksMap} list={stockList} onSave={handleSave} />
    </div>
  );
}

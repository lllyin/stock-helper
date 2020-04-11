import React, { useEffect, useState, useReducer, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Reset from './components/Reset';
import Import from './components/Import';
import StockPanel from './components/StockPanel';
import SummaryPanel from './components/SummaryPanel';
import { API_BASE_URL, UPDATE_INTERVAL } from './constants';
import { getStockCodes, calcStockSummary, initData, resetData, mergeStocks } from './utils/common';
import { stockReducer, stockInitData, StockContext } from './reducers';

const $ = window.$;
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,

    '& .title-box': {
      marginTop: 0,
      marginBottom: 0,
    },
    '& .import-tool': {
      cursor: 'pointer',
      color: '#888',
      fontSize: 14,
    }
  }
}));
// 定时器
let timer = null;

export default function DashBord() {
  const classes = useStyles();
  const [stocksMap, setStocksMap] = useState({});
  const [stockList, setStockList] = useState([]);
  const [summary, setSummary] = useState({});
  const [stockState, dispatch] = useReducer(stockReducer, stockInitData);
  const stockRef = useRef(stockState);

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
    const { isEdit } = stockRef.current;

    if (STOCKS.length <= 0) {
      setStocksMap({});
      setStockList([]);
      setSummary({});
      return;
    }

    $ &&
      !isEdit &&
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

  function handleResetConfirm() {
    dispatch({
      type: 'SAVE',
    });
    stockRef.current = { ...stockState, showPostion: false, isEdit: false };
    resetData();
    fetchStocks();
  }

  function handleImportConfirm(json) {
    console.log('handleImportConfirm', json);
    if(json) {
      dispatch({
        type: 'SAVE',
      });
      stockRef.current = { ...stockState, showPostion: false, isEdit: false };
      resetData(json);
      fetchStocks();
    }
  }

  stockRef.current = stockState;

  return (
    <StockContext.Provider value={stockState}>
      <div className={classes.root}>
        <div className={classes.header}>
          <h2 className="title-box">
            STOCK HELPER
            <Reset onConfirm={handleResetConfirm} />
          </h2>
          <div className="import-tool">
            <Import onConfirm={handleImportConfirm} />
          </div>
        </div>
        <SummaryPanel map={stocksMap} list={stockList} summary={summary} />
        <StockPanel map={stocksMap} list={stockList} onSave={handleSave} dispatch={dispatch} />
      </div>
    </StockContext.Provider>
  );
}

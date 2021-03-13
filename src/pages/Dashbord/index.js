import React, { useEffect, useState, useReducer, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Reset from '@/components/Reset';
import Import from '@/components/Import';
import StockPanel from '@/components/StockPanel';
import SummaryPanel from '@/components/SummaryPanel';
import { API_BASE_URL, UPDATE_INTERVAL } from '@/constants';
import { getStockCodes, calcStockSummary, initData, resetData, mergeStocks } from '@/shared/common';
import { stockReducer, stockInitData, StockContext } from '@/reducers';

const {$} = window;
const useStyles = makeStyles(() => ({
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
    },
  },
  snackbar: {
    '& .MuiSnackbarContent-root': {
      padding: '2px 16px',
    },
    '&.error .MuiSnackbarContent-root': {
      backgroundColor: 'rgb(253, 236, 234)',
      color: 'rgb(97, 26, 21)',
    },
    '&.warning .MuiSnackbarContent-root': {
      backgroundColor: 'rgb(255, 244, 229)',
      color: 'rgb(102, 60, 0)',
    },
    '&.success .MuiSnackbarContent-root': {
      backgroundColor: 'rgb(237, 247, 237)',
      color: 'rgb(30, 70, 32)',
    },
  },
}));
// 定时器
let timer = null;

export default function DashBord() {
  const classes = useStyles();
  const [stocksMap, setStocksMap] = useState({});
  const [stockList, setStockList] = useState([]);
  const [tips, setTips] = useState({ open: false, message: '' });
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
  function fetchStocks(options = {}) {
    const { success, fail } = options;
    const localStockStr = localStorage.getItem('stocks');
    const STOCKS = localStockStr ? JSON.parse(localStockStr) : [];
    const stockCodes = STOCKS.map((stock) => String(stock.symbol));
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
        success (serverData) {
          const stockList = mergeStocks(serverData);
          const summary = calcStockSummary(stockList);
          dispatch({
            type: 'SET_SUMMARY',
            payload: summary,
          });
          setStocksMap(serverData);
          setStockList(stockList);
          setSummary(summary);
          success && success();
        },
        error () {
          console.error('请求接口错误');
          fail && fail();
        },
      });
  }

  function handleSave() {
    stockRef.current = { ...stockState, showPostion: false, isEdit: false };

    fetchStocks({
      success: () => {
        setTips({
          status: 'success',
          open: true,
          message: '保存成功',
        });
      },
      fail: () => {
        setTips({
          status: 'error',
          open: true,
          message: '保存失败',
        });
      },
    });
  }

  function handleTipClose() {
    setTips({
      status: 'default',
      open: false,
      message: '',
    });
  }

  function handleResetConfirm() {
    dispatch({
      type: 'SAVE',
    });
    stockRef.current = { ...stockState, showPostion: false, isEdit: false };
    resetData();
    fetchStocks({
      success: () => {
        setTips({
          status: 'success',
          open: true,
          message: '重置成功',
        });
      },
      fail: () => {
        setTips({
          status: 'error',
          open: true,
          message: '重置失败',
        });
      },
    });
  }

  function handleImportConfirm(json) {
    if (json) {
      dispatch({
        type: 'SAVE',
      });
      stockRef.current = { ...stockState, showPostion: false, isEdit: false };
      resetData(json);
      fetchStocks({
        success: () => {
          setTips({
            status: 'success',
            open: true,
            message: '导入成功',
          });
        },
        fail: () => {
          setTips({
            status: 'error',
            open: true,
            message: '导入失败',
          });
        },
      });
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
     
      <Snackbar
        className={`${classes.snackbar} ${tips.status}`}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={tips.open}
        onClose={handleTipClose}
        autoHideDuration={3000}
        message={tips.message}
      />
    </StockContext.Provider>
  );
}

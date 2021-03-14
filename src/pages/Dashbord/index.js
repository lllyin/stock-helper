import React, { useEffect, useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import Reset from '@/components/Reset'
import Import from '@/components/Import'
import StockPanel from '@/components/StockPanel'
import SummaryPanel from '@/components/SummaryPanel'
import { API_BASE_URL, UPDATE_INTERVAL, DEFAULT_STOCKS } from '@/constants'
import { getStockCodes, initData } from '@/shared/common'
import { Context } from '@/reducers/index'
import jsonp from '@/shared/request/jsonp'
import { isEmpty } from '@/shared/utils'

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
}))
// 定时器
let timer = null

export default function DashBord() {
  const classes = useStyles()
  const [tips, setTips] = useState({ open: false, message: '' })
  const { store, dispatch } = useContext(Context)
  const { _stocks ,stocksMap, summary } = store

  useEffect(() => {
    initData()
    fetchStocks()
    // 轮询
    pollStockInfo()
  
    return () => {
      clearTimeout(timer)
    }
  }, [_stocks])

  // 轮询价格
  const pollStockInfo = () => {
    timer = setTimeout(() => {
      fetchStocks()
      pollStockInfo()
    }, UPDATE_INTERVAL);
  }

  // 获取股票信息
  function fetchStocks({ success, fail } = {}) {
    const _codes = _stocks.map((stock) => String(stock.symbol))

    if (isEmpty(_codes)) return

    jsonp({
      type: 'GET',
      dataType: 'jsonp',
      url: `${API_BASE_URL}${getStockCodes(_codes).join(',')}`,
    }).then(
      (serverStocks) => {
        dispatch({
          type: 'INIT_STOCK',
          payload: serverStocks,
        })
        success && success(serverStocks)
      },
      (err) => {
        fail && fail(err)
      }
    )
  }

  function handleTipClose() {
    setTips({
      status: 'default',
      open: false,
      message: '',
    })
  }

  function handleResetConfirm() {
    dispatch({
      type: '_INIT_STOCK_',
      payload: DEFAULT_STOCKS,
    })
    fetchStocks({
      success() {
        setTips({
          status: 'success',
          open: true,
          message: '重置成功',
        })
      },
      fail() {
        setTips({
          status: 'error',
          open: true,
          message: '重置失败',
        })
      },
    })
  }

  function handleImportConfirm(json) {
    if (json) {
      dispatch({
        type: '_INIT_STOCK_',
        payload: json,
      })
      fetchStocks({
        success: () => {
          setTips({
            status: 'success',
            open: true,
            message: '导入成功',
          })
        },
        fail: () => {
          setTips({
            status: 'error',
            open: true,
            message: '导入失败',
          })
        },
      })
    }
  }

  return (
    <>
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
        <SummaryPanel map={stocksMap} list={store.stocks} summary={summary} />
        <StockPanel map={stocksMap} list={store.stocks} dispatch={dispatch} />
      </div>

      <Snackbar
        className={`${classes.snackbar} ${tips.status}`}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={tips.open}
        onClose={handleTipClose}
        autoHideDuration={3000}
        message={tips.message}
      />
    </>
  )
}

import React from 'react'
import { calcStockSummary, mergeStocks } from '@/shared/common'
import { isEmpty } from '@/shared/utils'
import { getStocksStorage, setStocksStorage } from '@/reducers/storage'

export const initState = {
  summary: {},
  stocksMap: {},
  _stocks: getStocksStorage(),
  stocks: [],
  showPostion: false,
  isEdit: false,
}

export function stockInit(initialData) {
  return { ...initState, ...initialData }
}

export function reducers(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, showPostion: true, isEdit: true }
    case 'EDIT':
      return { ...state, showPostion: true, isEdit: true }
    case 'SAVE':
      return { ...state, showPostion: false, isEdit: false }
    case 'RESET':
      return { ...state, showPostion: false, isEdit: false }
    case 'INIT':
      return stockInit(action.payload)
    case 'SET':
      return { ...state, ...action.payload }
    case 'SET_SUMMARY': {
      return { ...state, summary: { ...action.payload } }
    }
    case 'INIT_STOCK': {
      if(isEmpty(action.payload)) return state

      const stockList = mergeStocks(action.payload)
      const summary = calcStockSummary(stockList)

      return {
        ...state,
        summary,
        stocksMap: action.payload,
        stocks: stockList,
      }
    }
    case '_ADD_STOCK_': {
      setStocksStorage([...state._stocks, action.payload])
      return {
        ...state,
        _stocks: [...state._stocks, action.payload],
      }
    }
    case '_UPDATE_STOCK_': {
      let targetIdx = -1
      const _newStocks = [...state._stocks]
      _newStocks.find((v, index) => {
        targetIdx = index
        return v.symbol === action.payload.symbol
      })
      if (targetIdx > -1) {
        _newStocks[targetIdx] = action.payload
      }

      setStocksStorage(_newStocks)
      return {
        ...state,
        _stocks: _newStocks,
      }
    }
    case '_DEL_STOCK_': {
      const _newStocks = state._stocks.filter((v) => v.symbol !== action.payload.symbol)

      setStocksStorage(_newStocks)
      return {
        ...state,
        _stocks: _newStocks,
      }
    }
    default:
      return state
  }
}

export const Context = React.createContext(initState)

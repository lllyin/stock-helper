import React from 'react';

export const stockInitData = {
  showPostion: false,
  isEdit: false,
};

export function stockInit(initialData) {
  return { ...stockInitData, ...initialData };
}

export function stockReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, showPostion: true, isEdit: true };
    case 'EDIT':
      return { ...state, showPostion: true, isEdit: true };
    case 'SAVE':
      return { ...state, showPostion: false, isEdit: false };
    case 'RESET':
      return { ...state, showPostion: false, isEdit: false };
    case 'INIT':
      return stockInit(action.payload);
    case 'SET':
      return { ...state, ...action.payload };
    case 'SET_SUMMARY': {
      return { ...state, summary: { ...action.payload } };
    }
    default:
      return state;
  }
}

export const StockContext = React.createContext(stockInitData);

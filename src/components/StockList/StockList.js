import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Context } from '@/reducers/index';
import StockItem from './StockItem';

import './StockList.scss';

const useStyles = makeStyles(() => ({
  saveButton: {
    color: '#fff',
    fontSize: 16,
  },
  editButton: {
    color: '#555',
    fontSize: 15,
  },
  sortTool: {
    fontSize: 14,
  },
}));
const TYPE_MAP = {
  asce: 1,
  desc: -1,
};

export default function StockList(props) {
  const classes = useStyles();
  const [stocks, setStocks] = useState([]);
  const [sort, setSort] = useState('default');
  const [key, type] = sort.split(':');
  let sortedStocks = [...stocks];

  const { store } = useContext(Context);

  useEffect(() => {
    setStocks(props.list);
  }, [props.list]);

  // 排序选择权改变
  const handleSortChange = e => {
    setSort(e.target.value);
  };


  if (key === 'default') {
    sortedStocks = stocks || [];
  } else {
    const ratio = TYPE_MAP[type] || 1;
    sortedStocks = stocks.sort((s1, s2) => (s1[key] - s2[key]) * ratio);
  }

  const { summary } = store;

  return (
    <div className="stock-list-wrap">
      <div className="tools-box">
        <div className="sort-tool">
          <Select onChange={handleSortChange} defaultValue="default" className={classes.sortTool}>
            <MenuItem value="default">默认排序</MenuItem>
            <MenuItem value="earnRate:asce">盈亏从低到高⬆</MenuItem>
            <MenuItem value="earnRate:desc">盈亏从高到低⬇</MenuItem>
            <MenuItem value="percent:asce">涨幅从低到高⬆</MenuItem>
            <MenuItem value="percent:desc">涨幅从高到低⬇</MenuItem>
          </Select>
        </div>
      </div>
      <div className="stock-list flow">
        {sortedStocks.map(stock => (
          <StockItem key={stock.symbol} data={stock} summary={summary} />
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useContext } from 'react';
import StockItem from '../StockList/StockItem';
import { formatToLocalStocks } from '@/shared/common';
import Position from '../Position';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { StockContext } from '../../reducers';

import './StockList.scss';

const useStyles = makeStyles((theme) => ({
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
  }
}));
const TYPE_MAP = {
  asce: 1,
  desc: -1,
};

export default function StockList(props) {
  const classes = useStyles();
  const { dispatch } = props;
  const [stocks, setStocks] = useState([]);
  const [editStocks, setEditStocks] = useState([]);
  const [sort, setSort] = useState('default');
  const [key, type] = sort.split(':');
  let sortedStocks = [...stocks];

  const stockState = useContext(StockContext);

  useEffect(() => {
    setStocks(props.list);
    setEditStocks(props.list);
  }, [props.list]);

  // 点击添加按钮
  const handleAdd = stocks => {
    setEditStocks(stocks);
  };

  // 持仓添加/修改改变
  const handlePostionComplete = (data, stocks) => {
    console.log('编辑', data, stocks);
  };

  // 保存/修改持仓
  const hanldPostionClick = type => {
    if(type === 'edit') {
      dispatch({
        type: 'SET',
        payload: {
          showPostion: !stockState.showPostion,
          isEdit: true,
        },
      });
    }
    if (type === 'save') {
      const localStocks = formatToLocalStocks(StockList.core.stocks);
      localStorage.setItem('stocks', JSON.stringify(localStocks));
      props.onSave && props.onSave();
      dispatch({ type: 'SAVE' });
    }
  };

  // 排序选择权改变
  const handleSortChange = e => {
    setSort(e.target.value);
  };

  // 处理删除持仓
  const handleDletePosition = data => {
    const filterStocks = StockList.core.stocks.filter(v => String(v.symbol) !== String(data.symbol));

    setEditStocks([...filterStocks]);
    StockList.core.stocks = filterStocks;
  };

  if (key === 'default') {
    sortedStocks = stocks || [];
  } else {
    const ratio = TYPE_MAP[type] || 1;
    sortedStocks = stocks.sort((s1, s2) => (s1[key] - s2[key]) * ratio);
  }

  const { showPostion, summary } = stockState;

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
        <div className="position-tool" onClick={() => hanldPostionClick(showPostion ? 'save' : 'edit')}>
          {
            showPostion ? (
              <Button
                className={classes.saveButton}
                variant="contained"
                endIcon={ <PlaylistAddCheckIcon />}
                color="primary"
                size="small"
              >
                保存
              </Button>
            ): (
              <Button
                className={classes.editButton}
                variant="text"
                size="large"
                endIcon={ <PlaylistAddIcon />}
              >
                {`${stocks.length <= 0 ? '添加' : '修改'}持仓`}
              </Button>
            )
          }
        </div>
      </div>
      {showPostion && (
        <Position
          core={core => (StockList.core = core)}
          stocks={editStocks || stocks || []}
          onItemComplete={handlePostionComplete}
          onAdd={handleAdd}
          onDelete={handleDletePosition}
        />
      )}
      <div className="stock-list flow">
        {sortedStocks.map(stock => (
          <StockItem key={stock.symbol} data={stock} summary={summary} />
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useContext } from 'react';
import StockItem from './StockItem';
import { formatToLocalStocks } from '../utils/common';
import EditIconSrc from '../images/edit-icon.svg';
import SaveIconSrc from '../images/save-icon.svg';
import Position from './Position';
import { StockContext } from '../reducers';

import './Stock.scss';

const TYPE_MAP = {
  asce: 1,
  desc: -1,
};

export default function StockList(props) {
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

  const { showPostion } = stockState;

  return (
    <div className="stock-list-wrap">
      <div className="tools-box">
        <div className="sort-tool">
          <select onChange={handleSortChange}>
            <option value="default">默认排序</option>
            <option value="earnRate:asce">盈亏从低到高⬆</option>
            <option value="earnRate:desc">盈亏从高到低⬇</option>
            <option value="percent:asce">涨幅从低到高⬆</option>
            <option value="percent:desc">涨幅从高到低⬇</option>
          </select>
        </div>
        <div className="position-tool" onClick={() => hanldPostionClick(showPostion ? 'save' : 'edit')}>
          <span>{showPostion ? '保存' : `${stocks.length <= 0 ? '添加' : '修改'}持仓`}</span>
          <img src={SaveIconSrc} alt="save" style={{ display: showPostion ? 'block' : 'none' }} />
          <img src={EditIconSrc} alt="edit" style={{ display: showPostion ? 'none' : 'block' }} />
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
          <StockItem key={stock.symbol} data={stock} />
        ))}
      </div>
    </div>
  );
}

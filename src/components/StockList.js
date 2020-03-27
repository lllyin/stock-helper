import React, { useState, useEffect } from 'react';
import StockItem from './StockItem';
import { formatToLocalStocks } from '../utils/common';
import EditIconSrc from '../images/edit-icon.svg';
import SaveIconSrc from '../images/save-icon.svg';
import Position from './Position';

import './Stock.scss';

const TYPE_MAP = {
  asce: 1,
  desc: -1,
};

export default function StockList(props) {
  const [stocks, setStocks] = useState([]);
  const [editStocks, setEditStocks] = useState([]);
  const [showPostion, setShowPostion] = useState(false);
  const [sort, setSort] = useState('default');
  const [key, type] = sort.split(':');
  let sortedStocks = [...stocks];

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
    setShowPostion(!showPostion);
    if (type === 'save') {
      const localStocks = formatToLocalStocks(StockList.core.stocks);
      localStorage.setItem('stocks', JSON.stringify(localStocks));
      props.onSave && props.onSave();
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

  return (
    <div className="stock-list-wrap">
      <div className="tools-box">
        <div className="sort-tool">
          sort by
          <select onChange={handleSortChange}>
            <option value="default">default</option>
            <option value="earnRate:asce">盈亏⬆</option>
            <option value="earnRate:desc">盈亏⬇</option>
            <option value="percent:asce">涨幅⬆</option>
            <option value="percent:desc">涨幅⬇</option>
          </select>
        </div>
        <div className="position-tool" onClick={() => hanldPostionClick(showPostion ? 'save' : 'edit')}>
          <span>{showPostion ? '保存' : '修改持仓'}</span>
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
      <div className="stock-list">
        {sortedStocks.map(stock => (
          <StockItem key={stock.symbol} data={stock} />
        ))}
      </div>
    </div>
  );
}

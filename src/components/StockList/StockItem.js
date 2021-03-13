import React, { Component } from 'react';
import { toMultiple, updateStock, calcTargetPrice1, calcTargetPrice2 } from '../../shared/common';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import SettingPop from '../SettingPop';

import './StockItem.scss';

function caclClass(number) {
  if (number > 0) {
    return 'red';
  } else if (number < 0) {
    return 'green';
  } else {
    return 'default';
  }
}

function calcLink(data) {
  const bcLinkData = [
    { type: 0, eq: data.bcFn, color: '#13AD13' },
    { type: 1000, window: ['-200', '1500', '0', String(Math.abs(data.earnRate * (1.5).toFixed(2)))] },
  ];
  const jcLinkData = [
    { type: 0, eq: data.jcFn, color: '#ED1717' },
    { type: 1000, window: ['-100', '500', '0', String(Math.abs(data.earnRate * (1.5).toFixed(2)))] },
  ];
  const linkData = data.costPrice > data.price ? bcLinkData : jcLinkData;
  // replace这一步是因为绘图网站http://fooplot.com的base64算法使用-代替=填充
  const base64 = window.btoa(JSON.stringify(linkData)).replace(/=/g, '-');

  return `http://fooplot.com/#${base64}`;
}

export default class StockItem extends Component {
  state = {
    isShowSetting: false,
    simulateOptions: {
      p: 0.6,
      cycle: 30,
      up_threshold: 2,
      up_position: 500,
      down_threshold: 2,
      down_position: 500,
    },
  };

  // 点击补仓函数跳转至函数绘图网站
  handleLinkClick(data) {
    const url = calcLink(data);
    window.open(url, data.name);
  }

  // 打开/关闭设置面板
  handleToogleSetting = (flag) => {
    this.setState({
      isShowSetting: flag,
    });
  };

  // 点击面板确定
  handleConfirm = (values) => {
    console.log('handleConfirm', values);
    if (values) {
      updateStock(this.props.data.symbol, values);
    }
  };

  calcTargetPercent = (targetRate, data) => {
    const { summary } = this.props;

    // 所有持仓最大亏损比绝对值
    const maxAbsEarnRate = summary.earn.maxAbsRate;
    // 当前持仓亏损比绝对值
    const currentAbsEarnRate = Math.abs(targetRate);
    // 参考值，以此值作为基础值来计算百分比
    const baseRate = toMultiple(maxAbsEarnRate, 0.05);
    // 占比
    const inPercent = (currentAbsEarnRate / baseRate).toFixed(2);

    return inPercent;
  };

  calcPercentStyle = (targetRate) => {
    return {
      flex: this.calcTargetPercent(targetRate),
    };
  };

  render() {
    const { data } = this.props;
    const { isShowSetting } = this.state;
    // 每股收益
    const earningsPerShare = data.price - data.costPrice;
    const earningCls = caclClass(earningsPerShare);

    // 计算达到预期亏损的补仓建议
    let { advice } = data;

    const style = this.calcPercentStyle(data.earnRate);

    console.log('hah', data);
    return (
      <div className={`stock-item ${earningCls}`}>
        <div className='title-box'>
          <h3>{data.name || '无名股票'}</h3>
          <div className='more-tools'>
            <IconButton aria-label='setting' onClick={() => this.handleToogleSetting(true)}>
              <SettingsIcon />
            </IconButton>
          </div>
        </div>
        <SettingPop
          open={isShowSetting}
          data={data}
          onConfirm={this.handleConfirm}
          onClose={() => this.handleToogleSetting(false)}
        />
        <seaction>
          <div className='row'>
            <div className='cell stock-spc-item'>
              <label className='stock-item-label'>成本</label>
              <span className='stock-item-value'>{data.costPrice}</span>
            </div>
            <div className='cell stock-spc-item'>
              <label className='stock-item-label'>持仓</label>
              <span className='stock-item-value'>{data.position}</span>
            </div>
          </div>

          <div className='white-blank'></div>
          <div className='row'>
            <div className='cell stock-spc-item'>
              <label className='stock-item-label'>现价</label>
              <span className='stock-item-value'>{data.price}</span>
            </div>
            <div className='cell stock-spc-item'>
              <label className='stock-item-label'>日浮{data.percent >= 0 ? '盈' : '亏'}</label>
              <span className={`stock-item-value ${caclClass(data.percent)} weight`}>
                {(data.costPrice * data.position * data.percent).toFixed(2)}
              </span>
            </div>
          </div>

          <div className='white-blank'></div>
          <div className={`stock-spc-item percent-item`}>
            <label className='stock-item-label'>当日{data.percent >= 0 ? '涨' : '跌'}幅</label>
            <span className={`stock-item-value weight ${caclClass(data.percent)}`}>
              {(data.percent * 100).toFixed(2)}%
              <i className='percent-bar' style={{ width: `${Math.abs(data.percent * 1000)}%` }} />
            </span>
          </div>

          <div className='white-blank'></div>
          <div className='stock-spc-item earn-rate-item'>
            <label className='stock-item-label'>总盈亏</label>
            <span className={`stock-item-value ${earningCls} weight`} style={style}>
              <i className='earn-money'>
                {earningsPerShare >= 0 ? '盈' : '亏'}: {(data.earnRate * data.costPrice * data.position).toFixed(2)}元
              </i>
              {(data.earnRate * 100).toFixed(3)}%
            </span>
          </div>

          {data.eps && data.pe && data.profits && (
            <React.Fragment>
              <div className='white-blank'></div>
              <div className='stock-spc-item earn-rate-item target'>
                <label className='stock-item-label'>目标估值1</label>
                <span
                  className={`stock-item-value ${caclClass(calcTargetPrice1(data) - data.costPrice)} weight`}
                  style={this.calcPercentStyle(calcTargetPrice1(data) / data.costPrice - 1)}
                >
                  <i className='earn-money'>估价1: {calcTargetPrice1(data).toFixed(2)}元</i>
                  {((calcTargetPrice1(data) / data.costPrice - 1) * 100).toFixed(3)}%
                </span>
              </div>
            </React.Fragment>
          )}

          {data.eps && data.pe && data.profits && (
            <React.Fragment>
              <div className='white-blank'></div>
              <div className='stock-spc-item earn-rate-item target'>
                <label className='stock-item-label'>目标估值2</label>
                <span
                  className={`stock-item-value ${caclClass(calcTargetPrice2(data) - data.costPrice)} weight`}
                  style={this.calcPercentStyle(calcTargetPrice2(data) / data.costPrice - 1)}
                >
                  <i className='earn-money'>估价2: {calcTargetPrice2(data).toFixed(2)}元</i>
                  {((calcTargetPrice2(data) / data.costPrice - 1) * 100).toFixed(3)}%
                </span>
              </div>
            </React.Fragment>
          )}

          <div className='white-blank'></div>
          <div className='stock-spc-item'>
            <label className='stock-item-label'>{earningsPerShare < 0 ? '补仓函数' : '加仓函数'}</label>
            <span
              className='stock-item-value'
              onClick={() => {
                this.handleLinkClick(data);
              }}
            >
              <span className='link'>查看</span>
              {/* <small className="text-weak">(灰色曲线为函数的导数图)</small> */}
            </span>
          </div>

          <div className='white-blank'></div>

          {advice.x && (
            <div className='stock-spc-item advice-item'>
              <label className='stock-item-label'>建议</label>
              <span className='stock-item-value advice-value'>
                目前您的亏损超过了{Math.floor(Math.abs(data.earnRate) * 100)}%。建议补仓
                <b className='mark'>{(advice.x / 100) >> 0}</b>
                手， 需要资金
                <b className='mark'>¥{Math.ceil(data.price * advice.x)}</b>, 可将亏损降至
                <b className='mark'>{(advice.approValue * 100).toFixed(3)}%</b>。
              </span>
            </div>
          )}
        </seaction>
      </div>
    );
  }
}

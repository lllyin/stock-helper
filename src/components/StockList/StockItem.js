import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import { makeStyles } from '@material-ui/core/styles'
import LineChart from '@/components/Chart/LineChart'
import { createChartData } from '@/shared/chart'
import { toMultiple, updateStock, calcTargetPrice1, calcTargetPrice2 } from '../../shared/common'
import SettingPop from '../SettingPop'

import './StockItem.scss'

const useStyles = makeStyles({
  root: {},
  iconButton: {
    padding: 6,
  },
  fnLabel: {
    width: '110px !important',
  },
  chartBox: {
    width: '100%',
    height: 300,
    userSelect: 'none',
  },
})

function caclClass(number) {
  if (number > 0) {
    return 'red'
  }
  if (number < 0) {
    return 'green'
  }
  return 'default'
}

export default function StockItem(props) {
  const classes = useStyles()
  const [state, setState] = useState({
    isShowSetting: false,
    simulateOptions: {
      p: 0.6,
      cycle: 30,
      up_threshold: 2,
      up_position: 500,
      down_threshold: 2,
      down_position: 500,
    },
  })

  // 打开/关闭设置面板
  const handleToogleSetting = (flag) => {
    setState({
      isShowSetting: flag,
    })
  }

  // 点击面板确定
  const handleConfirm = (values) => {
    if (values) {
      updateStock(props.data.symbol, values)
    }
  }

  const calcTargetPercent = (targetRate) => {
    const { summary } = props

    // 所有持仓最大亏损比绝对值
    const maxAbsEarnRate = summary.earn.maxAbsRate
    // 当前持仓亏损比绝对值
    const currentAbsEarnRate = Math.abs(targetRate)
    // 参考值，以此值作为基础值来计算百分比
    const baseRate = toMultiple(maxAbsEarnRate, 0.05)
    // 占比
    const inPercent = (currentAbsEarnRate / baseRate).toFixed(2)

    return inPercent
  }

  const calcPercentStyle = (targetRate) => ({
    flex: calcTargetPercent(targetRate),
  })

  const { data } = props
  const { isShowSetting } = state
  // 每股收益
  const earningsPerShare = data.price - data.costPrice
  const earningCls = caclClass(earningsPerShare)

  // 计算达到预期亏损的补仓建议
  const { advice } = data

  const style = calcPercentStyle(data.earnRate)

  const chartSource = earningsPerShare < 0 ? createChartData(data.bcFn, {
    xRange: [0, 1000],
    xStep: 100,
  }) : createChartData(data.jcFn, {
    xRange: [0, 1000],
    xStep: 100,
  })

  return (
    <div className={`stock-item ${earningCls}`}>
      <div className="title-box">
        <h3>{data.name || '无名股票'}</h3>
        <div className="more-tools">
          <IconButton aria-label="setting" onClick={() => handleToogleSetting(true)}>
            <SettingsIcon />
          </IconButton>
        </div>
      </div>
      <SettingPop
        open={isShowSetting}
        data={data}
        onConfirm={handleConfirm}
        onClose={() => handleToogleSetting(false)}
      />
      <section>
        <div className="row">
          <div className="cell stock-spc-item">
            <label className="stock-item-label">成本</label>
            <span className="stock-item-value">{data.costPrice}</span>
          </div>
          <div className="cell stock-spc-item">
            <label className="stock-item-label">持仓</label>
            <span className="stock-item-value">{data.position}</span>
          </div>
        </div>

        <div className="white-blank" />
        <div className="row">
          <div className="cell stock-spc-item">
            <label className="stock-item-label">现价</label>
            <span className="stock-item-value">{data.price}</span>
          </div>
          <div className="cell stock-spc-item">
            <label className="stock-item-label">日浮{data.percent >= 0 ? '盈' : '亏'}</label>
            <span className={`stock-item-value ${caclClass(data.percent)} weight`}>
              {(data.costPrice * data.position * data.percent).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="white-blank" />
        <div className="stock-spc-item percent-item">
          <label className="stock-item-label">当日{data.percent >= 0 ? '涨' : '跌'}幅</label>
          <span className={`stock-item-value weight ${caclClass(data.percent)}`}>
            {(data.percent * 100).toFixed(2)}%
            <i className="percent-bar" style={{ width: `${Math.abs(data.percent * 1000)}%` }} />
          </span>
        </div>

        <div className="white-blank" />
        <div className="stock-spc-item earn-rate-item">
          <label className="stock-item-label">总盈亏</label>
          <span className={`stock-item-value ${earningCls} weight`} style={style}>
            <i className="earn-money">
              {earningsPerShare >= 0 ? '盈' : '亏'}:{' '}
              {(data.earnRate * data.costPrice * data.position).toFixed(2)}元
            </i>
            {(data.earnRate * 100).toFixed(3)}%
          </span>
        </div>

        {data.eps && data.pe && data.profits && (
          <>
            <div className="white-blank" />
            <div className="stock-spc-item earn-rate-item target">
              <label className="stock-item-label">目标估值1</label>
              <span
                className={`stock-item-value ${caclClass(
                  calcTargetPrice1(data) - data.costPrice
                )} weight`}
                style={calcPercentStyle(calcTargetPrice1(data) / data.costPrice - 1)}
              >
                <i className="earn-money">估价1: {calcTargetPrice1(data).toFixed(2)}元</i>
                {((calcTargetPrice1(data) / data.costPrice - 1) * 100).toFixed(3)}%
              </span>
            </div>
          </>
        )}

        {data.eps && data.pe && data.profits && (
          <>
            <div className="white-blank" />
            <div className="stock-spc-item earn-rate-item target">
              <label className="stock-item-label">目标估值2</label>
              <span
                className={`stock-item-value ${caclClass(
                  calcTargetPrice2(data) - data.costPrice
                )} weight`}
                style={calcPercentStyle(calcTargetPrice2(data) / data.costPrice - 1)}
              >
                <i className="earn-money">估价2: {calcTargetPrice2(data).toFixed(2)}元</i>
                {((calcTargetPrice2(data) / data.costPrice - 1) * 100).toFixed(3)}%
              </span>
            </div>
          </>
        )}

        <div className="white-blank" />
        <div className="stock-spc-item">
          <label className={`stock-item-label ${classes.fnLabel}`}>
            {earningsPerShare < 0 ? '补仓收益曲线' : '加仓收益曲线'}
          </label>
        </div>

        <div className={classes.chartBox}>
          <LineChart source={chartSource} position="x*y" />
        </div>

        <div className="white-blank" />

        {advice.x && (
          <div className="stock-spc-item advice-item">
            <label className="stock-item-label">建议</label>
            <span className="stock-item-value advice-value">
              目前您的亏损超过了{Math.floor(Math.abs(data.earnRate) * 100)}%。建议补仓
              <b className="mark">{(advice.x / 100) >> 0}</b>
              手， 需要资金
              <b className="mark">¥{Math.ceil(data.price * advice.x)}</b>, 可将亏损降至
              <b className="mark">{(advice.approValue * 100).toFixed(3)}%</b>。
            </span>
          </div>
        )}
      </section>
    </div>
  )
}

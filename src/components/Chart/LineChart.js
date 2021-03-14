import React, { PureComponent } from 'react'
import Chart from './Chart'

const defaultStyle = {
  width: '100%',
  height: '100%',
}
export default class LineChart extends PureComponent {
  creator = (chart, data) => {
    const { source, position } = data
    const [xKey, yKey] = position.split('*')

    chart.source(source, {
      [yKey]: {
        tickCount: 5,
        min: 0,
      },
      [xKey]: {
        type: 'linear',
        range: [0, 1],
        tickCount: 11,
      },
    })

    chart.tooltip({
      custom: true,
      showXTip: true,
      showYTip: true,
      snap: true,
      crosshairsType: 'xy',
      crosshairsStyle: {
        lineDash: [2],
      },
      yTip(value) {
        return `${(value * 100).toFixed(2)}%`
      },
    })

    chart.axis(xKey, {
      label: function label(text, index, total) {
        const textCfg = {}
        if (index === 0) {
          textCfg.textAlign = 'left'
        } else if (index === total - 1) {
          textCfg.textAlign = 'right'
        }

        textCfg.text = `${text / 100}手`
        return textCfg
      },
    })

    chart.axis(yKey, {
      label: function label(value) {
        const textCfg = {}

        textCfg.text = `${(value * 100).toFixed(1)}%`
        return textCfg
      },
    })

    chart.line().position(position).shape('smooth')

    chart.render()
  }

  render() {
    const { source = [], position, width, height } = this.props
    const style = {
      width: width || defaultStyle.width,
      height: height || defaultStyle.height,
    }

    return (
      <div className="jsChartWrap" style={style}>
        <Chart data={{ source, position }} creator={this.creator} />
      </div>
    )
  }
}

import React, { PureComponent } from 'react';
import Chart from './Chart';

export default class LineChart extends PureComponent {
  boxRef = null;

  constructor(props) {
    super(props);
    this.state = {
      boxRect: {
        width: 0,
        height: 0,
      },
    };
  }

  componentDidMount() {
    if (this.boxRef) {
      const boxRect = this.boxRef.getBoundingClientRect();
      this.setState({
        boxRect: { width: boxRect.width, height: boxRect.height },
      });
    }
  }

  componentDidUpdate() {
    if (this.boxRef) {
      const { height, width } = this.state.boxRect;
      const boxRect = this.boxRef.getBoundingClientRect();
      if (height !== boxRect.height || width !== boxRect.width) {
        this.setState({
          boxRect: { width: boxRect.width, height: boxRect.height },
        });
      }
    }
  }

  creator = (chart, data) => {
    const { source } = data;
    // 获取html设置的dpr
    const devicePixelRatio = Number(document.documentElement.getAttribute('data-dpr')) || 1;

    chart.source(source);

    chart.scale('x', {
      type: 'cat',
      tickCount: 10,
    });
    chart.scale('y', {
      tickCount: 0,
    });

    chart.tooltip({
      custom: true,
      showXTip: true,
      showYTip: true,
      snap: true,
      crosshairsType: 'xy',
      crosshairsStyle: {
        lineDash: [2],
      },
    });

    chart
      .line()
      .position('x*y')
      .color('type')
      .size(2 * devicePixelRatio)
      .shape('type', (type) => {
        if (type === '模拟收益') {
          return 'line';
        }
        if (type === '市场收益') {
          return 'dash';
        }
      });

    chart
      .point()
      .position('x*y')
      .color('type')
      .size(2 * devicePixelRatio)
      .shape('smooth');

    chart.area().position('x*y').color('type').shape('smooth');

    chart.render();
  };

  render() {
    const { data, width, height } = this.props;
    const { boxRect } = this.state;
    const { source = [] } = data;

    const boxStyles = {
      width,
      height,
    };

    return (
      <div className="jsChartWrap" ref={(node) => (this.boxRef = node)} style={boxStyles}>
        {boxRect.width && boxRect.height && source.length ? (
          <Chart data={{ source }} width={boxRect.width} height={boxRect.height} creator={this.creator} />
        ) : null}
      </div>
    );
  }
}

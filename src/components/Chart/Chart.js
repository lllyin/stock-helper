import React, { Component } from 'react';
import F2 from '@antv/f2';

export default class extends Component {
  id = `c${Math.random()
    .toString(36)
    .substring(7)}`;

  chart = null;

  init = () => {
    const { width, height, creator, data } = this.props;
    const chart = new F2.Chart({
      id: this.id,
      width,
      height,
      pixelRatio: window.devicePixelRatio,
      // padding: [30, 0, 0, 0],
      appendPadding: [30, 20, 0, 0],
    });

    creator(chart, data);
    this.chart = chart;
  };

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.chart.destroy();
    this.chart = null;
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <canvas id={this.id} />;
  }
}

import React, { Component } from 'react'
import F2 from '@antv/f2'

export default class extends Component {
  id = `c${Math.random().toString(36).substring(7)}`

  state = {
    isRender: false,
  }

  chart = null

  init = (options) => {
    const { width = options.width, height = options.height, creator, data } = this.props
    const chart = new F2.Chart({
      id: this.id,
      width,
      height,
      pixelRatio: window.devicePixelRatio,
      // padding: [30, 0, 0, 0],
      appendPadding: [10, 20, 6, 0],
    })

    creator(chart, data)
    this.chart = chart
  }

  componentDidMount() {
    const { width, height } = this.getParentRect()
    this.init({
      width,
      height,
    })
  }

  componentDidUpdate() {
    const { isRender } = this.state

    if (isRender) {
      const { width, height } = this.getParentRect()

      this.init({
        width,
        height,
      })
    }
  }

  getParentRect = () => {
    const parentEl = this.canvas.parentElement

    if (parentEl) {
      const { width, height } = parentEl.getBoundingClientRect()

      this.setState({
        isRender: true,
      })
      return { width, height }
    }
    this.setState({
      isRender: false,
    })
    return {}
  }

  componentWillUnmount() {
    this.chart.destroy()
    this.chart = null
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <canvas
        id={this.id}
        ref={(node) => {
          this.canvas = node
        }}
      />
    )
  }
}

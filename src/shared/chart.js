import { excuteExpression } from './math'

const defaultCreateChartDataOptions = {
  xRange: [0, 100],
  xStep: 1,
  xKey: 'x',
  yKey: 'y',
}
export function createChartData(expression, options = defaultCreateChartDataOptions) {
  const { xRange, xStep, xKey, yKey } = { ...defaultCreateChartDataOptions, ...options }
  const result = []
  for (let i = xRange[0]; i <= xRange[1]; i += xStep) {
    const y = excuteExpression(expression, 'x', i)
    const item = {
      [xKey]: i,
      [yKey]: y,
    }

    result.push(item)
  }

  return result
}

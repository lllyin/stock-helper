/**
 * 代入变量到公式并返回执行结果
 * @param {*} formula 公式
 * @param {*} variableKey 变量key
 * @param {*} variable 代入变量值
 */
export function excuteExpression(expression, vKey, vVal) {
  const matchs = expression.match(new RegExp(vKey, 'gi'))
  let newExpression = expression

  if (matchs.length) {
    matchs.forEach(() => {
      const variableIdx = newExpression.indexOf(vKey)
      const prevChart = newExpression[variableIdx - 1]
      const nextChart = newExpression[variableIdx + 1]

      if (variableIdx > -1) {
        if (/\d/.test(prevChart)) {
          newExpression = newExpression.replaceAt(variableIdx, `*${vVal}`)
        } else if (/\d/.test(nextChart)) {
          newExpression = newExpression.replaceAt(variableIdx, `${vVal}*`)
        } else {
          newExpression = newExpression.replaceAt(variableIdx, `${vVal}`)
        }
      }
    })
  }
  // eslint-disable-next-line no-eval
  return eval(newExpression)
}

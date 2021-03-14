const _STORAGE_KEY_ = 'stocks'

export function setStocksStorage(stocks) {
  localStorage.setItem(_STORAGE_KEY_, JSON.stringify(stocks))
}

export function getStocksStorage() {
  let _stocks = []

  try {
    _stocks = JSON.parse(localStorage.getItem(_STORAGE_KEY_))
  } catch (err) {
    console.warn('读取localStorage报错', err)
  }

  return _stocks
}

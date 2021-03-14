export default function jsonp(options) {
  return new Promise((resolve, reject) => {
    if (!window.$) {
      reject(new Error('不存在$.ajax'))
    }

    window.$.ajax({
      ...options,
      success(res) {
        resolve(res)
      },
      error(err) {
        reject(err)
      },
    })
  })
}

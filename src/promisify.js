export default function promisify (fn, displayName) {
  let newFn = (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, ...results) => {
      if (err) {
        reject(err)
      } else {
        resolve(...results)
      }
    })
  })
  newFn.displayName = displayName || fn.displayName || fn.name
  return newFn
}

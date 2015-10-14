// Found at https://www.promisejs.org/generators/ which is MIT licensed

export default function generatorToAsync (makeGenerator) {
  return function () {
    var generator = makeGenerator.apply(this, arguments)

    function handle (result) {
      // result => { done: [Boolean], value: [Object] }
      if (result.done) return Promise.resolve(result.value)

      return Promise.resolve(result.value).then(function (res) {
        return handle(generator.next(res))
      }, function (err) {
        return handle(generator.throw(err))
      })
    }

    try {
      return handle(generator.next())
    } catch (ex) {
      return Promise.reject(ex)
    }
  }
}

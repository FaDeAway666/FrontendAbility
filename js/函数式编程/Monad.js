// 将IO函子改造成Monad函子
const fp = require('lodash')
const fs = require('fs')
class IO {
  static of (fn) {
    return new IO(fn)
  }

  constructor (fn) {
    this.fn = fn
  }

  map(outerFn) {
    return IO.of(fp.flowRight(outerFn, this.fn))
  }

  //增加join，用来扁平函子
  join() {
    return this.fn()
  }

  //增加flatMap，用来解决函子嵌套
  flatMap(outerFn) {
    return this.map(outerFn).join()
  }
}

let readFile = filename => {
  return IO.of(function() {
    return fs.readFileSync(filename, 'utf-8')
  })
}

let print = x => {
  return IO.of(function() {
    return x
  })
}

let f = readFile('package.json')
          .map(fp.toUpper) // 处理值
          .flatMap(print) // 解套
          .join() // 调用

console.log(f)
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  // 构造时传入执行器函数，执行器函数接收两个参数，resolve和reject方法
  constructor (executor) {
    try {
      executor(this.resolve, this.reject)
    }catch (e) {
      this.reject(e)
    }
  }
  // 定义状态属性
  status = PENDING
  // 定义成功后的value值
  value = undefined
  // 定义错误属性
  err = undefined
  // 定义resolve回调队列
  onFulfilled = []
  // 定义reject回调队列
  onRejected = []

  // resolve 原型方法
  resolve = (value) => {
    // 如果状态已更改，直接返回
    if(this.status !== PENDING) return
    // resolve方法的核心目的，就是将pending状态变为fulfilled
    this.status = FULFILLED
    // 存储成功之后的值
    this.value = value
    // 在状态变为fulfilled后，依次执行resolve回调队列中的回调函数
    while(this.onFulfilled.length) this.onFulfilled.shift()()
  }

  reject = (err) => {
    // 如果状态已更改，直接返回
    if (this.status !== PENDING) return

    // reject方法的核心目的，就是将pending状态变为rejected
    this.status = REJECTED
    // 存储错误信息
    this.err = err
    // 在状态变为rejected后，依次执行reject回调队列中的回调函数
    while(this.onRejected.length) this.onRejected.shift()()
  }
  // then方法定义在原型对象上，接收一个resolve回调，一个reject回调
  then (onFulfilled, onRejected) {
    // 判断是否传递了resolve回调，如果没有传递，则默认传递一个接收一个value参数的函数，并将其返回出去
    onFulfilled = onFulfilled ? onFulfilled : value => value;
    // 判断是否传递了reject回调，如果没有传递，则默认传递一个接收一个err参数的函数，并将其已Error形式返回出去
    onRejected = onRejected ? onRejected : err => new Error(err)
    // 为了实现then方法的链式调用，应返回一个myPromise对象
    let promise = new MyPromise((resolve, reject) => {

      if(this.status === FULFILLED) {
        // 这里的settimeout只是为了将内部代码放到同步代码的后面执行，为了获得promise对象
        setTimeout(() => {
          try {
            // 当status为fulfilled时，执行当前传入的resolve回调，并将成功的值传入回调
            let result = onFulfilled(this.value)
            // 处理resolve回调的返回值，如果是一个promise对象，则继续调用then，若是普通值，则将其直接返回
            resolvePromise(promise, result, resolve, reject)
          }catch (e) {
            // 出现错误，调用reject方法变更状态
            reject(e)
          }
            
        }, 0);
      }
  
      else if(this.status === REJECTED) {
        setTimeout(() => {
          try {
            // 当status为rejected时，执行当前传入的reject回调，并将错误信息传入回调
            let result = onRejected(this.err)
            // 处理resolve回调的返回值
            resolvePromise(promise, result, resolve, reject)
          }catch (e) {
            reject(e)
          }
            
        }, 0);
      }
         
      else {
        // 若status处于pending状态，则将当前的resolve回调和reject回调，经过一个函数包装，存入相应的回调队列
        // 当后续状态发生改变的时候，再去执行这些回调
        this.onFulfilled.push(() => {
          // 此函数与之前的用法一致
          setTimeout(() => {
            try {
              let result = onFulfilled(this.value)
            
              resolvePromise(promise, result, resolve, reject)
            }catch (e) {
              reject(e)
            }
              
          }, 0);
        })
        this.onRejected.push(() => {
          
          setTimeout(() => {
            try {
              let result = onRejected(this.err)
            
              resolvePromise(promise, result, resolve, reject)
            }catch (e) {
              reject(e)
            }
              
          }, 0);
        })
      }
    })
    return promise
  }
  // catch方法，相当于不传递成功回调的then方法，只接收一个reject回调
  catch (onRejected) {
    return this.then(undefined, onRejected)
  }
  // finally方法，接收一个回调函数作为参数
  finally (callback) {
    // 为了实现finally方法后仍可以调用then方法，因此使用this.then返回一个promise
    return this.then(value => {
      // finally方法的执行结果都用MyPromise.resolve去将其转换成一个fulfilled的promise对象
      // 执行完回调后，将调用finally之前的promise结果传递下去
      return MyPromise.resolve(callback()).then(() => value )
    }, err => {
      return MyPromise.resolve(callback()).then(() => {throw err})
    })
      
  }
  // MyPromise.resolve，接收一个值作为参数
  static resolve (value) {
    // 如果接收的值是promise对象，则原封不动返回
    if(value instanceof MyPromise) {
      return value
    } else {
      // 如果接收的值是一个其他值，则将其转换成一个fulfilled的promise对象
      return new MyPromise(resolve => resolve(value))
    }
  }

  // MyPromise.reject，接收一个值作为参数
  static reject (err) {
    // 将这个值转换成一个rejected的promise对象
    return new MyPromise((resolve, reject) => reject(err))
  }

  // all 方法，接收一个数组，返回一个promise对象
  static all (array) {
    let result = [] // 定义结果数组
    let index = 0 // 定义执行位置
    return new MyPromise((resolve, reject) => {
      // 将参数数组的执行结果存放至结果数组中
      function addData (i, data) {
        result[i] = data
        index++
        // 当参数数组中所有元素都经过一次执行后，返回最终的结果
        if (index === array.length) resolve(result)
      }
      // 遍历数组，如果值为promise对象，则调用其then方法，使用addData函数接收其成功的返回值，如果中间出现错误，则结束循环，抛出错误
      for (let i = 0; i < array.length; i++) {
        if(array[i] instanceof MyPromise) {
          array[i].then(value => addData(i, value), err => reject(err))
        } else {
          // 如果值为其他类型，则直接将其添加至结果数组
          addData(i, array[i])
        }
      }
    })
  }

  // race方法，接收一个数组，返回promise对象
  static race (array) {
    return new MyPromise((resolve, reject) => {
      // 遍历数组，只要有一个元素resolve了，直接返回结果
      for (let i = 0; i < array.length; i++) {
        if(array[i] instanceof MyPromise) {
          array[i].then(value => resolve(value), err => reject(err))
        } else {
          resolve(array[i])
        }
      }
    })
  }
}
// 处理回调返回值的函数
function resolvePromise(promise, obj, resolve, reject) {
  if (obj === promise) {
    return reject(new TypeError('chain promise error'))
  }

  if(obj instanceof MyPromise) {
    obj.then(resolve, reject)
  } else {
    resolve(obj)
  }
}

module.exports = MyPromise
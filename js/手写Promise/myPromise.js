const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor (executor) {
    executor(this.resolve, this.reject)
  }

  status = PENDING
  
  value = undefined
  err = undefined

  resolve = (value) => {
    if(this.status !== PENDING) return

    this.status = FULFILLED
    this.value = value
  }

  reject = (err) => {
    if (this.status !== PENDING) return

    this.status = REJECTED
    this.err = err
  }
  // then方法定义在原型对象上
  then (onFulfilled, onRejected) {
    if(this.status === FULFILLED)
      onFulfilled(this.value)

    else if(this.status === REJECTED)
      onRejected(this.err )
  }
}

module.exports = MyPromise
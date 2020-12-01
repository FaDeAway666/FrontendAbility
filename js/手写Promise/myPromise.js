const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor (executor) {
    try {
      
      executor(this.resolve, this.reject)
    }catch (e) {
      this.reject(e)
    }
  }

  status = PENDING
  
  value = undefined
  err = undefined

  onFulfilled = []
  onRejected = []

  resolve = (value) => {
    if(this.status !== PENDING) return

    this.status = FULFILLED
    this.value = value

    while(this.onFulfilled.length) this.onFulfilled.shift()()
  }

  reject = (err) => {
    if (this.status !== PENDING) return

    this.status = REJECTED
    this.err = err

    while(this.onRejected.length) this.onRejected.shift()()
  }
  // then方法定义在原型对象上
  then (onFulfilled, onRejected) {
    onFulfilled = onFulfilled ? onFulfilled : value => value;
    onRejected = onRejected ? onRejected : err => new Error(err)
    let promise = new MyPromise((resolve, reject) => {

      if(this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let result = onFulfilled(this.value)
          
            resolvePromise(promise, result, resolve, reject)
          }catch (e) {
            reject(e)
          }
            
        }, 0);
      }
  
      else if(this.status === REJECTED) {
        setTimeout(() => {
          try {
            let result = onRejected(this.err)
          
            resolvePromise(promise, result, resolve, reject)
          }catch (e) {
            reject(e)
          }
            
        }, 0);
      }
         
      else {
        this.onFulfilled.push(() => {
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

  catch (onRejected) {
    return this.then(undefined, onRejected)
  }

  finally (callback) {
    return this.then(value => {
      return MyPromise.resolve(callback()).then(() => value )
    }, err => {
      return MyPromise.resolve(callback()).then(() => {throw err})
    })
      
  }

  static resolve (value) {
    if(value instanceof MyPromise) {
      return value
    } else {
      return new MyPromise(resolve => resolve(value))
    }
  }

  static reject (err) {
    return new MyPromise((resolve, reject) => reject(err))
  }

  static all (array) {
    let result = []
    let index = 0
    return new MyPromise((resolve, reject) => {
      function addData (i, data) {
        result[i] = data
        index++
        if (index === array.length) resolve(result)
      }
      for (let i = 0; i < array.length; i++) {
        if(array[i] instanceof MyPromise) {
          array[i].then(value => addData(i, value), err => reject(err))
        } else {
          addData(i, array[i])
        }
      }
    })
  }

  static race (array) {
    return new MyPromise((resolve, reject) => {
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
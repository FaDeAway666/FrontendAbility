/**
 * 1. Promise是一个类，需要传递一个具有resolve和reject作为参数的函数，这个函数会立即执行
 * 2. Promise 中有三种状态，fulfilled，pending和rejected
 *    pending --> fulfilled
 *    pending --> rejected
 *    一旦状态变更，就不能更改
 * 3. resolve和reject函数是用来更改状态的，它们都是静态方法
 * 4. then方法拥有两个参数，一个是fulfilled回调，一个是reject回调
 *    该方法先判断状态，如果状态是fulfilled，则执行fulfilled回调，如果状态rejected，则执行reject回调
 * 5. then 两个回调的参数，都是相应状态下的返回值
 * 6. then 方法需要链式调用
 *    6.1 then方法需要返回promise对象
 *    6.2 then方法需要接受上一个then方法的返回值，
 *        是普通值 调用resolve
 *        是promise对象 查看这个promise的结果，决定调用resolve还是reject
 */

 const { resolve } = require('./myPromise');
const MyPromise = require('./myPromise');
const myPromise = require('./myPromise');

 let promise = new myPromise((resolve,reject) => {
   setTimeout(() => {
     
     resolve('success')
   }, 2000);
  //  resolve('success')
  //  throw new Error('error')

  //  reject('fail')
 })

 function other() {
   return new myPromise((resolve, reject) => {
      setTimeout(() => {
        resolve('other')
      }, 2000);
   })
 }

let p1 = function() {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 2000);
  })
}

let p2 = function() {
  return new MyPromise((resolve, reject) => {
    reject('p2')
  })
}

// MyPromise.all(['a','b ',p1(),p2(),'c']).then(res => console.log(res), err => console.log(err))

// MyPromise.race([p1(), p2(), '2']).then(res => console.log(res))

// MyPromise.resolve(100).then(res => console.log(res))
// MyPromise.resolve(p1()).then(res => console.log(res))

// MyPromise.reject(new Promise((res,rej) => res(111))).then(res => console.log(res)).catch(err => console.log(err))

p2().finally( () => { console.log('finally'); return p1()}).then(res => {console.log(res)},
  err => {console.log(err)}
)
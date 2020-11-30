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
 */

 const myPromise = require('./myPromise');

 let promise = new myPromise((resolve,reject) => {
   resolve('success')

   reject('fail')
 })

 promise.then(value => {
   console.log(value)
 }, err => {
   console.log(err)
 })
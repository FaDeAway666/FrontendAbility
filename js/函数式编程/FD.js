// 函数作为参数
function filter(arr, fn) {
  let result = []
  for(let i=0; i<arr.length; i++) {
      if(fn(arr[i])) {
          result.push(arr[i])
      }
  }
  return result
}

let arr = [1,2,3,4,5]
filter(arr, function(item) {
  return item % 2 == 0
})

// 函数作为返回值
/**函数只执行一次 */
function once(fn) {
  let done = false;
  console.log(done, 'define done')
  return function () {
    console.log(done, 'done')
    if(!done) {
      done = true;
      console.log(arguments);
      return fn.apply(this, arguments);
    }
  }
}

function pay(money) {
  console.log('我支付了:' + money)
}

let test = once(pay) // 这种方式，once只执行一次，test等于是一个闭包，里面有已经赋值过的done
test(5)
test(5)
test(5)

once(pay)(5) // 这种方式，没有办法实现只执行一次，因为每次都重新执行了once函数
once(pay)(5)
once(pay)(5)
const _ = require('lodash')

function getSum(a, b, c) {
    return a + b + c
}

const curried = _.curry(getSum)

// console.log(curried(1,2,3))
// console.log(curried(1,2)(3))
// console.log(curried(1)(2,3))
// console.log(curried(1)(2)(3))

function curry(fn) {
    return function curried(...args) {
        if(args.length < fn.length) {
            return function() { // 如果args的长度小于fn参数的长度，重新return一个function去接收后面的参数，并进行递归
                console.log(args, arguments)
                return curried(...args.concat(Array.from(arguments)))
            }
        }
        else
            return fn(...args)
    }
}

const curried2 = curry(getSum)
console.log(curried2(1)(2)(3))
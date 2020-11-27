const _ = require('lodash')

function reverse (arr) {
    return arr.reverse()
}

function first (arr) {
    return arr[0]
}

const last = _.flowRight(first, reverse);
console.log(last([1,2,3,4]))

function compose(...args) {
    return function(value) {
        return args.reduceRight((acc, fn) => fn(acc), value)
    }
}
const last2 = compose(first, reverse)
console.log(last2([1,2,3,4]))
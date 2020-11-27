const fp = require('lodash/fp')

// world wide web ---> W.W.W

// 分割空格，转大写，取第一个字母，用.连接
const f = fp.flowRight( fp.join('.'), fp.map(fp.flowRight(fp.first, fp.toUpper)),fp.split(' '))

console.log(f('world wide web'))
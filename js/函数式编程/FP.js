const fp = require('lodash/fp')

console.log(fp.map(fp.toUpper)(['a']))

console.log(fp.map(parseInt, ['1','2']))
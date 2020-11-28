// 普通函子
class Container {

    static of (value) {
        return new Container(value)
    }

    constructor(value) {
        this.value = value
    }

    map(fn) {
        return Container.of(fn(this.value))
    }
}

// maybe 函子, 处理空值问题
class MayBe {
    static of (value) {
        return new MayBe(value)
    }

    constructor(value) {
        this.value = value
    }

    isNothing() {
        return this.value === null || this.value === undefined
    }

    map(fn) {
        return this.isNothing() ? new MayBe(null) : new MayBe(fn(this.value))
    }
}

// let r = MayBe.of('hello')
// let r2 = MayBe.of(null)
// let r3 = MayBe.of('hello')
//             .map(x => x.toUppperCase)
//             .map(x => x.name) // 虽然能处理空值，但是不知道是哪一步产生的空值
// console.log(r,r2,r3)

// either 函子
class Left {
    static of (value) {
        return new Left(value)
    }

    constructor(value) {
        this.value = value
    }

    map() {
        return this
    }
}

class Right {
    static of (value) {
        return new Right(value)
    }

    constructor(value) {
        this.value = value
    }

    map(fn) {
        return Right.of(fn(this.value))
    }
}

function parseJSON(str) {
    try {
        return Right.of(JSON.parse(str))
    } catch (e) {
        return Left.of({
            error: e.message
        })
    }
}

// let r = parseJSON('{name: aaa}')
// let r2 = parseJSON('{"name": "aaa"}')

// console.log(r,r2)

// IO 函子
const fp = require('lodash/fp')

class IO {
    static of (value) { // 接收一个数据，返回一个IO函子
        return new IO(function () {
            return value
        })
    }

    constructor(fn) {
        this.value = fn
    }

    map(fn) {
        return new IO(fp.flowRight(fn, this.value))
    }
}
// 即使map里或者of里传入了不纯的函数，但是这个f本身是纯的
// let f = IO.of(process).map(x => x.execPath) 
// 当调用的时候才会知道纯还是不纯，延迟执行不纯的操作
// console.log(f.value())

// folktale
// const { compose, curry} = require('folktale/core/lambda')
// const { toUpper, first} = require('lodash/fp')

// let f = curry(2, function(x,y) {
//     return x + y
// })
// console.log(f(1,2))
// console.log(f(1)(2))

// let f2 = compose(toUpper, first);
// console.log(f2(['xixi','sisi']))

//task 函子
const { task } = require('folktale/concurrency/task')
const fs = require('fs')
function readFile(filename) {
    return task(resolver => {
        fs.readFile(filename, 'utf-8', function(err, data) {
            if(err) resolver.reject(err)

            resolver.resolve(data)
        })
    })
}

readFile('package.json')
    .map(fp.split('\n'))
    .map(fp.find(x => x.includes('version')))
    .run()
    .listen({
        onRejectd(err) {
            console.log(err)
        },
        onResolved(value) {
            console.log(value)
        }
    })
const obj = {
    name: 'wsq',
    age: 18
}

const proxy = new Proxy(obj, {
    get(target, property) {
        return target[property] ? target[property] : 'none'
    },
    set(target, property, value) {
        target[property] = value
    }
})

const arr = []

const arrProxy = new Proxy(arr, {
    set(target, property, value) {
        target[property] = value
        return true // 写入成功
    }
})


console.log('name' in obj)
console.log(Reflect.has(obj, 'name'))
console.log(Object.keys(obj))
console.log(Reflect.ownKeys(obj))
// arrProxy.push(1)
// console.log(arr)
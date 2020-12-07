const obj = {
    store: ['foo', 'bar', 'baz'],
    [Symbol.iterator]: function () {
        const self = this
        let index = 0
        return {
            next: function () {
                let result = {
                    value: self.store[index],
                    done: index >= self.store.length
                }
                index++;
                return result
            }
        }
    }
}

function * foo() {
    yield 1
    yield 2
}

const result = foo()
console.log(result.next())
console.log(result.next())
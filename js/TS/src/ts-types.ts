const a: string = 'foo'
const b: number = 100
const c: boolean = false
// const d: boolean = null // 报错
const e: void = undefined
const f: null = null
const g: undefined = undefined
const h: symbol = Symbol('foo')

const foo: object = function() {} // [] // {}

const obj: { foo: number, bar: string} = {foo: 123, bar: 'bar'}

const arr: number[] = [1,2,3] // 数组的两种类型声明方式
const arr2: Array<number> = [1,2,3]

// 元组类型,定长定类型
const tuple: [number, string] = [123, 'string']
const [age, name] = tuple

// 枚举类型，会侵入到编译的代码，成为一个双向的键值对对象
// 一个枚举只会有几种固定的数值
enum status {
    foo = 1,
    bar = 2,
    baz // 未手动赋值的枚举项会接着上一个枚举项递增，也就是3
}
enum status2 {
    foo1 // 0
}
const post = {
    test: status.foo,
    test2: status2.foo1
}

function func (a: string, b?: number, ...rest: any): string {
    return ''
}
func('123', 1)
func('123')
func('123', 1, [1,2,3])
const func2: (a: number) => number = function (a:number): number {
    return 1;
}
export {}

const nums = [11,22,3,33]

const res = nums.find(i => i > 0)

// const square = res * res // 提示res可能是undefined

const num1 = res as number

const num2 = <number>res // jsx下不能使用



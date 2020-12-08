# 背景

## 强类型与弱类型（类型安全）

区别：**强类型不允许进行任何隐式的类型转换，弱类型允许隐式转换**，变量可以随时转变类型，不是强类型弱类型的主要区别

强类型的好处：

- 错误更早暴露
- 代码更加智能，编码更准确
- 重构更牢靠
- 减少不必要的类型判断

弱类型的问题：

- 等到运行阶段，才能发现类型的异常
- 类型不明确，可能造成函数功能的改变
- 对象索引器容易错误使用

## 静态类型与动态类型（类型检查）

区别：静态类型语言在声明阶段确定了变量的类型， 且以后不能更改，而动态类型语言在代码执行阶段才确定变量类型，且随时可以更改变量类型

## JS的语言类型

js是弱类型动态语言

# Flow

是一种Facebook推出的JavaScript类型检查器

# TypeScript

TypeScript是JavaScript的超集，为了解决JS类型系统不足的问题，包括了类型系统，ES6+等扩展功能

## 使用

```
npm i typescript -D
npx tsc --init // 创建tsconfig.json
```

## 标准库声明

在tsconfig.json文件中的lib字段里，可以动态增减ts的标准库（内置对象所对应的声明）

## 类型

object类型 **指除了原始类型以外的其他类型，而不是单独指object类型**

```typescript
const a: string = 'foo'
const b: number = 100
const c: boolean = false
// const d: boolean = null // 报错
const e: void = undefined
const f: null = null
const g: undefined = undefined
const h: symbol = Symbol('foo')

const foo: object = function() {} // [] // {} 对象的类型声明

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
    baz = 3 // 未手动赋值的枚举项会接着上一个枚举项递增，也就是3
}
enum status2 {
    foo1 // 0
}
const post = {
    test: status.foo,
    test2: status2.foo1
}
```

函数类型

```typescript
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
```

隐式类型推断

```typescript
let age = 18
age = 'string' // 报错

let foo // 如果无法推断类型，则会声明为any类型
foo = 100
foo = 'foo'
```


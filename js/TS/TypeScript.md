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
// 问号表示可选参数，rest参数放在最末尾
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

类型断言：当ts自身语法无法确定一个变量的类型，可以添加类型断言，确保某个变量的类型一定为断言的类型

```typescript
const res = nums.find(i => i > 0)

// const square = res * res // 提示res可能是undefined

const num1 = res as number

const num2 = <number>res // jsx下不能使用
```

断言是在编译过程中发生的行为，编译过后断言不复存在，与类型转换是不同的概念

## 接口

一种规范、契约，可以用来规定对象的结构

当一个变量使用了某个接口，则必须严格按照接口的规定进行赋值，属性不能多也不能少

**如果定义了任意属性，那么其他属性必须是任意属性的子集**

```typescript
interface Post {
    readonly id: string,
    title: string
    content: string,
    source?: string // 可选属性
    [propName: string]: string | undefined // 任意属性
}

const post: Post = {
    id: 'id',
    title: 'title',
    content: 'content',
    source: 'source',
    fade: 'fade', // 任意属性
    fale: 'fale', // 任意属性不限数量，但类型必须为定义的类型
}
```

如果希望对象中的一些字段只能在创建时被赋值，可以用readonly定义只读属性。只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候

## 类

描述一类具体事物的抽象特征，ts增强了class的相关语法

ts定义类的属性时需要指定类型，可以添加访问修饰符指定属性的访问权限，可以添加readonly将属性设置为只读

```typescript
class Person {
    name: string // 默认访问符为public
    age: number
    private school: string // private 只有在当前类中可以使用
    protected readonly id: number // protected 在当前类和子类中可以使用

    constructor (name:string, age: number, school: string, id: number) {
        this.name = name
        this.age = age
        this.school = school
        this.id = id
    }
}

class Student extends Person {
    constructor (name:string, age: number, school: string, id: number) {
        super(name, age, school, id)
    }
}
```

抽象类不能被实例化，如果抽象类中有抽象方法，则该方法必须被子类实现

```typescript
abstract class Animal {
    abstract sayHi(): void
}

class Dog extends Animal {
    sayHi() {
        console.log('dog')
    }
}
```

类可以用来实现接口

```typescript
interface Behavior {
    eat (food: string): void
}

class Cat implements Behavior {
    eat(food: string): void {
        console.log(food)
    }
}
```

## 泛型

在定义函数、接口或者类的时候，不预先指定具体的类型，而在使用的时候再指定类型

首先定义一个创建一个返回定长，定值数组的函数

```typescript
function createNumberArray(len: number, value: number): number[] {
    let arr = Array<number>(len).fill(value)
    return arr
}
```

这个函数有一个缺点，就是只能创建number类型的数组，如果想要创建一个动态类型的数组，需要用到泛型

```typescript
function createArray<T>(len: number, value: T) {
    let arr = Array<T>(len).fill(value);
    return arr;
}

const res = createArray<string>(2, 'pb') // string[]
```

泛型可以一次性定义多个类型参数；在使用泛型变量的时候，由于事先不知道是那种类型，所以不能随意操作它的属性或方法

泛型类和泛型接口：泛型可以用到类的定义和接口的定义

泛型类

```typescript
class GenericNumber<T> {
    zero!: T; // 添加断言
    add!: (x: T, y: T) => T;
}

let generic = new GenericNumber<number>()
generic.zero = 0
generic.add = function(x, y) { return x + y }
```

泛型接口：用泛型的形式来定义一个函数的形状

```typescript
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let ca: CreateArrayFunc<any>;
ca = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

ca(3, 'x'); // ['x', 'x', 'x']
```

## 声明三方文件

当第三方库不包含类型声明文件时，需要使用declare 进行类型声明

- [`declare var`](https://ts.xcatliu.com/basics/declaration-files.html#declare-var) 声明全局变量
- [`declare function`](https://ts.xcatliu.com/basics/declaration-files.html#declare-function) 声明全局方法
- [`declare class`](https://ts.xcatliu.com/basics/declaration-files.html#declare-class) 声明全局类
- [`declare enum`](https://ts.xcatliu.com/basics/declaration-files.html#declare-enum) 声明全局枚举类型
- [`declare namespace`](https://ts.xcatliu.com/basics/declaration-files.html#declare-namespace) 声明（含有子属性的）全局对象
- [`interface` 和 `type`](https://ts.xcatliu.com/basics/declaration-files.html#interface-和-type) 声明全局类型
- [`export`](https://ts.xcatliu.com/basics/declaration-files.html#export) 导出变量
- [`export namespace`](https://ts.xcatliu.com/basics/declaration-files.html#export-namespace) 导出（含有子属性的）对象
- [`export default`](https://ts.xcatliu.com/basics/declaration-files.html#export-default) ES6 默认导出
- [`export =`](https://ts.xcatliu.com/basics/declaration-files.html#export-1) commonjs 导出模块
- [`export as namespace`](https://ts.xcatliu.com/basics/declaration-files.html#export-as-namespace) UMD 库声明全局变量
- [`declare global`](https://ts.xcatliu.com/basics/declaration-files.html#declare-global) 扩展全局变量
- [`declare module`](https://ts.xcatliu.com/basics/declaration-files.html#declare-module) 扩展模块

或者安装指定的类型库进行补充声明


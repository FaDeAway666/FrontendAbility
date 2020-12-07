# 背景

**Javascript实际上是ECMAScript的扩展语言**

ECMAScript只提供了基本语法，JS实现了ES的标准，并实现了一些扩展，可以在浏览器环境和node环境使用

浏览器环境：ES + DOM + BOM

node环境：ES + Node API

# ES2015

## let、const、块级作用域

作用域类型：

- 全局作用域
- 函数作用域
- 块级作用域 （ES2015）

块，指两个大括号括起来的区域

let的作用：

- 定义的变量只能在所在的块中被使用
- 不能在声明变量之前使用这个变量

const在let基础上多出了“只读”属性，在声明的时候就必须设置初始值，且声明过后不能再分配新的内存地址

```js
const obj = {
    name: 'pb'
}
obj.name = 'wss'
console.log(obj) //wss
```

**最佳实践：不用var，主用const，配合let**

## 解构赋值

数组解构

```js
const arr = [1,2,3]

const [foo, bar, baz] = arr
console.log(foo,bar,baz) // 1 2 3
const [...rest] = arr
console.log(rest) // [1,2,3]
const [foo2] = arr
console.log(foo2) // 1
const [,,baz2] = arr
console.log(baz2) // 3
const [,bar2 = 123, baz3, modules = 'default'] = arr
console.log(bar2,modules) // 2 default
```

对象解构

```js
const obj = {
    name: 'wsq',
    age: 19
}

const { name } = obj
console.log(name) // wsq
const { name: sname } = obj
console.log(sname) // wsq
const { cp: sname2 = 'xixi' } = obj
console.log(sname2) // xixi
```

## 模板字符串

使用``包裹的字符串

```js
const name = 'wpb'
const str = `hello, my name is ${name}`
console.log(str)
```

模板字符串可以带标签

```js
const name = 'wpb'

function tagFunc(string) {
    console.log(string)
}
const str = tagFunc`hello, my name is ${name}`
// [ 'hello, my name is ', '' ]

function tagFunc2(string, name) {
    return string[0] + name
}
const str2 = tagFunc2`hello, my name is ${name}`
console.log(str2) //hello, my name is wpb
```

## 字符串扩展方法

- startsWith：开头是否是某个字符串
- endsWith：结尾是否是某个字符串
- includes：中间是否包含某个字符串

## 参数默认值

ES2015可以为函数参数设置默认值，当函数调用时没有传递该参数，将会默认使用设置的值

```js
function foo(name = 'wsq') {
    console.log('my name is ', name)
}
foo() //my name is wsq
```

## ...操作符

又称剩余操作符，可以取代通过arguments接收无限参数的过程

```js
function foo(a, ...args) {
    console.log(args) // [2,3,4]
}
foo(1,2,3,4)
```

tips：只能出现在函数参数的最后一位，且只能出现一次

剩余操作符还可以用来展开数组，而在ES2015之前，通常使用apply

```js
const arr = ['foo', 'bar', 'abs']
console.log.apply(this, arr)
console.log(...arr)
```

## 箭头函数

简化了函数的定义，以及回调函数的写法

```js
const arr = [1,2,3,4]
const res = arr.filter( i => i % 2)
console.log(res) // [1,3]
```

箭头函数与普通函数的区别，就是不会改变this指向，而是继承父作用域的this

```js
const obj = {
    name: 'wsq',
    getName: function() {
        console.log(this.name)
    },
    getName2: () => {
        console.log(this.name)
    }
}

obj.getName() // wsq
obj.getName2() // undefined
```

## 对象字面量增强

ES2015提供了对象的字面量增强

```js
const name = 'wsq'
const obj = {
    name,
    getName () {
        console.log(this.name)
    }, // 等价于 getName: function() {}
    [Math.random()]: 'random' // 计算属性名，在方括号内可以使用表达式或变量
}
console.log(obj)
obj.getName()
```

## Object的几个扩展方法

assign：将多个源对象中的属性复制到一个目标对象中，如果源对象和目标对象有相同的属性，源对象的属性值会覆盖掉目标对象的属性值

```js
const target = {
    a:'123',
    b: '456'
}
const source = {
    b: '234',
    c: '345'
}
const result = Object.assign(target, source)
console.log(result === target) // true
console.log(result) //{ a: '123', b: '234', c: '345' }
```

通常使用Object.assign({}, source)，来复制一个和source完全相同的对象，修改这个复制后的对象的属性，不会影响到source的属性

注意，这种拷贝在source只有一级属性时是深拷贝，若source具有二级属性，则是浅拷贝

is：比较两个变量是否严格相等

## Proxy

为对象设置访问代理器

ES2015之前，使用Object.defineProperty设置对象代理

语法：

```js
const p = new Proxy(target, handler)
```

target：使用proxy包装的目标对象

handler：一个通常以函数作为属性的**对象**，各属性中的函数分别定义了target在执行各种操作时，proxy的行为

Proxy基础使用方法如下

```js
const obj = {
    name: 'wsq',
    age: 18
}

const proxy = new Proxy(obj, {
    get(target, property) {
        return target[property] ? target[property] : 'none'
    },
    set(target, property, value) {
        console.log(target, property, value) // { name: 'wsq', age: 18 } age 10
        target[property] = value
    }
})

proxy.age = 10
console.log(proxy.age) // 10
console.log(proxy.xx) // none
```

Proxy对比defineProperty的优势在于

- defineProperty只能监视对象的读写，而Proxy可以监听更多对象的操作

  [`handler.getPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getPrototypeOf)

  [`Object.getPrototypeOf`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) 方法的捕捉器。

  [`handler.setPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/setPrototypeOf)

  [`Object.setPrototypeOf`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) 方法的捕捉器。

  [`handler.isExtensible()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/isExtensible)

  [`Object.isExtensible`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible) 方法的捕捉器。

  [`handler.preventExtensions()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/preventExtensions)

  [`Object.preventExtensions`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions) 方法的捕捉器。

  [`handler.getOwnPropertyDescriptor()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor)

  [`Object.getOwnPropertyDescriptor`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) 方法的捕捉器。

  [`handler.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/defineProperty)

  [`Object.defineProperty`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 方法的捕捉器。

  [`handler.has()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/has)

  [`in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in) 操作符的捕捉器。

  [`handler.get()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get)

  属性读取操作的捕捉器。

  [`handler.set()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set)

  属性设置操作的捕捉器。

  [`handler.deleteProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/deleteProperty)

  [`delete`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete) 操作符的捕捉器。

  [`handler.ownKeys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/ownKeys)

  [`Object.getOwnPropertyNames`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames) 方法和 [`Object.getOwnPropertySymbols`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols) 方法的捕捉器。

  [`handler.apply()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/apply)

  函数调用操作的捕捉器。

  [`handler.construct()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/construct)

  [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 操作符的捕捉器。

- Proxy 对数组对象的监听更加支持

  之前通过重写数组的方法来达到对数组的监视

  而Proxy，则可以用监视对象相同的办法来监视数组

  ```js
  const arr = []
  
  const arrProxy = new Proxy(arr, {
      set(target, property, value) {
          console.log(target, property, value)
          target[property] = value
          return true // 写入成功
      }
  })
  
  arrProxy.push(1)
  ```

- Proxy以非侵入的方式监管对象的读写

## Reflect

Reflect是一个静态类，不能创建实例对象，封装了一系列对对象的底层操作

这些操作与Proxy的handler函数属性是一致的，是Proxy处理对象的**默认实现**

Reflect提供了一套统一的操作对象的API

```js
console.log('name' in obj)
console.log(Reflect.has(obj, 'name'))
console.log(Object.keys(obj))
console.log(Reflect.ownKeys(obj))
```

Reflect提供的API，相对于ES2015之前的实现相同功能的不同API或操作符，更为规范化

## class

用于声明类型

在没有class之前，是使用构造函数，并在原型上加方法实现类

```js
class Person {
    constructor(name) {
        this.name = name
    }

    static create(name) { // static关键字添加静态方法
        return new Person(name)
    }

    say() {
        console.log(`i am ${this.name}`)
    }
}
// 类的继承
class Student extends Person {
    constructor(name, number) {
        super(name) // super关键字调用父类的构造函数
        this.number = number
    }

    study() {
        super.say()
        console.log('i am studying')
    }
}

const p = Person.create('pb')
p.say()
const s = new Student('wsq', 1010)
s.study()
```

如果子类中定义了构造函数，必须先调用`super()`才能使用this，super关键字还可以调用父类的原型函数

类不能继承常规对象（不可构造的），可以改用`Object.setPrototypeOf()`

```js
var Animal = {
  speak() {
    console.log(this.name + ' makes a noise.');
  }
};

class Dog {
  constructor(name) {
    this.name = name;
  }
}

Object.setPrototypeOf(Dog.prototype, Animal);// 如果不这样做，在调用speak时会返回TypeError

var d = new Dog('Mitzie');
d.speak(); // Mitzie makes a noise.
```

## Set和Map

Set是ES2015的一种新的数据结构，可以理解为集合，Set内部成员**不允许重复**，允许遍历

使用方法为：

```js
const s = new Set()
s.add(1).add(2).add(3)
console.log(s)

console.log(s.size)
console.log(s.has(2))
console.log(s.delete(1))
console.log(s.clear(), s)
```

应用：数组去重

```js
const arr = [1,1,2,2,3]

// const result = Array.from(new Set(arr))
const result = [...new Set(arr)]
console.log(result)
```

Map是键值对类型的一种对象，与Object相比，可以使用任意类型作为键，而Object只能使用字符串作为键

```js
const map = new Map()

const tom = {
    name: 'tom'
}
map.set(tom, 100) // 使用object类型作为键
console.log(map)

map.has(tom)
map.get(tom)
map.delete(tom)

map.forEach((value, key) => {
    console.log(value, key)
})
```

## Symbol

ES2015之前，对象的属性都是字符串，而字符串是有可能重复的

Symbol是一种新增的基础类型，表示独一无二的值，使用Symbol作为属性名，可以避免重复，这也是Symbol目前最主要的作用

```js
console.log(Symbol() === Symbol()) // false
console.log(Symbol(1),Symbol('foo')) // Symbol(1) Symbol(foo)
```

也可以用Symbol来模拟对象的私有属性

```js
/*---------------a.js---------------*/
const name = Symbol()
const Person {
	[name]: 'pb',
	say() {
		console.log(this[name])
	}
}

/*-----------b.js-------------------*/
console.log(Person.name) // undefined,不能调用之前的symbol了
console.log(Person.say())

```

使用Symbol.for()和Symbol.keyFor()方法，可以从全局的symbol注册表设置和取得symbol

```js
const s1 = Symbol.for('foo')
console.log(s1 === Symbol.for('foo')) // true
console.log(Symbol.keyFor(s1)) // foo
```

如果一个对象中使用了Symbol作为属性，通过一般的遍历方法，例如Object.keys()/JSON.stringify()，这个属性是会被忽略的，需要使用Object.getOwnPropertySymbols()方法，可获得该对象使用了Symbol类型的属性的数组

```js
const Person = {
    [Symbol('bar')]: 'bar',
    name: 'foo'
}

console.log(Object.getOwnPropertySymbols(Person)) // [Symbol(foo)]
```

## 迭代

### for...of循环

相比forEach，可以用break 终止遍历，也可以用来遍历伪数组（arguments）

可以遍历Set和Map

### Iterable接口

实现Iterable接口是for...of的前提

可以发现，Array，Set，Map等都实现了iterable接口

```js
const set = new Set(['foo','bar','baz'])

const iterator = set[Symbol.iterator]()

console.log(iterator.next()) // { value: 'foo', done: false }
console.log(iterator.next()) // { value: 'bar', done: false }
console.log(iterator.next()) // { value: 'baz', done: false }
console.log(iterator.next()) // { value: undefined, done: true }
```

可用代码实现一个迭代器接口

```js
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

for(let item of obj) {
    console.log(item)
}
```

实现迭代器的意义在于，**对外提供统一遍历接口，让外部不需要关心数据结构**

## 生成器

为了解决异步编程回调函数嵌套的问题，提供更好的异步编程解决方案

语法

```js
function * foo() {
    yield 1
    yield 2
}

const result = foo()
console.log(result.next())
console.log(result.next())
```

# ES2016

是一个小版本

## Array.prototype.includes

判断数组当中是否存在制定的元素

## 指数运算符

```
console.log(Math.pow(2,10))

console.log(2 ** 10)
```

# ES2017

也是一个小版本

## Object扩展

Object.values()

Object.enties()

Object.getOwnPropertyDescriptors()

## String扩展

String.prototype.padStart

String.prototype.padEnd

## async和await




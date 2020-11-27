# BOM



# DOM



# CSSOM



# 事件

## addEventListener

添加事件监听器

可以在所有的节点上使用addEventListener

```js
target.addEventListener(type, listener, [, options])
```

接收三个参数

1. 事件的类型
2. 监听到事件时执行的内容
3. 配置项，有以下两种形式
   1. 一个Boolean值，表示选用哪种事件模式。true表示捕获模式，false或不传为冒泡模式
   2. 一个options对象，包括以下几种属性
      1. capture：表明事件模式，捕获还是冒泡
      2. once：表示该事件是不是只响应一次
      3. passive：表示该事件是否为一个不会产生副作用的事件，承诺此事件监听不会调用 preventDefault，这有助于性能。

同类型同模式的事件，按照添加的顺序依次触发



# 其他


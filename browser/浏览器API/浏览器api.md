# BOM



# DOM

主要分为Node API、Event API和Range API

## Node API

- Element：元素类API
- Document：文档根节点API
- CharacterData：字符及注释型API
- DocumentFragment：文档片段
- DocumentType：文档类型

按API类型划分：

- 导航类：
  - parentNode/parentElement
  - childNodes/children
  - firstChild/firstElementChild
  - lastChild/laseElementChild
  - nextSibling/nextElementSibling
  - previousSibling/previousElementSibling
- 修改操作
  - appendChild
  - insertBefore
  - removeChild
  - replaceChild
- 高级操作
  - compareDocumentPosition：用于比较两个节点中的关系
  - contains：检查一个节点是否包含另一个节点
  - isEqualNode：检查两个节点是否完全相同
  - cloneNode：复制一个节点，如果传入true，会复制所有的子元素，做深拷贝

## Range API

比Node API更强大，更细致，可以批量操作Element，或者操作更小颗粒的Element

表示一个包含节点与文本节点的一部分的文档片段

创建range的方法

```js
var range = new Range()
range.setStart(element, 9)
range.setEnd(element, 4) // 手动指定起始点

var range = document.getSelection().getRangeAt(0) //通过selection来创建range
```

Range 的几个重要API

- range.setStartBefore
- range.setEndBefore
- range.setStartAfter
- range.setEndAfter
- range.selectNode
- range.selectNodeContents

前四个是设置开始或结束在某个节点之前或之后，后两个是设置一个节点为range范围，和设置整个节点的内容为range范围

- range.extractContents 

  将range中的内容从文档树中移动到DocumentFragment中，这个提取不会保留添加的事件监听器

- range.insertNode

  在range起始位置插入节点

### DocumentFragment

文档片段对象，作为一个轻量级的document使用，其优势在于DocumentFragment不是DOM的一部分，其变化不会引起重排，且不会导致性能问题

例子：反转一个list

```js
const list = document.getElementById('list')
const range = new Range()
range.selectNodeContents(list)

let fragment = range.extractContents()
let l = fragment.childNodes.length
while(l-- > 0) {
    fragment.appendChild(fragment.childNodes[l]) // 因为 fragment也是一个living collection，所以可以直接往后添加前面的元素，会把元素直接后置
}

list.appendChild(fragment)

```





# CSSOM



# 事件

## 冒泡与捕获

浏览器处理事件的一个过程，不管是否监听事件，这个过程都存在

捕获是由外向内，冒泡是由内向外

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

```js
var red = document.getElementById('red');
  var blue = document.getElementById('blue');
  var scr = document.getElementById('scroll');

  red.addEventListener('click', function() {
    console.log('父元素被点击')
  }, {
    capture: true, // 设置捕获
    once: true // 只监听一次
  })

  blue.addEventListener('click', function() {
    console.log('子元素被点击');
  })

  red.addEventListener('click', function() {
    console.log('父元素被点击2')
  })
// 后加的监听会添加到后面
  blue.addEventListener('click', function() {
    console.log('子元素被点击2')
  })

```



# 其他


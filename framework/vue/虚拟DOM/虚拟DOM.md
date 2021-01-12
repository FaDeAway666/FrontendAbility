# 虚拟DOM概念

Virtual DOM(虚拟DOM)，是由普通的JS对象来描述DOM对象

使用虚拟DOM的原因：

随着前端应用复杂程度逐渐提升，前端人员需要同时操作DOM和数据，且DOM操作的复杂程度也逐渐提升，带来了极大的不便利。

解决方案：

1. jQuery，简化了DOM操作，解决了浏览器兼容性问题，但仍旧需要兼顾数据和DOM操作
2. 模板引擎，使用模板数据，简化了视图操作，但是没办法跟踪状态
3. MVVM框架，解决了视图和状态的同步问题
4. 虚拟DOM跟踪状态变化

为什么用虚拟DOM：

- 虚拟DOM可以维护程序的状态，跟踪上一次的状态
- 通过比较前后两次状态差异来更新真实DOM，不会整个DOM进行重载

虚拟DOM的作用

- 维护视图和状态的关系
- 复杂视图情况下提升渲染性能
- 跨平台
  - 浏览器DOM
  - 服务端渲染SSR(将虚拟DOM转换成HTML字符串)
  - 原生应用(RN/Weex)
  - 小程序(uni-app/mpvue)

# Snabbdom

最快的虚拟DOM之一，Vue 2.x使用的虚拟DOM就是改造的Snabbdom

基础使用如下：

```js
import { init } from 'snabbdom/init'
import { h } from 'snabbdom/h'

const patch = init([])

const container = document.querySelector('#app')

// 第一个参数：标签+选择器
// 第二个参数: 如果是字符串就是标签内的文本，也可以是一个新的h函数，里面的结构和node整体类似
// 也可以是一个数组，包含所有内容
const vnode = h('div#container', 'hello snabbdom')
// 第一个参数：旧的VNode，可以是DOM元素
// 第二个参数：新的VNode
let oldNode = patch(container, vnode)

const vnode2 = h('div.new', ['hahaha', h('div.child', 'i am child')])

patch(oldNode, vnode2)

patch(oldNode, h('!')) // 清除内容，添加一个空的注释节点
```

snabbdom可通过模块进行扩展

- Snabbdom的核心库不能处理DOM元素的属性、样式、事件等，可以通过注册Snabbdom默认提供的模块来实现
- Snabbdom中的模块可以用来扩展Snabbdom的功能
- Snabbdom中的模块实现是通过注册全局的钩子函数来实现的

```js
import { init } from 'snabbdom/init'
import { h } from 'snabbdom/h'
import { styleModule } from 'snabbdom/modules/style'
import { eventListenersModule } from 'snabbdom/modules/eventlisteners'

const patch = init([
    styleModule,
    eventListenersModule
])

const handleClick = () => {
    console.log('hahaha')
}

const vnode = h('div.wrap', [
    h('div#container', { style: { background: 'blue', color: '#fff' }}, 'I am style modules'),
    h('p#testClick', { on: { click: handleClick } }, 'click me')
])


patch(document.querySelector('#app'), vnode)
```

# Snabbdom源码解析

## h函数

作用：创建VNode对象

在ts中通过函数重载的方式去匹配不同的参数输入

![image-20210108145042802](.\images\image-20210108145042802.png)

VNode对象用来描述真实DOM

![image-20210108145814748](.\images\image-20210108145814748.png)

- children和text属性互斥，有children说明VNode有子节点，有text说明VNode是一个文本节点

- key属性是VNode节点的唯一标识

- elm是VNode代表的element节点

- sel是VNode的类名或id名

- data属性是VNode对象的配置信息，例如一些初始化钩子

  ```js
  const vnode = h('div.main', {
      hook: {
          init (vnode) { // init 钩子
              console.log(vnode.elm) // 这个时候DOM对象还未创建
          },
          create (emptyNode, vnode) {
              console.log(vnode.elm)
          }
      }
  })
  ```

  

## init函数

返回了一个patch函数

init函数的作用是在构造patch函数之前，先行处理cbs:ModuleHooks(钩子函数)和api:domApi(api集合，默认是htmlDomApi)两个参数

## patch函数

`patch(oldVNode, newVNode)`，oldVNode可以是VNode对象也可以是真实DOM

作用：对比两个VNode，把两个VNode的差异更新到真实DOM，并返回新的VNode，作为下次处理的oldVnode



过程分析：

- 将新节点中变化的内容渲染到真实DOM，最后返回新节点作为下一次处理的旧节点
- 对比新旧VNode是否为相同节点（节点的key和sel相同，也就是Diff算法）
- 如果不是相同节点，删除之前的内容，重新渲染
- 如果是相同节点，再判断新的VNode是否有text，如果有并且和oldVNode的text不同，直接更新文本内容
- 如果新的VNode有children，判断子节点是否有变化

patch函数执行过程：

1. 执行cbs的pre中存储的函数，等于是预处理
2. 判断oldVNode是否是VNode对象
3. 判断新旧VNode是否是相同节点（通过key和sel），如果是，调用patchVNode函数进行对比，如果不是，调用createElm函数创建新VNode的DOM节点，将DOM节点插入到DOM树上，并将oldVNode从DOM树上移除（removeVnodes）
4. 执行用户传入的insert函数，这个insert函数是在新插入了一个DOM元素后，用户想要进行的操作
5. 执行cbs.post中存储的函数

patch函数内部调用了一些比较重要的函数

### createElm

作用：将VNode节点转化成对应的DOM元素，将DOM元素存储在对象的elm属性中，并没有将其挂载到DOM树上

有三个过程：

1. 执行用户设置的init函数
2. 将VNode转换成真实的DOM对象
   1. 如果选择器是 `!`，创建注释节点
   2. 如果选择器为空，创建文本节点
   3. 如果选择器不为空，先解析出标签名，再创建出DOM元素，存储到DOM.elm中；如果children是数组，
3. 返回新创建的DOM

### removeVnodes和addVnodes

`removeVnodes(parentElm: Node, vnodes: VNode[], startIdex: number, endIdex: number)`

### patchVnode

作用：对比新旧节点的差异并进行处理

过程：

1. 触发prepatch和update钩子函数
2. 对比新旧节点
3. 触发postpatch钩子函数

![image-20210111094706362](.\images\image-20210111094706362.png)

### updateChildren

updateChildren是patchVnode函数的核心，也是Diff算法的核心

Diff算法：查找两棵树每个节点的差异

重新渲染两颗树的开销很大，DOM操作会进行重排和重绘，当数据变化后，不再直接更新所有节点，而是先对比新旧节点的差异

snabbdom根据DOM的特点对传统的Diff算法进行了优化，依照下面两个DOM的特点：

- DOM操作时候很少会跨级别操作节点
- 只比较同级别的节点（只需遍历n次，且比较的当时就可以对节点进行操作）

节点的比较情况：

- 旧开始节点与新开始节点
- 旧开始节点与新结束节点
- 旧结束节点与新开始节点
- 旧结束节点与新结束节点

具体情况：

1. 新旧开始节点相同（key和sel相同）
   1. 调用patchVnode对比和更新节点
   2. 将旧开始和新开始索引往后移动1位
2. 新旧开始节点不相同，会从后往前比较，调用patchVnode对比和更新节点，将旧结束和新结束索引往前移动1位
3. 旧开始节点和新结束节点使用patchVnode更新差异，将旧开始节点移动到旧结束节点的右侧，更新索引，下一次对比，则是旧开始节点++，新结束节点--
4. 旧结束节点和新开始节点使用patchVnode更新差异，将旧结束节点移动到旧开始节点的左侧，更新索引，下一次对比，则是旧结束节点--，新开始节点++
5. 如果非以上四种情况，则先遍历新开始节点
   1. 从旧节点数组中查找是否有和新开始节点相同的节点，如果没找到，则说明新开始的节点是完全新的，将其插入到旧节点数组之前
   2. 如果在旧节点数组中找到了与新开始节点相同的节点，key相同，但sel不相同，将这个节点通过patchVnode更新之后，插入到旧节点数组之前
   3. 如果key和sel都相同，说明新节点和旧节点相同，则将其复制给elmToMove对象，在这里更新差异过后，再将其插入到旧节点数组之前

遍历终止条件：

- 旧节点先遍历完，则将剩余的新节点批量插入到旧节点数组右边
- 新节点先遍历完，则将剩余的老节点批量删除

给节点设置key的意义：

在Diff 算法中比较两个节点是否相同，因为key属性默认为undefined，如果不设置key，会默认重用之前的元素，会造成一些不可预测的后果


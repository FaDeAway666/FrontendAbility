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

console.log('basicusage')
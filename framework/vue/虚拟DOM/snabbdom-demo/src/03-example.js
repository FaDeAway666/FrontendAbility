import { init } from 'snabbdom/init'
import { h } from 'snabbdom/h'
import { classModule } from 'snabbdom/modules/class'
import { styleModule } from 'snabbdom/modules/style'
import { eventListenersModule } from 'snabbdom/modules/eventlisteners'

const patch = init([classModule, styleModule, eventListenersModule])

let vnode

const clearfix = {
    cotent: '',
    clear: 'both'
}

let total = 0
let list = [
    { id: 1, content: 'aaa'},
    { id: 2, content: 'bbb'},
    { id: 3, content: 'ccc'},
    { id: 4, content: 'ddd'}
]

const render = () => {
    vnode = patch(vnode, view(list))
    // patch(document.querySelector('#app'), vnode)
}

const sort = () => {
    list.sort((a,b) => a.id - b.id)
    render()
}

const deleteItem = (id) => {
    const index = list.findIndex(item => item.id === id)
    list.splice(index, 1)
    render()
}

const viewList = data => {
    return h('div', { style: { width: '400px' } }, [
        h('span', { style: { marginRight: '30px'} }, data.id),
        h('span', data.content),
        h('span', { style: { float: 'right', cursor: 'pointer' }, on: { click: deleteItem.bind(this, data.id) } }, '删除')
    ])
}

const add = () => {
    total = total ? total + 1 : list.length + 1
    list.unshift({
        id: total,
        content: 'add'
    })
    render()
}

const view = (list) => {
    return h('div', [
        h('h1', { style: {
            marginBottom: '30px'
        } }, 'Top 10 list'),
        h('div', { 
                style: {
                    marginBottom: '30px',
                    width: '400px'
                },
                class: clearfix 
        }, [
            h('span', { style: { marginRight: '10px'} }, 'Sort by:'),
            h('a', { style: { marginRight: '10px', cursor: 'pointer'}, on: { click: sort } }, 'Rank'),
            h('a', { style: { float: 'right', cursor: 'pointer'}, on: { click: add } }, 'Add'),
        ]),
        h('div.list', list.map(viewList))
    ])
}

const container = document.getElementById('app')
vnode = patch(container, view(list))
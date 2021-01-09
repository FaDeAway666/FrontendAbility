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
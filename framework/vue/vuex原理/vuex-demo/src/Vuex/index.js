let _Vue = null

class Store {
    constructor (options) {
        // 解构options
        const {
            state = {},
            getters = {},
            mutations = {},
            actions = {}
        } = options
        this.state = _Vue.observable(state) // 将state设置为响应式
        this.getters = Object.create(null) // 初始化 getters
        // 将外部传入的getters方法挂载到store.getters的原型上
        Object.keys(getters).forEach(key => {
            Object.defineProperty(this.getters, key, {
                enumerable: true,
                configurable: true,
                get: () => getters[key](state)
            })
        })
        this._mutations = mutations
        this._actions = actions
    }
    // commit 方法实现
    commit (type, payload) {
        this._mutations[type](this.state, payload)
    }
    // dispatch 方法实现
    dispatch (type, payload) {
        this._actions[type](this, payload)
    }
}

// install 方法，传递一个Vue对象
function install (Vue) {
    _Vue = Vue
    _Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                _Vue.prototype.$store = this.$options.store
            }
        }
    })
}

export default {
    Store,
    install
}
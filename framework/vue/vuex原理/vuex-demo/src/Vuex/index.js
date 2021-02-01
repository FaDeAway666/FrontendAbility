let _Vue = null

class Store {
    constructor (options) {
        const {
            state = {},
            getters = {},
            mutations = {},
            actions = {}
        } = options
        this.state = _Vue.observable(state)
        this.getters = Object.create(null)
    }

    commit (type, payload) {}

    dispatch (type, payload) {}
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
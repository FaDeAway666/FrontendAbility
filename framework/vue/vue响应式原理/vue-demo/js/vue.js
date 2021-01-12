class Vue {
    constructor (options) {
        /**
         * Vue做了四件事情
         * 1. 初始化传入的配置项, $opitions/$data/$el
         * 2. 使用Object.defineProperty劫持$data中的数据，加上getter/setter
         * 3. 使用Observer，当data值发生变化时通知Dep
         * 4. 使用Compiler转化差值表达式和指令
         */
        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

        this._proxyData(this.$data)

        this._setMethods(this.$options.methods)

        new Observer(this.$data)

        new Compiler(this)
    }
    // 建立this与this.$data的映射
    _proxyData (data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true, // 可枚举不能漏
                configurable: true, // 可配置也不能漏
                get() {
                    return data[key]
                },
                set(newValue) {
                    if (data[key] === newValue) return
                    data[key] = newValue
                }
            })
        })
    }

    _setMethods (methods) {
        console.log(methods)
        if (!methods) return
        Object.keys(methods).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true, // 可枚举不能漏
                configurable: true, // 可配置也不能漏
                get() {
                    return methods[key]
                },
                set(newValue) {
                    if (methods[key] === newValue) return
                    methods[key] = newValue
                }
            })
        })
    }
}
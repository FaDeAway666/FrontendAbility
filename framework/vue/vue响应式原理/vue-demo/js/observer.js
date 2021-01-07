class Observer {
    // 这里的data参数，是vue中的$data
    constructor (data) {
        this.walk(data)
    }
    // 遍历data的所有属性，并将其设置成响应式
    walk (data) {
        /**
         * 1. 判断data是否为对象
         * 2. 如果data是对象，遍历data的属性并将其设置成响应式
         */
        if ( !data || typeof data !== 'object') return
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive (obj, key, val) {
        this.walk(val)
        let dep = new Dep()
        let self = this
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 收集依赖，触发get方法，将watcher添加到dep中
                Dep.target && dep.addSub(Dep.target)
                return val // 这里必须将属性值传递进来，不然会死递归，因为如果使用obj[key]，又回去调用data的get方法
            },
            set(newValue) {
                if (newValue === val) return
                val = newValue
                self.walk(newValue)
                dep.notify() // 通知所有Watcher更新
            } 
        })
    }
}
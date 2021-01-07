class Watcher {
    constructor (vm, key, cb) {
        this.vm = vm
        // data中的属性名
        this.key = key
        // 回调函数负责更新视图
        this.cb = cb

        // 将Watcher对象记录到Dep类的静态属性target
        Dep.target = this

        this.oldValue = vm[key]
        Dep.target = null
    }

    // 数据发生变化的时候更新视图
    update () {
        let newValue = this.vm[this.key]
        if (this.oldValue === newValue) return 
        this.cb(newValue)
    }
}
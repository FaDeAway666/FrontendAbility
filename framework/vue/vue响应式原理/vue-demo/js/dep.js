class Dep {
    // 构建subs数组存放Watcher
    constructor () {
        this.subs = []
    }
    // 添加watcher
    addSub (sub) {
        if (sub && sub.update) {
            this.subs.push(sub)
        }
    }

    notify () {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}
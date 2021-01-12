class Compiler {
    // 传入一个vue实例
    constructor (vm) {
        console.log(vm,'vm')
        this.vm = vm
        this.el = vm.$el

        this.compile(this.el)
    }

    // 遍历el，根据其子节点的类型进行递归编译
    compile (el) {
        Array.from(el.childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compileText(node)
            }
            else if (this.isElementNode(node)) {
                this.compileElement(node)
            }

            if(node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }

    // 编译文本节点，处理差值表达式
    compileText (node) {
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])

            // 创建Watcher对象，当数据改变更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }

    // 编译元素节点，处理指令
    compileElement (node) {
        const attributes = Array.from(node.attributes)
        if (attributes.length) {
            attributes.forEach(attr => {
                if (this.isDirective(attr.name)) {
                    this.update(node, attr.value, attr.name.slice(2))
                }
            })
        }
    }

    // 根据指令调用不同的指令处理函数
    update (node, key, attr) {
        if (attr.indexOf('on') > -1) {
            let event = attr.split(':')[1];
            console.log(event, 'event')
            this.onUpdater.call(this, node, event, key)
        } else {
            let fn = this[`${attr}Updater`]
            fn && fn.call(this, node, key, this.vm[key]) // 使用call是为了继承this
        }
    }

    // v-text 指令处理
    textUpdater (node, key, value) {
        node.textContent = value

        // 在处理指令的地方添加Watcher，设置回调函数
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }

    // v-model指令处理
    modelUpdater (node, key, value) {
        node.value = value

        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })

        // 双向绑定，注册一个input事件
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }

    // v-on指令
    onUpdater (node, event, handler) {
        new Watcher(this.vm, handler, (newHandler) => {
            this.vm[handler] = newHandler
        })

        node.addEventListener(event, () => {
            this.vm[handler]()
        })
    }

    // v-html指令
    htmlUpdater (node, key, value) {
        node.innerHTML = value

        new Watcher(this.vm, key, newValue => {
            this.vm[key] = newValue
        })
    }

    // 判断属性是否是指令
    isDirective (attrName) {
        return attrName.startsWith('v-') // 属性名是否以‘v-’开头
    }

    // 判断节点是否为文本节点
    isTextNode (node) {
        return node.nodeType === 3
    }

    // 判断节点是否为元素节点
    isElementNode (node) {
        return node.nodeType === 1
    }   
}
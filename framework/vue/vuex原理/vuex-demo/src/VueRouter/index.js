let _Vue = null // 用于记录Vue构造函数

class VueRouter {

    // install方法 需要传递一个Vue对象
    static install(Vue) {
        /**
         * 1. 判断当前插件是否已经被安装
         * 2. 把vue构造函数记录到全局变量
         * 3. 将传入的router对象注入到全部的vue实例
         */
        // 判断插件是否已安装

        if (VueRouter.install.installed)
            return
        VueRouter.install.installed = true

        //记录Vue构造函数
        _Vue = Vue
        // 将创建Vue实例时传入的router对象注入到Vue实例中
        _Vue.mixin({
            beforeCreate () {
                if(this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                    this.$options.router.init()
                }
            }
        })
    }

    constructor (options) {
        this.options = options
        this.routeMap = {}
        // 定义一个响应式的对象，存放当前路由
        this.data = _Vue.observable({
            current: '/'
        })
    }

    createRouteMap () {
        // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到routeMap中
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        })
    }

    init () {
        this.initComponents()
        this.createRouteMap()
        this.initEvent()
    }

    initComponents () {
        let self = this
        _Vue.component('router-link', {
            props: {
                to: String
            },
            render (h) {
                return h('a', {
                    attrs: {
                        href: this.to
                    },
                    on: {
                        click: this.clickHandler
                    }
                }, [this.$slots.default])
            },
            methods: {
                // 这里去除掉a标签的默认事件防止浏览器刷新，
                // 并更改current为目标路由
                clickHandler (e) {
                    history.pushState({}, '', this.to)
                    this.$router.data.current = this.to
                    e.preventDefault();
                }
            }
            // template: '<a :href="to"><slot></slot></a>'
        })
        _Vue.component('router-view', {
            render (h) {
                // 渲染路由对应的组件
                const component = self.routeMap[self.data.current]
                return h(component)
            }
        })
    }

    initEvent () {
        window.addEventListener('popstate', () => {
            this.data.current = window.location.pathname
        })
    }
}

export default VueRouter
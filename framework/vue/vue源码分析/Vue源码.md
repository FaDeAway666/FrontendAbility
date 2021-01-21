# 前置

## Vue的不同构建版本

- 完整版：同时包含**运行时**和**编译器**
- 编译器：用来将模板字符串编译成js**渲染函数**代码，体积大，效率低
- 运行时：用来创建Vue实例、渲染并处理虚拟DOM的代码，体积小、效率高，是去除编译器的版本
- UMD：是通用的模块版本，支持多种模块方法。Vue.js默认文件就是运行时+编译器的UMD版本
- CommonJS：配合老版本的打包工具
- ES Module：从2.6版本开始提供两个ESM的构建文件
  - ESM格式被设计为可以被静态分析，所以打包工具可以利用这一点来进行tree shaking

|                          | UMD                | Commonjs              |      | ES Module          |
| ------------------------ | ------------------ | --------------------- | ---- | ------------------ |
| Full                     | vue.js             | vue.common.js         |      | vue.esm.js         |
| Runtime-only             | vue.runtime.js     | vue.runtime.common.js |      | vue.runtime.esm.js |
| Full(production)         | vue.min.js         |                       |      |                    |
| Runtime-only(production) | vue.runtime.min.js |                       |      |                    |

## 入口

`src/platforms/web/entry-runtime-with-compiler.js`

阅读记录：

- el不能是body或者html标签
- 如果没有render，会将template转换成render函数
- 如果有render方法，直接调用mount函数挂载dom（如果template和render同时存在，执行render函数）

tips：通过浏览器调试工具的Call Stack可以查看函数的调用堆栈，查找函数的执行顺序

## init

四个导出Vue的模块

- `src/platforms/web/entry-runtime-with-compiler.js`
  - web平台相关的入口
  - 重写了平台相关的$mount()方法
  - 注册了Vue.compile()方法，传递一个HTML字符串返回render函数
- `src/platforms/web/runtime/index.js`
  - web平台相关
  - 注册和平台相关的全局指令：v-model、v-show
  - 注册和平台相关的全局组件：v-transition、v-transition-group
  - 将__patch__注册成全局方法
- `src/core/index.js`
  - 与平台无关
  - 设置了Vue 的方法：initGlobalAPI(Vue)，注册的都是Vue的静态成员和方法
    - 初始化Vue.options
    - 设置keep-alive
    - 注册Vue.use()
    - Vue.mixin()
    - Vue.extend()
    - Vue.directive()/Vue.component()/Vue.filter()
- `src/core/instance/index.js`
  - 与平台无关
  - 定义了构造函数，调用了this._init(options)方法
  - 给Vue中混入了常见的**实例成员**
    - 初始化vm对象，注册vm的`_init`方法，其中`_init`方法包括
      - 初始化生命周期相关变量$children/$parent/$root/$refs
      - vm事件监听初始化，父组件绑定当前组件上的事件
      - vm render初始化 $slots/$scopedSlots/_c/$createElement/$attrs/$listeners
      - 调用beforeCreate生命钩子
      - 将inject成员注入到vm上
      - 初始化vm的`_props`/methods/`_data`/computed/watch
      - 初始化provide
      - 调用created生命钩子
    - 注册vm的$data/$props/$delete/$watch
    - 初始化事件的相关方法：$on/$emit/$once/$off
    - 初始化生命周期相关的混入方法_update/$forceUpdate/$destroy
    - 混入render $nextTick/_render

Vue的首次渲染过程：

- Vue初始化，实例成员和静态成员
- 执行new Vue()
- 执行this._init()
- vm.$mount()
  - 来自于src\platforms\web\entry-runtime-with-compiler.js
  - 如果没有传递render，则将模板编译成render函数，如果没有template，则会将el作为template编译成render
  - compileToFunctions()生成render()渲染函数
  - options.render = render
- 如果不是编译器版本，执行src\platforms\web\runtime\index.js，以及mountComponent()
- mountComponent(this,el)
  - 位于src\core\instance\lifecycle.js
  - 判断是否有render选项，如果没有但是传入了模板，且当前是开发环境，会发送警告
  - 触发beforeMount
  - 定义updateComponent
    - 内部调用vm._render()渲染，渲染虚拟DOM
    - 内部调用vm._update()更新，将虚拟DOM转换成真实DOM，并挂载到el
  - 创建Watcher实例
    - 传入updateComponent
    - 调用get()方法
  - 触发mounted
  - return vm
- watcher.get()
  - 创建完watcher会调用一次get方法
  - 调用updateComponent()
  - 调用vm._render()创建VNode
    - 调用render.call(vm._renderProxy, vm.$createElement)
    - 这个render是实例化时options里面的render()，或者是编译template后生成的render()
    - 返回VNode
  - 调用vm._update(vnode...)渲染DOM
    - 调用`vm.__patch__`(vm.$el, vnode)挂载真实DOM
    - 记录vm.$el

## 数据响应式

问题：

- `vm.msg = { count: 0 }`，重新给属性赋值，是否是响应式的 （不是）
- vm.arr[0] = 4，给数组元素赋值，视图是否会更新 （不会）
- vm.arr.length = 0，修改数组的length，视图是否会更新 （不会）
- vm.arr.push(4)，视图是否会更新 （会）

vue中的响应式实现代码全部存放于src\core\observer中

### Observer

对于数组对象的observer，则是重写所有数组中操作数组元素的方法，当调用这些方法的时候，给watcher发送通知，并对数组中每一个对象创建一个observer实例

### Dep

依赖收集中心，也就是发布者

Dep.target 用来存放目前正在使用的watcher，全局唯一，一次也只能有一个watcher被使用

### Watcher

每一个组件都对应一个watcher

Watcher分为三类，Computed Watcher/用户Watcher(侦听器)/渲染 Watcher




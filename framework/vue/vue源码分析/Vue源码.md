# 核心代码

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

watcher类型的创建顺序也是：computed watcher --> user watcher --> render watcher

渲染Watcher的创建：src\core\instance\lifecycle.js中的mountComponent方法内部

### 总体过程

1. 从src\core\instance\init.js中的initState方法开始，调用initData方法，为data属性执行observe方法，将data属性编程响应式
2. observe方法执行过程
   1. 判断传入的值是否是对象，是否有`__ob__`属性，如果不是对象或者存在`__ob__`属性，直接返回
   2. 给这个值创建observer对象，将这个对象赋值给值的`__ob__`属性
   3. 进行数组的响应式处理
   4. 进行对象的响应式处理，调用walk方法（遍历对象的所有属性，调用defineReactive方法）
3. defineReactive方法执行过程
   1. 为每一个属性创建dep对象
   2. 如果当前属性值是对象，调用observe方法
   3. 定义getter（dep.depend()收集依赖/返回属性值）
   4. 定义setter（保存新值/如果新值是对象，调用observe/dep.notify()派发更新）
4. 依赖收集
   1. 在watcher对象的get的方法中调用pushTarget记录Dep.target属性
   2. 访问data中的成员时收集依赖也就是defineReactive的getter中进行依赖收集
   3. 将属性对应的watcher对象添加到dep的subs数组中
   4. 给childOb收集依赖，目的是子对象添加和删除成员时发送通知
5. Watcher
   1. dep.notify()在调用watcher对象的update方法更新视图
   2. queueWatcher()判断watcher是否被处理，如果没有的话添加到queue中，并调用flushSchedulerQueue()
   3. flushSchedulerQueue
      1. 触发beforeUpdate钩子
      2. 调用watcher.run()：run()-->get()-->getter()-->updateComponent
      3. 清空上一次的依赖
      4. 触发actived钩子
      5. 触发updated钩子

## 虚拟DOM

总体过程：

1. updateComponent中进行虚拟DOM的操作

2. 调用vm._render()

   1. 执行用户传入的render函数或template编译成的render函数
   2. 如果是用户传入的render，调用$createElement()
   3. 如果是template编译成的render，调用_c()
   4. 不管调用的哪种方法，最后都会调用_createElement()，返回VNode对象

3. vm._update()，接收VNode，返回真实DOM

   1. 首次执行，调用`__patch__()`传入vm.$el和vnode
   2. 如果是数据更新，`__patch__`传入的是之前的preVnode和当前的vnode

4. `vm.__patch__`

   1. 在runtime/index.js中挂载在Vue.prototype上
   2. 等于runtime/patch.js的patch函数
   3. 设置modules（节点属性、事件、样式）和nodeOps（节点操作）
   4. 调用createPatchFunction函数返回patch函数

5. patch()

   1. 挂载cbs节点的属性/事件/样式操作的钩子函数
   2. 判断第一个参数是否为真实DOM，如果是首次加载，第一个参数就是真实DOM，会将其转换成vnode，调用createElm函数将vnode转为真实DOM并挂载到DOM树上
   3. 如果是数据更新，两个参数都是vnode，**如果他们是sameVnode，执行patchVnode函数，也就是进行diff**
   4. 删除旧节点

6. createElm(vnode, insertedVnodeQueue)

   1. 将虚拟节点转换为真实DOM，并插入到DOM树
   2. 将虚拟节点的children转换为真实DOM，并插入到DOM树，并触发相应的钩子函数

7. patchVnode

   1. 对比新旧vnode以及其子节点的差异
   2. 如果新旧vnode都有子节点并且子节点不同，会调用updateChildren对比子节点的差异

8. updateChildren

   接收三个关键参数：parentElm/oldCh/newCh

   分别是：父节点，旧子节点队列，新子节点队列

   定义四个索引，旧开始/旧结束（旧子节点队列的头尾索引），新开始/新结束（新子节点队列的头尾索引）

   维持一个队列循环，条件是旧开始>=旧结束，新开始>=新结束

   1. 从头到尾依次查找相同的子节点使用patchVnode进行对比，总共有四种比较方式
      1. 新旧开始节点对比，如果是sameVnode，索引各+1
      2. 新旧结束节点对比，如果sameVnode，索引各-1
      3. 旧开始与新结束对比，如果sameVnode，旧开始移动到最后，旧索引+1，新索引-1
      4. 旧结束与新开始对比，如果sameVnode，旧结束移动到最前，旧索引-1，新索引+1
   2. 以上四种都不满足，则在旧节点的子节点中查找新开始节点
      1. 如果没找到，创建这个新开始节点并插入到旧节点队列最前面
      2. 如果找到了，执行patchVnode，参数是这个新节点和找到的旧节点，将这个旧节点移动到旧节点队列最前面
   3. 以上两步的循环结束后，如果旧开始大于旧结束，说明旧节点数量多于新节点，则将多于的旧节点删除
   4. 如果新开始大于新结束，说明新节点数量多于旧节点，将多于的新节点插入到旧节点队列后面

## 模板编译

模板编译的主要目的是将模板（template）转换为渲染函数（render）

模板编译的作用：

- 在Vue2.x中使用vnode描述视图及各种交互，用户自己编写vnode比较复杂
- 让用户只需要编写类似HTML的代码，通过编译器将模板转换为返回vnode的render函数
- .vue文件会被webpack在构建的过程中转换成render函数

### 入口

1. 完整版的vue入口中，调用compileToFunctions(template, {}, this)，这个函数最终是返回render函数
2. 而compileToFunctions是由createCompiler(baseOptions)生成的
   1. 定义了compile(template, options)函数，将传入的options和平台的options进行合并，将结果传递给baseCompile
   2. 通过createCompileToFunctionFn(compile)生成compileToFunctions，这个函数是模板编译的入口
3. createCompiler由createCompilerCreator(function baseCompile(template, options) {})生成
   1. 传入了baseCompile函数，将template解析成AST（parse），优化AST语法树（optimize），最后生成字符串形式的js代码（generate）
   2. 返回createCompiler函数

### 编译过程

AST：抽象语法树，使用对象的形式描述树形的代码结构，vue中的AST是用来描述树形结构的HTML字符串

为什么要使用AST：

- 模板字符串转换成AST后，可以通过AST对模板做优化处理
- 标记模板中的静态内容，在patch的时候直接跳过静态内容
- 在patch的过程中静态内容不需要对比和重新渲染

整体过程

1. compileToFunctions(template,...) 是编译的入口
   1. 先从缓存中加载编译好的render函数
   2. 缓存中没有调用，则调用compile(template, options)
2. compile(template, options)
   1. 作用是合并传入的options和平台的options
   2. 调用baseCompile(template.trim(), finalOptions)
3. baseCompile(template.trim(), finalOptions)
   1. 调用parse()(来自于html-parse.js)，将template转换成AST
   2. 调用optimize()，标记AST 中的静态子树，一旦检测到静态子树，将AST的static属性设置为true，则不需要再每次重新渲染的时候重新生成节点，在patch阶段，也会跳过静态子树（静态根节点：标签中除了文本内容以外，还需要包含其他标签）
   3. 调用generate()，生成字符串形式的js代码
4. compileToFunctions(template,...)
   1. 调用createFunction()，将字符串形式的js代码转换为函数
   2. 这时候render和staticRenderFns初始化完毕，挂载到Vue实例的options对应的属性中

## 组件化

组件在创建的时候，先创建父组件再创建子组件，而在挂载的时候，先挂载子组件再挂载父组件

组件的粒度不是越小越好，抽象的过程要合理
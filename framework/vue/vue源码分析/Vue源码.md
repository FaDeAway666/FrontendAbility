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
  - 微博平台相关
  - 注册和平台相关的全局指令：v-model、v-show
  - 注册和平台相关的全局组件：v-transition、v-transition-group
  - 将__patch__注册成全局方法
- `src/core/index.js`
  - 与平台无关
  - 设置了Vue 的方法：initGlobalAPI(Vue)
- `src/core/instance/index.js`
  - 与平台无关
  - 定义了构造函数，调用了this._init(options)方法
  - 给Vue中混入了常见的实例成员


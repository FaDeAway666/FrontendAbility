# 与Vue2.x的区别

- 源码组织方式

  - 使用typescript重写

  - 使用monorepo管理项目结构

    一个项目管理多个package，模块之间划分非常明确

    packages目录：

    - compiler-core    平台无关的编译器
    - compiler-dom    浏览器环境编译
    - compiler-sfc    单文件组件编译
    - compiler-ssr    服务端渲染编译器
    - reactivity    响应式系统
    - runtime-core     平台无关运行时
    - runtime-dom     浏览器运行时
    - runtime-test    测试环境运行时
    - server-renderer    服务端渲染
    - shared     公共API
    - size-check     检查包大小
    - template-explorer    将template输出为render函数
    - vue    构建完整版Vue

- composition API  （组合式API，用于解决开发大型项目时，组件过大导致options API不适合使用）

- 性能提升

  - 使用Proxy实现响应式
  - 服务端渲染性能提升2-3倍

- Vite    轻量级，快速的开发服务器和打包器

# 构建版本

dist目录下存放所有的构建版本

- vue.cjs.js     cjs完整版
- vue.cjs.prod.js    
- vue.esm-browser.js    esm版，浏览器中使用`<script type="module">`导入
- vue.esm-browser.prod.js
- vue.esm-bundler.js
- vue.global.js    全局版，可以直接在浏览器中使用
- vue.global.prod.js
- vue.runtime.esm-browser.js
- vue.runtime.esm-browser.prod.js
- vue.runtime.esm-bundler.js
- vue.runtime.global.js
- vue.runtime.global.prod.js

带有prod的都是压缩过的版本

runtime都是运行时版本

带有bundler的没有打包所有代码，需要配合打包工具使用，使用脚手架创建的Vue3.0文件，使用的是vue.runtime.global.prod.js，打包的时候只会打包使用到的代码

# Composition API

设计动机

- Options API
  - 包含一个描述组件选项（data、methods、props等）的对象
  - Options API开发复杂组件，同一个功能逻辑的代码可能被拆分到不同选项，就是一个功能需要在多个选项中编写代码
- Composition API
  - 一组基于函数的API
  - 可以更灵活地组织组件的逻辑，当查看或者修改某个功能的时候，只需要关注一块区域即可，也方便其他组件重用

# 性能提升

响应式系统升级

- Vue2.x的响应式核心为defineProperty
- Vue3.0使用Proxy重写响应式系统
  - 可监听动态新增的属性
  - 可监听属性的删除
  - 可监听数组的索引和length属性，修改数组某一项值，现在也可被监听

编译优化

- Vue2.x的编译过程：

  template编译成render函数时，通过标记静态根节点来优化diff操作

- Vue3.0标记和提升所有静态根节点，diff时只需要对比动态节点内容

  - 引入Fragments，模板中不再需要创建一个唯一的根节点
  - 静态内容提升：组件中会把静态的内容单独提出去，只在初始化的时候创建，在render的时候将不再创建
  - Patch Flag：编译的时候会把动态节点打上标记，diff的时候只会比较标记的部分是否会改变，比如标记为TEXT，就只会比较文本节点是否有变化
  - 缓存事件处理函数，减少不必要的更新操作

优化打包体积

- 移除了一些不常用的API，例如inline-template、filter
- 对Tree-shaking的支持度更高

# Vite

基于ESM的一个轻量级打包器

ESM的特性：

- 现代浏览器支持 （IE除外）
- script标签中使用type="module"
- 默认延迟加载
  - 类似于defer
  - 在文档解析完成后，DOMContentLoaded事件之前执行

Vite与Vue-CLI的区别

- 开发环境
  - Vite在开发环境下不需要打包，可以直接运行，因为使用ESM，直接import就可以
  - Vue-CLI开发环境下也要打包才能运行、
- 生产环境
  - Vite使用Rollup打包，也是基于ESM的方式打包，打包后的体积比webpack更小
  - Vue-CLI使用webpack打包

Vite特点：

- 快速冷启动
- 按需编译
- 模块热更新

Vite 的工作原理：

使用ESM，在开发环境中不会打包，而是将请求全部交给服务器处理，对于单文件组件，服务器通过compiler-sfc来进行编译
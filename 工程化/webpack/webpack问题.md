# 背景

webpack最早的出现就是为了解决前端模块化的问题

## 前端模块化历史

第一阶段：文件划分方式

简单地将不同功能的代码放入不同的文件当中，约定每个文件是一个模块，然后在文档中引用

└─ stage-1

    ├── module-a.js
    
    ├── module-b.js
    
    └── index.html
缺点非常多：

- 直接在全局引用，污染全局作用域
- 模块之间容易产生命名冲突
- 没有命名空间，所有模块的成员都可以被外部访问或修改
- 无法管理模块之间的依赖关系

第二阶段：命名空间方式

约定每个模块只暴露一个全局对象，模块内的成员都挂载到这个对象中

```js
// module-a.js

window.moduleA = {

  method1: function () {

    console.log('moduleA#method1')

  }

}

```

这种方法仅仅解决了命名冲突的问题，依然存在外部可以访问模块内部成员的问题

第三阶段：立即执行函数表达式（IIFE，Immediately-Invoked Function Expression）

将每个模块成员都放在一个立即执行函数产生的私有作用域中，需要暴露给外部的对象再挂载到全局

```js
// module-a.js

;(function () {

  var name = 'module-a'

  function method1 () {

    console.log(name + '#method1')

  }

  window.moduleA = {

    method1: method1

  }

})()

```

第四阶段：IIFE依赖参数

可以通过给IIFE添加参数，来表明这个模块的依赖情况

```js
;(function ($) { // 通过参数明显表明这个模块的依赖
  var name = 'module-a'
  function method1 () {
    console.log(name + '#method1')
    $('body').animate({ margin: '200px' })
  }
  window.moduleA = {
    method1: method1
  }
})(jQuery)
```

但是这些方法依然存在一些问题，最明显的就是模块加载问题

- 如果模块非常多，每个模块都需要向服务端进行请求，会很大影响页面加载性能；
- 模块的引入都是通过在页面直接引入<script>标签，不受代码的控制，难以管理

所以有一种理想的方式就是在页面中引入一个js入口文件，模块通过这个文件进行按需加载

## 模块规范化

实现模块化，不同的开发者之间会存在一些实施差异，因此需要进行规范化

### CommonJS

是Node.js中遵循的模块化规范，通过module.exports导出模块，通过require函数引用模块

CommonJS是通过同步的方式加载模块，这种方式在浏览器上运行效率比较低下

### AMD规范

Asynchronous Module Definition ，异步模块定义规范，约定每个模块通过define函数进行定义，可传入两个参数，第一个参数是包含依赖的数组，第二个参数是执行的函数，该函数的参数与前面的依赖项一一对应，需要导出的成员，通过return实现

```js
define(['jquery','./module.js'], function($,module) {
    return {
        start: function() {
            $('body').animate({
                margin: '200px'
            })
            module()
        }
    }
})
```

使用AMD规范的JS库有

[Require.js]: https://requirejs.org/

### 模块打包工具

模块化的思想，会引入一些新的问题：

- ES Modules模块系统存在一些环境兼容问题
- 模块划分的文件过多，会影响页面加载速率
- 不仅仅是js文件需要模块化，HTML、css也需要

因此，理想的模块化工具需要具备：

1. 具备代码编译能力，能将新特性的代码编译成兼容性高的版本
2. 将零散的模块打包到一起
3. 需要支持多种前端资源的打包（js/css/images等），将这些资源都当做模块进行整理

# webpack核心特性

## 模块化打包

webpack4以后支持零配置启动打包，默认src/index.js作为入口，打包的结果放入到dist/main.js

通过自定义的方式打包，需要在根目录下添加webpack.config.js

tips：让配置文件支持智能提示的方法

```js
// ./webpack.config.js
/** @type {import('webpack').Configuration} */
const config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  }
}
module.exports = config
```

webpack4预设了几种工作模式

- production模式，启动内置优化插件，自动优化打包结果，打包偏慢
- development模式，自动优化打包速度，添加调试的插件
- none，运行原始打包，不进行任何额外处理

webpack打包结果：

一个立即执行函数，接受一个modules参数，调用时会传入一个数组。

打包的模块就是一个module，也是一个函数

工作入口的立即执行函数内部结构分为

- 一个installModules对象，缓存加载过的模块
- 一个用于加载指定模块的函数
- 一些挂载了其他工具的函数
- 返回一个入口模块，并加载

## Loader

webpack需要管理前端工程中所有类型的资源，需要使用到loader机制

webpack内部默认的loader只能用来处理js模块

loader的使用方式：

```js
// ./webpack.config.js
module.exports = {
  entry: './src/main.css',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 根据打包过程中所遇到文件路径匹配是否使用这个 loader
        use: 'css-loader' // 指定具体的 loader
      }
    ]
  }
}
```

以css-loader为例，在webpack.config.js中添加一个module属性，在module中添加一个rules数组，这个数组是加载器的规则配置集合

每个规则对象都有两个属性，test用于匹配所需要的加载的文件路径，use用来指定具体的loader

注意，css-loader只负责将css模块转化为一个js模块，但并不会使用这个模块，将其变成style标签append到页面上，需要再使用style-loader，才能使css生效

```js
module: {
    rules: [
      {
        test: /\.css$/, 
        use: [
        	'style-loader',
        	'css-loader'
        ] // 当一条规则有多个loader时，loader的加载顺序是由后往前
      }
    ]
  }
```

webpack建议开发者在js中引入其他的资源，目的是建立js文件与其他资源的依赖，不仅在逻辑上方便理解，而且更改代码的时候，只需要维护js文件即可

### Loader工作原理

每个loader都要导出一个函数，这个函数就是对资源的处理过程，最终函数的返回结果一定是一段JS代码字符串

根据这个原理，可以自己开发特定的loader

tips：rules对象里的use，可以使用相对路径

```js
module: {
    rules: [
      {
        test: /\.md$/,
        // 直接使用相对路径
        use: './markdown-loader'
      }
    ]
  }
```

## Plugins插件

Loader机制负责实现工程整体资源的模块化，而插件机制的目的在于增强webpack在项目**自动化构建**的能力

插件的几个常用的应用场景：

- 实现自动在打包之前清除 dist 目录（上次的打包结果）；
- 自动生成应用所需要的 HTML 文件；
- 根据不同环境为代码注入类似 API 地址这种可能变化的部分；
- 拷贝不需要参与打包的资源文件到输出目录；
- 压缩 Webpack 打包完成后输出的文件；
- 自动发布打包结果到服务器实现自动部署。

插件的使用方法

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```

开发插件

webpack的插件机制就是钩子机制，webpack几乎在每一个环节都埋下钩子，因此插件可以覆盖webpack的整个工作流程

webpack的钩子函数可在官网中查询  https://webpack.js.org/api/compiler-hooks

webpack要求插件必须是一个函数或是一个包含apply方法的对象，一般会将插件定义成一个包含apply方法的类

以创建一个删除打包后js文件中注释的插件为例

```js
// ./remove-comments-plugin.js
class RemoveCommentsPlugin {
  apply (compiler) {
    console.log('RemoveCommentsPlugin 启动')
    // compiler => 包含了我们此次构建的所有配置信息
  }
}
```

思路为：

1. 获取打包后的文件和文件内容
2. 判断文件是否是js文件，如果是，通过正则去除掉代码注释
3. 覆盖掉之前的文件，暴露一个source方法和size方法（webpack要求）

```js
class RemoveCommentsPlugin {
  apply (compiler) {
    compiler.hooks.emit.tap('RemoveCommentsPlugin', compilation => {
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source()
          const noComments = contents.replace(/\/\*{2,}\/\s?/g, '')
          compilation.assets[name] = {
            source: () => noComments,
            size: () => noComments.length
          }
        }
      }
    })
  }
}
```



# webpack一些重要配置

## devServer

devServer提供了一个开发服务器，集成了自动编译、自动刷新浏览器等一系列功能

运行webpack-dev-server这个命令时的大致流程：

启动HTTP服务 --》webpack构建 --》 监听源文件变化 --》重新构建webpack

webpack构建的结果暂时存放到内存中，HTTP server也是从内存中读取文件

常用功能：

1. 静态资源访问

   devServer默认可以将打包结果和输出文件全部作为服务器的资源文件，如果有没有参与打包的外部文件需要被devServer访问，可以添加contentBase属性进行设置

   该属性可以是一个字符串或数组

   ```js
   devServer: {
   	contentBase: 'public' // ['public', 'static']
   }
   ```

   这种静态资源的访问虽说用copy-webpack-plugin也能实现，但是用这种方式，如果需要访问的静态资源一多，每次修改代码的时候都会调用copy的插件，影响构建效率

2. proxy代理

   用于解决前端开发环境和后端服务不处于同源环境的问题

   本地的请求http://localhost:8080/api/users

   ```js
   devServer: {
    	proxy: {
         '/api': {
           target: 'https://api.github.com',
           pathRewrite: {
             '^/api': '' // 替换掉代理地址中的 /api，最终的请求是https://api.github.com/users
           },
           changeOrigin: true // 确保请求 GitHub 的主机名就是：api.github.com
         }
       }
   }
   ```

3. 模块热替换（HMR, Hot Module Replacement）

   指在应用运行的过程中，当某个模块修改后，应用不会刷新整个页面，而是将修改后的模块替换到应用当中，应用的运行状态不会发生改变

   开启方式

   ```js
   devServer: {
       // 开启HMR,如果资源不支持HMR会fallback到live reloading
   	hot: true
       // hotOnly: true 只使用HMR，不会fallback到live reloading
   },
   plugins: [
       // ...
       // HMR 特性所需要的插件
       new webpack.HotModuleReplacementPlugin()
   ]
   ```

   这里要注意的是，如果不是使用vue-cli，create-react-app等之类的脚手架，仅使用上面的配置，在修改css这种经过loader处理的资源时会实现热替换，但是如果修改js这种没有经过loader处理的资源，便会回退到live reloading

   因为脚手架内部实现了通用的替换操作，所以不需要对js的热替换进行额外处理，如果是原生webpack，则需要用到HMR的api进行手工处理



# 开发中使用Webpack遇到的一些问题

## Babel问题

babel全家桶全部用最新版本，不然有可能出现TypeError: Cannot read property 'bindings' of null

@babel/cli    @babel/core   babel-loader   @babel/preset-env
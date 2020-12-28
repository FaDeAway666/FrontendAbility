# 背景

webpack最早的出现就是为了解决前端模块化的问题

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

一个立即执行函数，接受一个modules参数，调用时会传入一个数组。打包的模块就是一个module，也是一个函数

工作入口的立即执行函数内部结构分为

- 一个installModules对象，缓存加载过的模块
- 一个用于加载指定模块的函数
- 一些挂载了其他工具的函数
- 返回一个入口模块，并加载

webpack加载模块的方式：

- 遵循ES Modules标准的import声明
- 遵循CommonJS标准的require函数
- 遵循AMD标准的define函数和require函数
- css中的@import和url函数
- HTML代码中图片标签的src属性

遵循以上几种方式的文件依赖的模块都会被webpack识别，并交给对应的加载器处理，最后打包到输出目录。

因此webpack的核心机制就是加载器机制，递归地寻找js文件的依赖，并把它们通过loader合并到最终的打包结果中

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
      },
      // loader的另一种使用方式 
      { 
          test: /.js$/,
          use: {
              loader: 'babel-loader',
              options: {
                  presets: '@babel/preset-env'
              }
          }
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

loader是一个管道的概念，对同一个资源可以依次使用多个loader

**webpack建议开发者在js中引入其他的资源**，目的是建立js文件与其他资源的依赖，不仅在逻辑上方便理解，而且更改代码的时候，只需要维护js文件即可

### URL Loder

将文件转换为特定格式的url进行存储，打包完成过后的项目中不再有独立的文件，而是变成一串js代码中的url

对于项目中的资源文件，较小的文件可使用url-loader，减少对服务端的请求次数，而对于大文件，则还是使用单独存放的方式（file-loader），提升加载速度

### 常用Loader的分类

1. 编译转换类

   例如css-loader：将css代码转换为js代码段

2. 文件操作类

   file-loader：复制文件到输出目录，并将访问路径导出

3. 代码检查类

   eslint-loader

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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        title: 'html plugin' // html title
        meta: { // 元标签
        	viewport: 'width=device-width'
    	},
        template: './src/index.html' // 指定输出的HTML文件的模板
    }),
    // 生成多个HTML文件
    new HtmlWebpackPlugin({
    	filename: 'about.html'
	})
  ]
}
```

开发插件

**webpack的插件机制就是钩子机制**，webpack几乎在打包的每一个环节都埋下钩子，因此插件可以覆盖webpack的整个工作流程，

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

**webpack构建的结果暂时存放到内存中，HTTP server也是从内存中读取文件**

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

   指在应用运行的过程中，当某个模块修改后，**应用不会刷新整个页面，而是将修改后的模块替换到应用当中**，应用的运行状态不会发生改变

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

   原因是css文件修改过后可以直接替换先前的模块，但是js不好判断该如何修改
   
   脚手架内部实现了通用的替换操作，所以不需要对js的热替换进行额外处理，如果是原生webpack，则需要用到HMR的api进行手工处理
   
   ```js
   // 第一个参数是更新模块的路径，第二个是热更新处理逻辑
   module.hot.accept('./editor', () => {
       console.log('editor 模块更新，在这里处理热更新逻辑')
   })
   ```

## sourceMap

由于打包过后的代码和源代码之间有较大的差异，如果需要调试代码，则不能很好地定位问题代码出现的位置，因此需要用sourceMap来实现打包代码和源代码之间的映射

大多数第三方库都会带有一个.map后缀的文件，是一个json格式的文件，包含一些属性：

- version：版本号
- sources：源文件名称，一个数组
- names：源码中使用的成员名称，
- mappings：base64格式的转换过后的字符与转换之前的映射关系

在打包后的文件的最后一行添加注释，可使用sourceMap

`//# sourceMappingURL=jquery-3.4.1.min.map`

配置sourceMap

```js
module.exports = {
	devtool: 'source-map'
}
```

webpack有许多种sourceMap的模式

![image-20201227163526912](.\images\image-20201227163526912.png)

eval：使用eval函数执行js代码。构建速度快，但只能知道错误代码所处的文件名称，而不知道具体的行列信息

eval-source-map：能生成sourse-map，但也看不到具体的行列信息

cheap-eval-source-map：廉价的eval-source-map，只能定位到行，不能定位到列

cheap-module-eval-source-map：和上一种相同，特点是会完全定位到源代码，而不是经过ES6转换后的结果

hidden-source-map：多半出现在第三方包中，打包结果的末尾叶没有引用这个source-map，当出现问题的时候再去手动引入来定位

nosources-source-map：有具体的报错信息，但是点进去看不到源代码，多用于保护生产环境的代码

固定特征：

- eval - 是否使用eval执行模块代码
- cheap - sourceMap是否包含行信息
- module - 是否能得到Loader处理之前的源代码

模式的选择：

开发：cheap-module-eval-source-map（使用框架较多，需要映射源代码）

生产：none（为了不暴露源码）

## 环境

由于开发环境注重开发效率，为了提升开发效率，webpack会往打包结果中添加额外的内容，但这些代码对生产环境是冗余的，生产环境更注重运行效率，目标是使用更少的代码实现更高的效率

实现：

1. 配置文件根据不同的环境导出不同的配置
2. 一个环境对应一个配置文件

根据环境导出不同配置

```js
// 导出一个接受环境参数，和其他参数的函数
module.exports = (env, argv) => {
    const config = {} // 这里是公共配置
    if (env === 'production') {
        config.mode = 'production'
        config.devtool = false
        config.plugins = [
            ...config.plugins,
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin(['public'])
        ]
    }
    
    return config
}
```

不同环境使用不同的配置

```js
const common = require('./webpack.common.js')
const merge = require('webpack-merge')

module.exports = merge(common, {
    mode: 'production',
    devtool: false,
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin(['public'])
    ]
})
```

指定打包配置文件：`webpack --config webpack.prod.js`

## 优化



# 开发中使用Webpack遇到的一些问题

## Babel问题

babel全家桶全部用最新版本，不然有可能出现TypeError: Cannot read property 'bindings' of null

@babel/cli    @babel/core   babel-loader   @babel/preset-env
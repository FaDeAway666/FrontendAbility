# 概述

rollup也是一款打包器，相比webpack，rollup更为小巧，但不支持其他前端工程化的功能，仅仅是一款ESM打包器

# 使用

创建rollup.config.js文件

```js
export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife' // 输出格式
    }
}
```

使用命令 `yarn rollup --config`进行打包

## 插件

rollup可以使用插件，插件也是rollup唯一的扩展途径

```js
import json from 'rollup-plugin-json'
export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife' // 输出格式
    },
    plugins: [
        json()
    ]
}
```

## code splitting

新版本的rollup也支持代码拆分，通过使用import函数动态加载模块来实现

但是要使用代码拆分，就不能用iife的格式输出，只能用AMD或cmd的格式，因为iife自执行函数默认把所有模块打包到一起

# 总结

- 输出结果更加扁平
- 自动tree shaking
- 打包结果完全可读

根据rollup的特性，rollup更适合用于开发框架或类库，而不适合开发应用
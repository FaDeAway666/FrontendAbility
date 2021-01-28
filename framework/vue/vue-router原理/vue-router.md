# 基础

## 编程式导航

- push

  ```js
  this.$router.push('/login')
  this.$router.push({
  	name: 'Detail'，
  	params: {
  		id: 10
  	}
  })
  ```

- replace

  当前页面进行跳转， 但浏览器不会记录这次跳转

  ```js
  this.$router.replace('/login')
  ```

## 两种模式

哈希模式和history模式的区别从两方面体现

表现形式：

哈希模式中有和路径无关的符号`#`和`?`，history模式则是一个正常的url，但使用时需要服务端配合

原理：

- 哈希模式基于锚点，以及onhanshchange

- history模式基于H5中的history API

  history.pushState() 地址栏改变时不会向服务端发出请求，仅支持IE10+

  history.replaceState()

### History模式

在单页应用使用History模式，例如url为http://www.testurl.com/login，这种地址会去向服务器请求login页面，但由于服务端没有这个页面，所以会返回404

因此，在服务端需要配置除了静态资源外，都返回单页应用的index.html

history 模式应用在node服务当中，用来处理history模式的中间件

```js
const app
const app = express()
// 注册处理history模式的中间件
app.use(history)
// 将静态资源统一加载到该路径，该路径存放所有的打包结果
app.use(express.static(path.join(__dirname, './static'))) 
```

history模式应用在Nginx上，也是无法访问资源就返回404

需要对config进行配置：

```conf
location / {
	root html;
	index index.html index.htm;
	try_files $uri #uri/ /index.html; // 如果找不到对应文件，就返回index.html
}
```

# 实现原理

hash模式：

- url的#号后面的内容是路径地址
- 监听hashchange事件
- 根据当前路由地址找到对应组件重新渲染

history模式：

- 通过history.pushState()改变地址栏，**不会引起浏览器刷新**
- 监听popstate事件，可以记录地址栏地址的变化
- 根据当前路由地址找到对应的组件重新渲染

VueRouter是Vue的一个插件，具有如下的几个构成部分

![image-20210105104426285](.\images\image-20210105104426285.png)

属性：

- options：记录构造函数中传入的对象
- data：是一个对象，里面有一个current属性，用来记录当前的路由地址，需要是响应式的
- routeMap：存放路由映射表

方法：

- install：vue插件机制必须实现的方法
- init：用来调用几个init方法
- initEvent：注册popstate事件
- initComponents：创建router-link和router-view
- createRouteMap：初始化routeMap属性
- constructor：构造函数

Vue的构建版本

- 运行时版：不支持template模板，需要打包的时候提前编译
- 完整版：包含运行时和编译器，体积比运行时版大10k左右，程序运行的时候把模板转换成render函数

**tips：**由于vue-cli创建的工程默认使用运行时版本，因此在使用Vue.component注册组件的时候不能直接使用template进行构建，可以修改配置，让构建版本使用完整版

vue.config.js

```js
module.exports = {
	runtimeCompiler: true
}
```


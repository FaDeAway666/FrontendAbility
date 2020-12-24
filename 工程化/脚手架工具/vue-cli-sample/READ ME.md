脚手架的实现过程：

1. 定义模板与用户交互字段
2. 编写Node Cli 入口文件逻辑
   1. 接收用户输入
   2. 根据用户的输入来渲染模板
3. 使用npm或yarn link到本地
4. 执行脚手架

用户输入字段：

项目名：默认cli-sample

是否使用Vue-Router：y/n

是否使用Vuex：y/n

是否使用Vue-i18n：y/n

使用的样式表类型：['css', 'less', 'sass']
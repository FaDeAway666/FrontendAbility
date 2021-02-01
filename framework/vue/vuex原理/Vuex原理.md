# 基础

## 常见的组件通信方式

- 父子传值

  子组件通过props接收数据，父组件给子组件通过相应属性传值

- 子父传值

  子组件通过自定义事件`this.$emit(eventName: string, ...args)`向父组件请求状态改变

  父组件通过注册事件响应函数来处理接收到事件时的逻辑

  一种特殊的情况是

  ```vue
  <!-- Parent.vue -->
  <child @changeEvent="num += $event"></child>
  ```

  通过$event直接获取子组件传入的参数

- 不相关组件传值

  通过eventbus文件

  eventbus

  ```js
  import Vue from 'vue'
  export default new Vue()
  ```

  引入eventbus：`import bus from 'eventbus.js'`

  事件触发的组件调用bus.$emit

  事件接收的组件调用bus.$on

- 通过ref获取子组件

  ref的两个作用

  - 在普通HTML标签上使用ref，获取到的是DOM
  - 在组件标签上使用ref，获取到的是组件实例

  ```vue
  <!-- Child.vue -->
  <input value="value"/>
  
  <!-- Parent.vue -->
  <child ref='c'></child>
  
  <script>
  export default {
  	mounted () {
          this.$refs.c.focus()
      }
  }
  </script>
  ```

  但是这种方式不能频繁使用，且应该尽量避免使用，会影响正常的状态传递

# Vuex

Vuex：专为Vue设计的状态管理库，通过状态的集中和分发，解决多个组件共享状态的问题

- 采用集中式的方式存储需要共享的状态
- 作用是进行状态管理，解决复杂组件通信，实现数据共享
- 集成到了devtools中，提供了time-travel和历史回滚等功能

state：驱动应用的数据源

view：以声明方式将state映射到视图

actions：响应在view上的用户输入导致的状态变化

什么情况下使用Vuex

- 大型单页应用
  - 多个视图依赖于同一状态
  - 来自不同视图的行为需要变更同一状态

核心结构：

- state

- mutation

- getters

- action

  当需要执行异步操作的时候，需要执行action并调用commit去更改状态


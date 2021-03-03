<template>
  <div id="app">
    <h1>TodoList</h1>
    <div class="input-box">
      <span>quanxuan</span>
      <input type="text" placeholder="What's your next todo?"
        @keyup.enter="addTodo"
        v-model="text">
    </div>
    <ul class="todo-list">
      <li class="editing" v-for="(todo,index) in todos" :key="index">
        <div class="view">
          <span class="check-box" 
            :class="{'selected': todo.selected}"></span>
          <div class="content">{{ todo.content }}</div>
          <span class="btn-delete" @click="removeTodo(index)">delete</span>
        </div>
        <input class="edit" type="text">
      </li>
    </ul>
    <div class="options">

    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

/**
 * 添加代办
 * vue3中，这样的一个模块就是一整个功能的实现
 * 包括响应式数据，功能中包含的方法，最后都要return出去
 * todos参数与add功能不相关，所以要从外部引入
 */
const useAdd = todos => {
  const text = ref('')
  const addTodo = () => {
    if(text.value && text.value.trim()) {
      todos.value.unshift({
        content: text.value,
        selected: false
      })
      text.value = ''
    }
  }
  return {
    text,
    addTodo
  }
}

const useRemove = todos => {
  const removeTodo = index => {
    todos.value.splice(index, 1)
  }
  return {
    removeTodo
  }
}

export default {
  name: 'App',

  setup () {
    const todos = ref([])

    return {
      ...useAdd(todos),
      ...useRemove(todos),
      todos
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.input-box {
  width: 50%;
  margin: 0 auto;
  line-height: 60px;
  text-align: left;
}
.input-box span {
  margin-right: 15px;
  cursor: pointer;
}
.input-box input {
  border-width: 0 0 1px 0;
  height: 60px;
  width: 80%;
  font-size: 20px;
  outline: none;
}
.input-box input::placeholder {
  font-size: 20px;
}
.todo-list {
  list-style: none;
  width: 50%;
  margin: 0 auto;
  font-size: 20px;
  text-align: left;
  padding: 0;
}
.todo-list li {
  line-height: 60px;
}
.todo-list li .edit {
  display: none;
  border-width: 0 0 1px 0;
  height: 60px;
  width: 80%;
  font-size: 20px;
  outline: none;
}

.todo-list li.editing .edit {
  display: inline-block;
}
.todo-list li.editing .view {
  display: none;
}

.todo-list .check-box {
  display: inline-block;
  vertical-align: middle;
  width: 10px;
  height: 10px;
  border: 1px solid #000;
  border-radius: 50%;
  margin: 0 10px;
}
.todo-list .check-box.selected {
  background: #000;
}
.todo-list .content {
  width: 80%;
  display: inline-block;
}
.todo-list .btn-delete {
  font-size: 14px;
  cursor: pointer;
}

</style>

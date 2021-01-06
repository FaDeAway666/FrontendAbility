<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div class="links">
      <router-link to="/">hello</router-link>
      <router-link to="/about">about</router-link>
    </div>
    <router-view></router-view>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.links a {
  margin: 0 10px;
  font-size: 18px;
  color: #333;
}
</style>

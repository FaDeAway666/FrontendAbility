<template>
  <div id="app">
    <h1>Vuex demo</h1>
    <div>
      <h3>state</h3>
      {{ $store.state.count }} ||
      {{ $store.state.msg }}
      <h3>getters</h3>
      {{ $store.getters.getReverseMsg }}
      <h3>mutations</h3>
      <button @click="handleMutation">add 2</button>
      <h3>actions</h3>
      <button @click="handleAction">async add</button>
    </div>
    <h3></h3>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  methods: {
    handleMutation () {
      this.$store.commit('addCount', 2)
    },
    handleAction () {
      this.$store.dispatch('asyncAddCount', 5)
    }
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

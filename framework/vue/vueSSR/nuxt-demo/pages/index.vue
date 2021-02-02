<template>
  <div>
    <h1>Home Page</h1>
    <h2>nuxt-link</h2>
    <div>
      <nuxt-link to="/user">to user</nuxt-link>
    </div>
    <h2>编程式导航</h2>
    <button @click="handleClick">to user</button>
    <h2>动态路由</h2>
    <div>
      <nuxt-link to="/user/1">to user/1</nuxt-link>
    </div>
    <h2>嵌套路由</h2>
    <div>
      <nuxt-link to="/nest">to nest</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    handleClick () {
      this.$router.push('/user')
    }
  }
}
</script>

<style>

</style>
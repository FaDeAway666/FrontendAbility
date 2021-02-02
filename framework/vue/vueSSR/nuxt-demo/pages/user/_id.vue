<template>
  <div>
    <h1>
      User {{ id }}
    </h1>
  </div>
</template>

<script>
export default {
  name: 'UserId',
  layout: 'login',
  mounted () {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
    }
  },
  data () {
    return {
      id: ''
    }
  }
}
</script>

<style>

</style>
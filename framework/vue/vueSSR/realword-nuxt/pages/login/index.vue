<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ !isLogin ? 'Sign up' : 'Sign in'}}</h1>
          <p class="text-xs-center">
            <!-- <a href="">Have an account?</a> -->
            <nuxt-link v-if="isLogin" to="/register">Need an account?</nuxt-link>
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <!-- <li>That email is already taken</li> -->
            <!-- 处理登录注册错误信息 -->
            <template v-for="(messages, target) in error">
              <li v-for="message in messages" :key="message">
                {{ target }} {{ message }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group" v-if="!isLogin">
              <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
            </fieldset>
            <fieldset class="form-group">
              <input v-model="user.email" class="form-control form-control-lg" type="text" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ !isLogin ? 'Sign up' : 'Sign in'}}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'unAuthenticated',
  name: 'loginPage',
  computed: {
    isLogin () {
      return this.$route.name === 'login'
    }
  },
  data () {
    return {
      user: {
        username: '',
        email: '',
        password: ''
      },
      error: {}
    }
  },
  methods: {
    async onSubmit () {
      try {
        const { data } = this.isLogin ? await login({
          user: this.user
        }) : await register({
          user: this.user
        })

        console.log(data.user, 'user')
        this.$store.commit('setUser', data.user)

        Cookie.set('user', data.user)

        this.$router.push('/')
      } catch (e) {
        this.error = e.response.data.errors
      }

    }
  }
}
</script>

<style>

</style>
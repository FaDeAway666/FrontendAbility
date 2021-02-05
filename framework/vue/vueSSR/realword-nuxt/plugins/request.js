/**
 * 封装 axios 请求
 * 利用插件的方式，可以获取到nuxt中个各类实例
 */

import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

export default ({ store }) => {
  request.interceptors.request.use(config => {
    // 获取state中的user
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  })
}
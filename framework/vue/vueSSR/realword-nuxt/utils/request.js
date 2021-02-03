/**
 * 封装 axios 请求
 */

 import axios from 'axios'

 const request = axios.create({
   baseURL: 'https://conduit.productionready.io'
 })

 export default request
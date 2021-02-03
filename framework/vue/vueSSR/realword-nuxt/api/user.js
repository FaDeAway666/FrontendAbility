import request from '../utils/request'

export const login = data => request({
  method: 'POST',
  url: '/api/user/login',
  data: data
})

export const register = data => request({
  method: 'POST',
  url: '/api/user',
  data: data
})
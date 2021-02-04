import request from '../utils/request'

export const articleList = params => request({
  method: 'GET',
  url: '/api/articles',
  params
})
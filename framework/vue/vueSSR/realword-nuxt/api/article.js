// import request from '../utils/request'
import { request } from '@/plugins/request'

export const articleList = params => request({
  method: 'GET',
  url: '/api/articles',
  params
})

export const getTags = () => request({
  method: 'GET',
  url: '/api/tags'
})

export const feedArticles = params => request({
  method: 'GET',
  url: '/api/articles/feed',
  params
})

export const favorite = slug => request({
  method: 'POST',
  url: `/api/articles/${slug}/favorite`
})

export const cancleFavorite = slug => request({
  method: 'DELETE',
  url: `/api/articles/${slug}/favorite`
})
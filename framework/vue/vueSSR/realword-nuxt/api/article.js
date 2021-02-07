// import request from '../utils/request'
import { request } from '@/plugins/request'

// 获取文章列表
export const articleList = params => request({
  method: 'GET',
  url: '/api/articles',
  params
})

// 获取标签
export const getTags = () => request({
  method: 'GET',
  url: '/api/tags'
})

// 获取关注的文章列表
export const feedArticles = params => request({
  method: 'GET',
  url: '/api/articles/feed',
  params
})

// 点赞
export const favorite = slug => request({
  method: 'POST',
  url: `/api/articles/${slug}/favorite`
})

// 取消点赞
export const cancleFavorite = slug => request({
  method: 'DELETE',
  url: `/api/articles/${slug}/favorite`
})

// 获取文章详情
export const articleDetail = slug => request({
  method: 'GET',
  url: `/api/articles/${slug}`
})
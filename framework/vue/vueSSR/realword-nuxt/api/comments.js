import { request } from "../plugins/request";

// 获取文章评论列表
export const getComments = slug => request({
  method: 'GET',
  url: `api/articles/${slug}/comments`
})

// 删除评论
export const deleteComment = (slug, id) => request({
  method: 'DELETE',
  url: `/api/articles/${slug}/comments/${id}`
})

// 新增评论
export const addComment = (slug, data) => request({
  method: 'POST',
  url: `/api/articles/${slug}/comments`,
  data
})
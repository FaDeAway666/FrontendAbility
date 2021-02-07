<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea v-model="commentBody" class="form-control" 
          placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="article.author.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" @click.stop.prevent="comment(article.slug)">
        Post Comment
        </button>
      </div>
    </form>
    
    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link :to="`/profile/${comment.author.username}`" class="comment-author">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link :to="`/profile/${comment.author.username}`" class="comment-author">
          {{ comment.author.username }}
        </nuxt-link>
        <!-- <a href="" class="comment-author">Jacob Schmidt</a> -->
        <span class="date-posted">{{ comment.createdAt }}</span>
        <span class="mod-options">
          <i class="ion-trash-a" @click="removeComment(article.slug, comment.id)"></i>
        </span>
      </div>
    </div>

  </div>
</template>

<script>
import { addComment, deleteComment, getComments } from '@/api/comments'
export default {
  name: 'articleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comments: [],
      commentBody: ''
    }
  },
  // 不需要SEO的组件，直接使用客户端渲染
  async mounted () {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  },
  methods: {
    // 发表评论
    async comment (slug) {
      const { data } = await addComment(slug, {
        comment: {
          body: this.commentBody
        }
      })
      this.comments.unshift(data.comment)
    },
    // 删除评论
    async removeComment (slug, id) {
      await deleteComment(slug, id)
      const index = this.comments.findIndex(item => item.id === id)
      this.comments.splice(index, 1)
    }
  }
}
</script>

<style>

</style>
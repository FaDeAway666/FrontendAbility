<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{ article.title }}</h1>

        <article-meta :article="article" />

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12" v-html="article.body">
          
        </div>
      </div>

      <hr />

      <div class="article-actions">
        
        <article-meta :article="article" />

      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">

          <article-detail :article="article" />
          
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { articleDetail } from '@/api/article'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/meta.vue'
import ArticleDetail from './components/comments.vue'

export default {
  name: 'articlePage',
  components: {
    ArticleMeta,
    ArticleDetail
  },
  async asyncData ( { params } ) {
    const { data } = await articleDetail(params.slug)
    const { article } = data
    // 引入Markdown处理函数
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    return {
      article
    }
  },
  // 页面SEO优化，设置当前页面的头部
  head () {
    return {
      title: `${this.article.title} - realworld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  }
}
</script>

<style>

</style>
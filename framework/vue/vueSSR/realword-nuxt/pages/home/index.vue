<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <!-- 导航tab -->
              <li v-if="user" class="nav-item">
                <!-- 需要用exact进行精确匹配 disabled -->
                <nuxt-link class="nav-link" exact 
                  :class="{ active: tab === 'your'}" 
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your'
                    }
                  }">Your Feed {{ tab }}</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" exact 
                  :class="{ active: tab === 'global'}" 
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global'
                    }
                  }">Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link class="nav-link" exact 
                  :class="{ active: tab === tag}" 
                  :to="{
                    name: 'home',
                    query: {
                      tab: tag
                    }
                  }"># {{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  id: article.author.username
                }
              }"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link :to="{
                  name: 'profile',
                  params: {
                    id: article.author.username
                  }
                }"
                  >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right" 
                :class="{active: article.favorited}"
                @click="favorite(article)"
                :disabled="article.favoriteDisable">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link class="preview-link" :to="{
              name: 'article',
              params: {
                slug: article.slug
              }
            }">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{ active: item == page }"
                v-for="item in pageList" :key="item">
                <nuxt-link class="page-link" :to="{
                  name: 'home',
                  query: {
                    page: item,
                    tag: $route.query.tag,
                    tab: tab
                  }
                }">{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link :to="{
                name: 'home',
                query: {
                  tag: item,
                  tab: item
                }
              }" class="tag-pill tag-default"
                v-for="item in tags" :key="item">{{ item }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { articleList, getTags, feedArticles, favorite, cancleFavorite } from '@/api/article'
import { mapState } from 'vuex'
export default {
  name: 'homePage',
  watchQuery: ['page', 'tag', 'tab'],
  async asyncData ( { query, store } ) {
    const page = query.page || 1
    const limit = 20
    const { tag, tab } = query
    // 使用Promise.all，并行请求接口
    console.log(store.state.user,tab,'user')
    const getArticles = store.state.user && tab === 'your' ?
      feedArticles:
      articleList
    const [tagRes, articleRes] = await Promise.all([
      getTags(),
      getArticles({
        limit: limit,
        offset: (page - 1) * limit,
        tag
      })
    ])
    const { tags } = tagRes.data
    const { articles, articlesCount } = articleRes.data

    // 给每个文章对象增加一个点赞禁用，在点赞期间禁止重复点击
    articles.forEach(item => {
      item.favoriteDisable = false
    })

    return {
      articles,
      articlesCount,
      tags,
      page,
      limit,
      tag,
      tab: tab || 'global'
    }
  },
  computed: {
    ...mapState(['user']),
    pageList() {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async favorite (article) {
      article.favoriteDisable = true
      if (article.favorited) {
        await cancleFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        await favorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      // 取消按钮禁用
      article.favoriteDisable = false
      
    }
  }
};
</script>

<style>
</style>
<template>
  <div class="article-meta">
    <nuxt-link :to="`/profile/${article.author.username}`">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="`/profile/${article.author.username}`">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt }}</span>
    </div>
    <button class="btn btn-sm btn-outline-secondary"
      :class="{ active: article.author.following }"
      @click="follow(article.author)"
      :disabled="followDisable">
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }} 
      <span class="counter">(2)</span>
    </button>
    &nbsp;&nbsp;
    <button class="btn btn-sm btn-outline-primary"
      :class="{ active: article.favorited }"
      @click="favorite(article)"
      :disabled="favoriteDisable">
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
import { favorite, cancleFavorite } from '@/api/article'
import { follow, unfollow } from '@/api/user'
export default {
  name: 'articleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      followDisable: false,
      favoriteDisable: false
    }
  },
  methods: {
    async follow (author) {
      this.followDisable = true
      if (author.following) {
        await unfollow(author.username)
        this.article.author.following = false
      } else {
        await follow(author.username)
        this.article.author.following = true
      }
      this.followDisable = false
    },
    async favorite (article) {
      this.favoriteDisable = true
      if (article.favorited) {
        await cancleFavorite(article.slug)
        this.article.favorited = false
        this.article.favoritesCount -= 1
      } else {
        await favorite(article.slug)
        this.article.favorited = true
        this.article.favoritesCount += 1
      }
      this.favoriteDisable = false
    }
  }
}
</script>

<style>

</style>
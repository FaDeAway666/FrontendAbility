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
      @click="follow">
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }} 
      <span class="counter">(2)</span>
    </button>
    &nbsp;&nbsp;
    <button class="btn btn-sm btn-outline-primary"
      :class="{ active: article.favorited }">
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'articleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    follow () {
      
    }
  }
}
</script>

<style>

</style>
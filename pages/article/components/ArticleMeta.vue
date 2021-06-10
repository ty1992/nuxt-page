<template>
  <div class="article-meta">
    <nuxt-link :to="`/profile/${article.author.username}`"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link :to="`/profile/${article.author.username}`" class="author">{{
        article.author.username
      }}</nuxt-link>
      <span class="date">{{ article.updatedAt }}</span>
    </div>
    <template v-if="!isMyArticle">
      <button class="btn btn-sm btn-outline-secondary">
        <i class="ion-plus-round"></i>
        &nbsp; {{ article.author.following ? "unFollow" : "Follow" }}
        {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <button class="btn btn-sm btn-outline-primary">
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
    <template v-else>
      <nuxt-link
        :to="`/article/edit/?slug=${article.slug}`"
        class="btn btn-outline-secondary btn-sm"
      >
        <i class="ion-edit" /> Edit Article
      </nuxt-link>
      <button
        class="btn btn-outline-danger btn-sm"
        @click="delArticle"
      >
        <i class="ion-trash-a" /> Delete Article
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {delArticles} from '@/api/articles'
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["user"]),
    isMyArticle() {
      return this.article.author.username === this.user.username;
    },
  },
  methods: {
    async delArticle(){
      try {
        const data = delArticles(this.article.slug)
        this.$router.replace('/')
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
  }
};
</script>

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
              <li
                v-if="user"
                class="nav-item"
                @click="
                  tab = 'your_feed';
                  tag = '';
                "
              >
                <a
                  href="javascript:void(0);"
                  class="nav-link"
                  :class="{ active: tab === 'your_feed' }"
                >
                  Your Feed
                </a>
              </li>
              <li
                class="nav-item"
                @click="
                  tab = 'global_feed';
                  tag = '';
                "
              >
                <a
                  href="javascript:void(0);"
                  class="nav-link"
                  :class="{ active: tab === 'global_feed' }"
                >
                  Global Feed
                </a>
              </li>
              <li v-if="tab === 'tag'" class="nav-item">
                <a
                  href="javascript:void(0);"
                  class="nav-link"
                  :class="{ active: tab === 'tag' }"
                >
                  # {{ tag }}
                </a>
              </li>
            </ul>
          </div>
          <template v-if="loading">
            <div class="article-preview">Loading...</div>
          </template>
          <template v-else>
            <template v-if="articles.length">
              <div
                class="article-preview"
                v-for="article in articles"
                :key="article.slug"
              >
                <div class="article-meta">
                  <nuxt-link :to="`/profile/${article.author.username}`">
                    <img :src="article.author.image" alt="" />
                  </nuxt-link>
                  <div class="info">
                    <nuxt-link
                      :to="`/profile/${article.author.username}`"
                      class="author"
                    >
                      {{ article.author.username }}</nuxt-link
                    >
                    <span class="date">{{ article.createdAt }}</span>
                  </div>
                  <button
                    class="btn btn-outline-primary btn-sm pull-xs-right"
                    :disabled="article.favoriteDisabled"
                    @click="onFavorite(article)"
                    :class="{ active: article.favorited }"
                  >
                    <i class="ion-heart"></i> {{ article.favoritesCount }}
                  </button>
                </div>
                <nuxt-link
                  :to="`/article/${article.slug}`"
                  class="preview-link"
                >
                  <h1>{{ article.title }}</h1>
                  <p>{{ article.description }}</p>
                  <span>Read more...</span>
                  <ul class="tag-list" v-if="article.tagList">
                    <li
                      v-for="(title, index) in article.tagList"
                      :key="index"
                      class="tag-default tag-pill tag-outline "
                    >
                      {{ title }}
                    </li>
                  </ul>
                </nuxt-link>
              </div>
            </template>

            <template v-else>
              <div class="article-preview">No articles are here... yet.</div>
            </template>
          </template>
          <!-- 分页 -->
          <nav v-if="!loading && articles.length">
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ active: item === page }"
                v-for="item in totalPage"
                :key="item"
              >
                <a
                  href="javascript:void(0);"
                  @click="page = item"
                  class="page-link"
                  >{{ item }}</a
                >
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <a
                v-for="(title, index) in tags"
                href="javascript:void(0);"
                class="tag-pill tag-default"
                @click="
                  tag = title;
                  tab = 'tag';
                "
                :key="index"
              >
                {{ title }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTags } from "@/api/tags";
import {
  getArticles,
  feedArticles,
  favoriteArticles,
  unfavoriteArticles,
} from "@/api/articles";
import { mapState } from "vuex";
export default {
  name: "Home",
  async asyncData({ query }) {
    const tag = query.tag || "";
    const page = query.page || 1;
    const limit = 10;
    const [tagRes, articleRes] = await Promise.all([
      getTags(),
      getArticles({
        limit,
        offset: (page - 1) * limit,
        tag,
      }),
    ]);
    const { articles, articlesCount } = articleRes;
    let { tags } = tagRes;
    tags = tags.filter((item) => item !== "");
    articles.forEach((article) => (article.favoriteDisabled = false));
    return {
      tags,
      articles,
      articlesCount,
      page,
      limit,
    };
  },
  data() {
    return {
      tab: "global_feed",
      tag: "",
      loading: false,
    };
  },
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async onFavorite(article) {
      // 未登入，返回登入页面
      if (!this.user) return this.$router.replace("/login");
      article.favoriteDisabled = true;
      if (article.favorited) {
        // 取消点赞
        await unfavoriteArticles(article.slug);
        article.favorited = false;
        article.favoritesCount--;
      } else {
        // 添加点赞
        await favoriteArticles(article.slug);
        article.favorited = true;
        article.favoritesCount++;
      }
      article.favoriteDisabled = false;
    },
    async load({ tag, limit, page, tab }) {
      this.loading = true;
      const loadArticles = tab === "your_feed" ? feedArticles : getArticles;
      const { articles, articlesCount } = await loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag,
      });
      articles.forEach((article) => (article.favoriteDisabled = false));
      this.articlesCount = articlesCount;
      this.articles = articles;
      this.loading = false;
    },
  },
  watch: {
    tab(newval) {
      this.load({
        page: (this.page = 1),
        limit: this.limit,
        tag: this.tag,
        tab: newval,
      });
    },
    page(newval) {
      this.load({
        page: newval,
        limit: this.limit,
        tag: this.tag,
        tab: this.tab,
      });
    },
    tag(newval) {
      this.load({
        page: (this.page = 1),
        limit: this.limit,
        tag: newval,
        tab: this.tab,
      });
    },
  },
};
</script>

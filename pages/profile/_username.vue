<template>
  <div class="profile-page">
    <div class="user-info" v-if="profile">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <nuxt-link
              v-if="isMyProfile"
              class="btn btn-sm btn-outline-secondary action-btn"
              to="/settings"
            >
              <i class="ion-gear-a" />
              Edit Profile Settings
            </nuxt-link>
            <template v-else>
              <button
                v-if="isFollowing"
                class="btn btn-sm btn-outline-secondary action-btn"
                @click="unfollow"
                :disabled="disabled"
              >
                <i class="ion-minus-round" />
                {{ `Unfollow ${profile.username}` }}
              </button>
              <button
                v-else
                class="btn btn-sm btn-outline-secondary action-btn"
                @click="follow"
                :disabled="disabled"
              >
                <i class="ion-plus-round" />
                {{ `follow ${profile.username}` }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'my' }"
                  :to="{
                    path: `/profile/${username}`,
                    query: {
                      tab: 'my',
                      page: 1,
                    },
                  }"
                  >My Articles</nuxt-link
                >
                <!-- <a class="nav-link active" href="">My Articles</a> -->
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'favorited' }"
                  :to="{
                    path: `/profile/${username}`,
                    query: {
                      tab: 'favorited',
                      page: 1,
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
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
                :class="{ active: item == page }"
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
      </div>
    </div>
  </div>
</template>

<script>
import { getProfiles, followProfiles, unfollowProfiles } from "@/api/profiles";
import { getArticles,
  favoriteArticles,
  unfavoriteArticles, } from "@/api/articles";
import { mapState } from "vuex";
export default {
  name: "ProfilePage",
  watchQuery: ["tab"],
  async asyncData({ params, query }) {
    const { username } = params;
    const { tab = "my", page = 1 } = query;
    const limit = 10;
    const _params = { limit, offset: (page - 1) * limit };
    tab === "my" ? (_params.author = username) : (_params.favorited = username);
    const [profilesRes, articlesRes] = await Promise.all([
      getProfiles(username),
      getArticles(_params),
    ]);
    const { profile } = profilesRes;
    const { articlesCount, articles } = articlesRes;
    return {
      profile,
      username,
      tab,
      page,
      articlesCount,
      articles,
      limit,
    };
  },
  data() {
    return {
      disabled: false,
      loading: false,
      favoriteDisabled: false
    };
  },
  computed: {
    ...mapState(["user"]),
    isMyProfile() {
      return this.user.username === this.username;
    },
    isFollowing() {
      return this.profile.following;
    },
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
    async follow() {
      this.disabled = true;
      try {
        await followProfiles(this.username);
        this.profile.following = true;
      } catch (err) {}
      this.disabled = false;
    },
    async unfollow() {
      this.disabled = true;
      try {
        await unfollowProfiles(this.username);
        this.profile.following = false;
      } catch (err) {}
      this.disabled = false;
    },
  },
};
</script>

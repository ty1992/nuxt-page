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
        <div class="col-md-12">
          {{ article.body }}
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article" />
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form class="card comment-form">
            <div class="card-block">
              <textarea
                class="form-control"
                placeholder="Write a comment..."
                rows="3"
                v-model="textareaStr"
              ></textarea>
            </div>
            <div class="card-footer">
              <img :src="user.image" class="comment-author-img" />
              <button class="btn btn-sm btn-primary" @click.prevent="onSubmit">
                Post Comment
              </button>
            </div>
          </form>

          <div class="card" v-for="comment in comments" :key="comment.id">
            <div class="card-block">
              <p class="card-text">
                {{ comment.body }}
              </p>
            </div>
            <div class="card-footer">
              <nuxt-link class="comment-author" to="">
                <img :src="comment.author.image" class="comment-author-img" />
              </nuxt-link>
              &nbsp;
              <nuxt-link class="comment-author" to="">{{
                comment.author.username
              }}</nuxt-link>
              <span class="date-posted">{{ comment.createdAt }}</span>
              <!-- <span class="mod-options">
                <i class="ion-edit"></i>
                <i class="ion-trash-a"></i>
              </span> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { slugArticles } from "@/api/articles";
import { getComments, createComments } from "@/api/comments";
import ArticleMeta from "./components/ArticleMeta";
import { mapState } from "vuex";
export default {
  name: "ArticleInfo",
  async asyncData({ params }) {
    const { slug } = params;
    const [commentRes, articleRes] = await Promise.all([
      getComments(slug),
      slugArticles(slug),
    ]);
    const { comments } = commentRes;
    const { article } = articleRes;

    return {
      article,
      comments,
      slug,
    };
  },
  components: {
    ArticleMeta,
  },
  computed: {
    ...mapState(["user"]),
  },
  data() {
    return {
      textareaStr: "",
    };
  },
  methods: {
    async onSubmit() {
      if (this.textareaStr === "") return;
      try {
        const { comment } = await createComments(this.slug, {
          comment: { body: this.textareaStr },
        });
        this.comments.unshift(comment);
        this.textareaStr = "";
      } catch (error) {}
    },
  },
};
</script>

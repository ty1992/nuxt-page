<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages" v-if="errors">
            <div v-for="(value, field) in errors" :key="field">
              <li
                v-for="error in value"
                :key="error"
                class="ng-binding ng-scope"
              >
                {{ field }} {{ error }}
              </li>
            </div>
          </ul>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="str"
                  @keyup.enter="concatTag"
                />
                <div class="tag-list">
                  <span
                    v-for="(tag, index) in article.tagList"
                    :key="index"
                    class="tag-default tag-pill"
                  >
                    <i class="ion-close-round" @click="removeTag(index)"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="onSubmit"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticles, updataArticles, slugArticles } from "@/api/articles";
export default {
  name: "ArticleEdit",
  async asyncData({ query }) {
    const { slug } = query;
    let article = {
      body: "",
      description: "",
      tagList: [],
      title: "",
    };
    if (slug) {
      const data = await slugArticles(slug);
      article = data.article;
    }
    return {
      slug,
      article,
    };
  },
  data() {
    return {
      str: "",
      errors: {}
    };
  },
  methods: {
    async onSubmit() {
      try {
        let article = null
        if(this.slug){
          const data = await updataArticles(this.slug, {article: this.article});
          article = data.article
        }else{
          const data = await createArticles({article: this.article});
          article = data.article
        }
        this.$router.push(`/article/${article.slug}`)
      }catch(err){
        this.errors = err.response.data.errors;
      }
    },
    concatTag() {
      if(this.str === '') return
      this.article.tagList.push(this.str);
      this.str = "";
    },
    removeTag(index) {
      const { tagList } = this.article;
      this.article.tagList = tagList.filter((item, ind) => index !== ind);
    },
  },
};
</script>

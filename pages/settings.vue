<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  :disabled="disabled"
                  v-model="user.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  :disabled="disabled"
                  placeholder="Your Name"
                  v-model="user.username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  :disabled="disabled"
                  v-model="user.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  :disabled="disabled"
                  v-model="user.email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  :disabled="disabled"
                  placeholder="Password"
                  v-model="user.password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
const Cookie = process.client ? require("js-cookie") : undefined;
import { updateUser } from "@/api/user";
export default {
  middleware: "auth",
  name: "Settings",
  data() {
    return {
      user: {
        image: "",
        bio: "",
        email: "",
        username: "",
        password: "",
      },
      disabled: false,
      errors: {}
    };
  },
  computed: {
    ...mapState({
      storeUser: "user",
    }),
  },
  mounted() {
    for (let attr in this.user) {
      this.user[attr] = this.storeUser[attr];
    }
    // this
  },
  methods: {
    ...mapMutations(["setUser"]),
    async onSubmit() {
      this.disabled = true;
      try {
        const { user } = await updateUser({ user: this.user });
        Cookie.set("user", user);
        this.setUser(user);

        this.$router.push(`/profile/${user.username}`);
        // console.log(res);
      } catch (err) {
        this.errors = err.response.data.errors;
      }
      this.disabled = false;
    },
    logout() {
      Cookie.set("user", null);
      this.setUser(null);
      this.$router.replace("/");
    },
    // async logout () {
    //   const flag = await this.logout(null);
    //   flag && this.$router.replace('/login')
    // }
  },
};
</script>

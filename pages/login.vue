<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign in</h1>
          <p class="text-xs-center">
            <nuxt-link to="/register">Need an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onsubmit">
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="email"
                v-model="user.email"
                placeholder="Email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                v-model="user.password"
                placeholder="Password"
                required
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;
import { loginUser } from "@/api/user";
import { mapMutations } from "vuex";
export default {
  name: "Login",
  middleware: "nonauth",
  data() {
    return {
      user: {
        email: "546658991@qq.com",
        password: "12345678",
      },
      errors: [],
    };
  },

  methods: {
    ...mapMutations(["setUser"]),
    async onsubmit() {
      try {
        const { user } = await loginUser({ user: this.user });
        Cookie.set("user", user);
        this.setUser(user);
        this.$router.replace("/");
      } catch (err) {
        this.errors = err.response.data.errors;
      }
    },
  },
};
</script>

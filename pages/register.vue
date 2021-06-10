<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign up</h1>
          <p class="text-xs-center">
            <nuxt-link to="/login">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <!-- <li>That email is already taken</li> -->
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>

          <form>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="user.username"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Email"
                v-model="user.email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="user.password"
              />
            </fieldset>
            <button
              class="btn btn-lg btn-primary pull-xs-right"
              @click.prevent="onRegister"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerUser } from "@/api/user";
export default {
  name: "Login",
  middleware: "nonauth",
  data() {
    return {
      user: {
        email: "",
        unsrname: "",
        password: "",
      },
      errors: {},
    };
  },
  methods: {
    async onRegister() {
      try {
        const { user } = registerUser({ user: this.user });
        Cookie.set("user", user);
        this.$router.replace("/");
      }catch(err){
        this.errors = err.response.data.errors;
      }
    },
  },
};
</script>

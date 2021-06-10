import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _38f19d47 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _5b3ea235 = () => interopDefault(import('..\\pages\\register.vue' /* webpackChunkName: "pages/register" */))
const _3e3b2096 = () => interopDefault(import('..\\pages\\settings.vue' /* webpackChunkName: "pages/settings" */))
const _d6cc4b44 = () => interopDefault(import('..\\pages\\article\\edit.vue' /* webpackChunkName: "pages/article/edit" */))
const _33758449 = () => interopDefault(import('..\\pages\\article\\components\\AritcleComment.vue' /* webpackChunkName: "pages/article/components/AritcleComment" */))
const _3dfcfdfe = () => interopDefault(import('..\\pages\\article\\components\\ArticleMeta.vue' /* webpackChunkName: "pages/article/components/ArticleMeta" */))
const _3ea289e6 = () => interopDefault(import('..\\pages\\article\\_slug.vue' /* webpackChunkName: "pages/article/_slug" */))
const _12ce37fe = () => interopDefault(import('..\\pages\\profile\\_username.vue' /* webpackChunkName: "pages/profile/_username" */))
const _6f49fa30 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/login",
    component: _38f19d47,
    name: "login"
  }, {
    path: "/register",
    component: _5b3ea235,
    name: "register"
  }, {
    path: "/settings",
    component: _3e3b2096,
    name: "settings"
  }, {
    path: "/article/edit",
    component: _d6cc4b44,
    name: "article-edit"
  }, {
    path: "/article/components/AritcleComment",
    component: _33758449,
    name: "article-components-AritcleComment"
  }, {
    path: "/article/components/ArticleMeta",
    component: _3dfcfdfe,
    name: "article-components-ArticleMeta"
  }, {
    path: "/article/:slug?",
    component: _3ea289e6,
    name: "article-slug"
  }, {
    path: "/profile/:username?",
    component: _12ce37fe,
    name: "profile-username"
  }, {
    path: "/",
    component: _6f49fa30,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}

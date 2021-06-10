export default {
  // serverMiddleware: ['~/server-middleware/logger'],
  head:{
    title: 'realworld'
  },
  css: [
    '~/static/css/style.css'
  ],
  plugins:  ['~/plugins/request.js'],
  router: {
    linkActiveClass: 'active'
  },
  server: {
    port: 8080,
    host: '0.0.0.0'
  }

}
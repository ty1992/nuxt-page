const middleware = {}

middleware['auth'] = require('..\\middleware\\auth.js')
middleware['auth'] = middleware['auth'].default || middleware['auth']

middleware['logger'] = require('..\\middleware\\logger.js')
middleware['logger'] = middleware['logger'].default || middleware['logger']

middleware['nonauth'] = require('..\\middleware\\nonauth.js')
middleware['nonauth'] = middleware['nonauth'].default || middleware['nonauth']

export default middleware

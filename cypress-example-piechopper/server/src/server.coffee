config = require('./config').config

express     = require('express')
compression = require('compression')

server = express()
server.use(compression())
server.use(express.static('./build/served/'))

# The 404 Route (ALWAYS Keep this as the last route)
server.get '*', (req, res) ->
  res.sendfile('./build/served/error.html', 404)


server.listen(config.webServer.port)

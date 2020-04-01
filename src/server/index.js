console.log('[server] xmorphus server starting ~~~~~~~~~~~ ~~~~~ ~~ ~')

const express = require('express')
const app = express()
const log = require('./logger')(app)
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const config = require('../config')
const db = require('./database')


// server setup
app.use(
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  cookieParser(),
  cors(config.corsConf),
  express.static('public')
)

// setup routes
log.info('[routes] starting')
require('./routes')(app, log, db)

  // setup cron functions
  // require('./cronos')(db, log)

// setup weblistener
app.listen(config.PORT, () => {
  log.info(`\x1b[1m\x1b[32m[server] listening (${config.MODE} mode) on port ${config.PORT}\x1b[0m`)
})

module.exports = app

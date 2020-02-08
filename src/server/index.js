console.log('[server] xmorphus starting')

const express = require('express')
const app = express()
const db = require('../database')
const log = require('./logger')(app)
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const config = require('../config')

app.use(
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  cookieParser()
)

app.use(cors(config.corsConf))

app.use(express.static('public'))

// setup db
log.info('[database] starting')
db.init(log).then(() => {
  // setup login and signup
  let passport = require('../authentication')(app, log, db)

  // setup routes
  log.info('[routes] starting')
  require('./routes')(app, db, log, passport)

//   // setup cron
//   require('cronos')(db, log)

  // setup weblistener
  app.listen(config.PORT, () => {
    log.info(`\x1b[1m\x1b[32m[server] listening (${config.MODE} mode) on port ${config.PORT}\x1b[0m`)
  })
}).catch(e => console.log(e))

module.exports = app

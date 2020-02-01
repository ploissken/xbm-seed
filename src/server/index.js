console.log('[server] xmorphus starting')

const PORT = process.env.PORT || 9000
const MODE = process.env.NODE_ENV || 'development'
const express = require('express')
const app = express()
const db = require('../database')
const log = require('./logger')(app)
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
// const config = require('config')

const ALLOWED_ORIGINS = [
  'http://localhost:8081/',
  'http://cathanan.localhost/',
  'http://cathanan.localhost',
  'http://192.168.15.10:8081'
]

const corsConf = {
  credentials: true,
  origin: ALLOWED_ORIGINS
}

app.use(
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  cookieParser()
)

app.use(cors(corsConf))

// serve posterest as static html
// app.use(express.static('public'))
// log.info('[server] posterest served')

// setup db
log.info('[database] starting')
db.init(log).then(() => {
  // setup login and signup
  let passport = require('../authentication')(app, log, db)

  // setup routes
  log.info('[routes] starting')
  require('./routes')(app, db, log, passport)
  log.info('[routes] setup complete')

//   // setup cron
//   require('cronos')(db, log)


  // setup weblistener
  app.listen(PORT, () => {
    console.log(`\x1b[1m\x1b[32m[server] listening (${MODE} mode) on port ${PORT}\x1b[0m`)
    log.info(`\x1b[1m\x1b[32m[server] listening (${MODE} mode) on port ${PORT}\x1b[0m`)
  })
// })
}).catch(e => console.log(e))
// export app for eventually do tests
module.exports = app

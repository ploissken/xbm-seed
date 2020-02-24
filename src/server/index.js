console.log('[server] xmorphus server starting ~~~~~~~~~~~ ~~~~~ ~~ ~')

const express = require('express')
const app = express()
const log = require('./logger')(app)
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const config = require('../config')
// ORM connections

// MONGOOSE
// const db = require('../database/mongoose-connection') // mongo
// npm i mongoose --save
// run db.init().then =>

// SEQUELIZE
// const db = require('../database/sequelize-connection')(log) // postgres
// npm i pg pg-hstore sequelize --save


// server setup
app.use(
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  cookieParser(),
  cors(config.corsConf),
  express.static('public')
)

// setup db
// log.info('[database] starting')
// db.init(log).then(() => { // mongoose db
  // setup login and signup
  // let passport = require('../authentication')(app, log, db)

  // setup routes
  log.info('[routes] starting')
  require('./routes')(app,log)

  // setup cron functions
  // require('./cronos')(db, log)

  // setup weblistener
  app.listen(config.PORT, () => {
    log.info(`\x1b[1m\x1b[32m[server] listening (${config.MODE} mode) on port ${config.PORT}\x1b[0m`)
  })
// }).catch(e => console.log(e)) // mongoose db

module.exports = app

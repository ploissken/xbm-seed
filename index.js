console.log('[server] public-audio starting')

// setup environment variables
// require('dotenv').config()

const PORT = process.env.PORT || 9000
const MODE = process.env.NODE_ENV || 'development'
const express = require('express')
const app = express()
// const db = require('database')
// const log = require('logger')(app)
// const bodyParser = require('body-parser')
// const cors = require('cors')
// const cookieParser = require('cookie-parser')
// const config = require('config')

// app.use(
//   bodyParser.urlencoded({ extended: false }),
//   bodyParser.json(),
//   cookieParser()
// )

// app.use(cors(config.corsConf))

// serve posterest as static html
// app.use(express.static('public'))
// log.info('[server] posterest served')

// setup db
// log.info('[database] starting')
// db.init(log).then(() => {
//   // setup login and signup
//   let passport = require('signin')(app, log, db)
//
//   // setup routes
//   log.info('[routes] starting')
//   require('routes')(app, db, log, passport, config)
//   log.info('[routes] setup complete')
//
//   // setup cron
//   require('cronos')(db, log)

app.get('*', function (req, res) {
  res.json({ status: 'success', message: 'Hello World'})
})

  // setup weblistener
  app.listen(PORT, () => {
    console.log(`\x1b[1m\x1b[32m[server] listening (${MODE} mode) on port ${PORT}\x1b[0m`)
  })
// })

// export app for eventually do tests
module.exports = app

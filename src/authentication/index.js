const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const config = require('../config')

module.exports = function (app, logger, db) {
  logger.info('[authentication] module starting')

  // https://github.com/expressjs/session#options
  app.use(session({
    secret: config.cookie.secret,
    resave: false,
    saveUninitialized: false
  }))

  app.use(flash())
  app.use(passport.initialize())
  app.use(passport.session())
  require('./local-strategy')(passport, logger, db)

  logger.info('[authentication] module up and running')

  return passport
}

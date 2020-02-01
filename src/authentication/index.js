// gear up
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
// const config = require('config')

module.exports = function (app, logger, db) {
  logger.info('[authentication] module starting')

  // https://github.com/expressjs/session#options
  app.use(session({
    secret: 'here-goes-THE-secret-that-keeps-a-cookie-unique--important-stuff',
    resave: false,
    saveUninitialized: false
  }))

  app.use(flash())
  app.use(passport.initialize())
  app.use(passport.session())
  require('./local-strategy')(passport, logger, db)
  // require('./google-strategy')(passport, logger, db, config)
  // require('./fb-strategy')(passport, logger, db, config)

  logger.info('[authentication] module up and running')

  return passport
}

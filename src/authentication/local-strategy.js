const bcrypt = require('bcryptjs')
var LocalStrategy = require('passport-local').Strategy

module.exports = function (passport, logger, db) {
  passport.serializeUser(function (user, done) {
    logger.info('[local-login] serializing user')
    done(null, user._id)
  })

  passport.deserializeUser(function (usrId, done) {
    logger.info('[local-login] deserializing user')
    return db.User.findOne({ _id: usrId }).then(usr => {
      logger.info('[local-login] deserializing user success')
      done(null, usr)
    })
  })

  passport.use('local-login', new LocalStrategy({
    passReqToCallback: true
  },
  function (req, username, password, done) {
    logger.info('[local-login] process started')

    db.User.findOne({ username: username }).then((usr) => {
      if (!usr) {
        logger.info('[local-login] local login: unknown username')
        return done(null, false, { 'message': 'unknown username' })
      }

      if (!bcrypt.compareSync(password + usr.created.toString(), usr.password)) {
        logger.info('[local-login] local login: wrong password')
        return done(null, false, { 'message': 'wrong password' })
      }

      logger.info('[local-login] local login: success')
      logger.info(`[local-login] ${usr._id} logged in`)
      return done(null, usr)
    }).catch(err => {
      logger.error('[local-login] local login error')
      logger.error(err)
    })
  }
  ))

  passport.use('local-signup', new LocalStrategy({
    passReqToCallback: true
  },
  function (req, username, pwd, done) {
    logger.info('[local-signup] process started')

    db.User.findOne({ username: username }).then((usr) => {
      // username already registered
      if (usr) {
        logger.info(`[local-signup] local signup: username ${username} already in use`)
        return done(null, false, { 'message': 'username already registered' })
      }

      // username not taken. create new user
      if (!usr) {
        logger.info('[local-signup] creating new user')
        try {
          let wizard = require('./user-creation')
          let newUser = {
            username: username,
            password: pwd
          }
          wizard.createUser(db, logger, newUser).then(usr => {
            logger.info(`[local-signup] user created successfully ${usr._id}`)
            return done(null, usr)
          }).catch(err => {
            logger.error('[local-signup] wizard could not summon an user')
            logger.error(err)
          })
        } catch (e) {
          logger.error('[local-signup] random exception')
          logger.error(`[local-signup] ${e}`)
        }
      }
    }).catch(err => {
      logger.error('[local-signup] local signup error')
      logger.error(`[local-signup] ${err}`)
    })
  }
  ))
}

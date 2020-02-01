const bcrypt = require('bcryptjs')
var LocalStrategy = require('passport-local').Strategy

module.exports = function (passport, log, db) {
  passport.serializeUser(function (user, done) {
    log.info('[local-login] serializing user')
    done(null, user._id)
  })

  passport.deserializeUser(function (usrId, done) {
    log.info('[local-login] deserializing user')
    return db.User.findOne({ _id: usrId }).then(usr => {
      log.info('[local-login] deserializing user success')
      done(null, usr)
    })
  })

  passport.use('local-login', new LocalStrategy({
    passReqToCallback: true
  },
  function (req, username, password, done) {
    log.info('[local-login] process started')

    db.User.findOne({ username: username }).then((usr) => {
      if (!usr) {
        log.info('[local-login] local login: unknown username')
        return done(null, false, { 'message': 'unknown username' })
      }

      if (!bcrypt.compareSync(password + usr.created.toString(), usr.password)) {
        log.info('[local-login] local login: wrong password')
        return done(null, false, { 'message': 'wrong password' })
      }

      log.info('[local-login] local login: success')
      log.info(`[local-login] ${usr._id} logged in`)
      return done(null, usr)
    }).catch(err => {
      log.error('[local-login] local login error')
      log.error(err)
      throw err
    })
  }
  ))

  passport.use('local-signup', new LocalStrategy({
    passReqToCallback: true
  },
  function (req, username, pwd, done) {
    log.info('[local-signup] process started')

    db.User.findOne({ username: username }).then((usr) => {
      // username already registered
      if (usr) {
        log.info(`[local-signup] local signup: username ${username} already in use`)
        return done(null, false, { 'message': 'username already registered' })
      }

      // username not taken. create new user
      if (!usr) {
        log.info('[local-signup] creating new user')
        try {
          let wizard = require('./user-creation')
          let newUser = {
            username: username,
            password: pwd
          }
          wizard.createUser(db, log, newUser).then(usr => {
            log.info(`[local-signup] user created ${usr.username} successfully ${usr._id}`)
            return done(null, usr)
          }).catch(err => {
            log.error('[local-signup] wizard could not summon an user')
            log.error(err)
          })
        } catch (e) {
          log.error('[local-signup] random exception')
          log.error(`[local-signup] ${e}`)
        }
      }
    }).catch(err => {
      log.error('[local-signup] local signup error')
      log.error(`[local-signup] ${err}`)
    })
  }
  ))
}

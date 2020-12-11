const bcrypt = require('bcrypt')
const tokenizer = require('../tokenizer')

module.exports = function (app, log, db) {
  const doLogin = function (username) {
    return new Promise((resolve, reject) => {
      const selectFunctions = `select * from user_login where email = '${username}'`
      log.info(`querying: ${selectFunctions}`)
      db.query(selectFunctions).then(response => {
        resolve({
          status: 'ok',
          query: selectFunctions,
          message: 'query execution succeeded',
          result: response.rows
        })
      }).catch(err => {
        log.error(`db query error captured`)
        log.error(err.message)
        log.error(err.hint)
        resolve({
          status: 'error',
          query: selectFunctions,
          message: err.message,
          hint: err.hint,
        })
      })
    })
  }

  // login endpoint
  app.post('/login/', (req, res) => {
    if (!req.body.auth) {
      log.info('errrrrrr: Received an authentication request without authentication parameters')
      res.json({
        status: 'failure',
        message: 'no authentication provided'
      })
      return
    }
    const auth = JSON.parse(Buffer.from(req.body.auth, 'base64').toString())
    if (!auth.email || !auth.password) {
      log.info('errrrrrr: Received an authentication request without authentication parameters')
      res.json({
        status: 'failure',
        message: 'no authentication provided'
      })
      return
    }

    log.info('============ LOGIN STARTED ============')
    log.info(`user ${auth.email} is trying to login`)
    doLogin(auth.email).then(reply => {
      if (!reply.result.length) {
        log.info(`user ${auth.email} login failed: email not registered`)
        res.json({
          'status': 'failure',
          'message': `email ${auth.email} not registered`
        })
        return
      }
      let user = reply.result[0]
      bcrypt.compare(auth.password, user.password, function(err, passwordMatch) {
        // password match
        if (passwordMatch) {
          log.info(`user ${auth.email} login succeeded`)
          // generate new token
          let tokenObj = tokenizer.generate(user)
          // const persistTokenQuery = `insert into user_session (user_login, token, created_time, created_by) ` +
          delete user.password
          // persist token in database
          log.info(`querying: ${tokenObj.query}`)
          db.query(tokenObj.query).then(response => {
            res.json({
              'status': 'success',
              'user': user,
              'token': tokenObj.token
            })
          }).catch(err => {
            res.json({
              'status': 'error',
              'message': 'unable to persist access token'
            })
          })
        } else {
          log.info(`user ${auth.email} login failed: wrong password`)
          res.json({
            'status': 'failure',
            'message': 'wrong password'
          })
        }
        log.info('============ LOGIN COMPLETE ============')
      })
    }).catch(err => {
      log.info(err)
      res.send(err)
    })
  })

  app.post('/load-session/', (req, res, next) => tokenizer.validate(req, res, next), (req, res) => {
    log.info('/load-session/')
    const userQuery = tokenizer.getUserId(req.headers.authorization)
    db.query(userQuery).then(response => {
      let user = response.rows[0]
      delete user.password
      res.json({
        'status': 'success',
        'user': user,
        'token': req.headers.authorization
      })
      return
    }).catch(err => {
      log.info(err)
      res.json({
        'status': 'error',
        'message': 'token expired'
      })
    })
  })


  log.info('[login-routes] setup complete')
}

const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = function (app, log, db) {
  const doLogin = function (username) {
    return new Promise((resolve, reject) => {
      const selectFunctions = `select * from user_login where email = '${username}'`
      // const selectFunctions = `select nzl(2)`
      log.info(`querying: ${selectFunctions}`)
      db.query(selectFunctions).then(response => {
        // console.log(response)
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

  // user login
  app.post('/login/', (req, res) => {
    if (!req.body.auth) {
      log.info('errrrrrr: Received an authentication request without authentication parameters')
      res.json({
        status: 'failure',
        message: 'no authentication provided'
      })
      return
    }
    log.info('============ LOGIN STARTED ============')
    log.info(`user ${req.body.email} is trying to login`)
    const auth = JSON.parse(Buffer.from(req.body.auth, 'base64').toString())
    console.log('auth is', auth)
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
      console.log('================ user', user.password)
      bcrypt.compare(auth.password, user.password, function(err, result) {
        // result == true
        if (result) {
          log.info(`user ${auth.email} login succeeded`)
          delete user.password
          res.json({
            'status': 'success',
            'user': user
          })
        } else {
          log.info(`user ${auth.email} login failed: wrong password`)
          res.json({
            'status': 'failure',
            'message': 'wrong password'
          })
        }
      })
    }).catch(err => {
      console.log(err)
      res.send(err)
    }).finally (() => {
      console.log('============ LOGIN COMPLETE ============')
      return
    })
  })

  log.info('[login-routes] setup complete')
}

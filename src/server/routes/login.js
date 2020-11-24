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
    log.info('============ LOGIN STARTED ============')
    log.info(`user ${req.body.email} is trying to login`)

    doLogin(req.body.email).then(reply => {
      if (!reply.result.length) {
        log.info(`user ${req.body.email} login failed: email not registered`)
        res.json({
          'status': 'failure',
          'message': `email ${req.body.email} not registered`
        })
        return
      }
      let user = reply.result[0]
      console.log('================ user', user.password)
      bcrypt.compare(req.body.password, user.password, function(err, result) {
        // result == true
        if (result) {
          log.info(`user ${req.body.email} login succeeded`)
          delete user.password
          res.json({
            'status': 'success',
            'user': user
          })
        } else {
          log.info(`user ${req.body.email} login failed: wrong password`)
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

const jwt = require('jsonwebtoken')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const config = require('../config')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('pt-BR')
dayjs.tz.setDefault("America/Sao_Paulo")

const getUserId = function (tok) {
  try {
    const decoded = jwt.verify(tok, config.secrets.sessionSecret)
    return `select * from user_login where id = '${decoded.userId}'`
  } catch (err) {
    return 'UNABLE_TO_DECODE_USER_ID'
  }
}

const validate = function (req, res, next) {
  console.log('started validating token')
  try {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, config.secrets.sessionSecret)
    const dateNow = dayjs().tz('America/Sao_Paulo')
    const tokenValidTo = dayjs(decoded.validTo)
    if (dateNow.unix() < tokenValidTo.unix()) {
      next()
    } else {
      res.json({
        'status': 'error',
        'message': 'token expired'
      })
    }
  } catch (err) {
    console.log('::::: errrrr', err)
    res.json({
      'status': 'error',
      'message': 'token expired'
    })
    return err
  }
}

const generate = function (user) {
  let token = jwt.sign({
    userId: user.id,
    validTo: dayjs().tz('America/Sao_Paulo').add(1, 'day').format()
  }, config.secrets.sessionSecret)
  return {
    token: token,
    query: `insert into user_session (user_login, token, created_time, created_by) ` +
      `values (${user.id}, '${token}', '${dayjs().format()}', ${user.id})`
  }
}

module.exports = {
  getUserId,
  validate,
  generate
}

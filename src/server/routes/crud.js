const tokenizer = require('../tokenizer')

const error = {
  PARAM_MISS: {
    status: 'error',
    message: 'missing parameter: function'
  }
}

module.exports = function (app, log, db) {

  // requests without parameter return error
  app.get('/magic/', (req, res, next) => tokenizer.validate(req, res, next),
    (req, res) => { res.json(error.PARAM_MISS) })
  app.post('/magic/', (req, res, next) => tokenizer.validate(req, res, next),
    (req, res) => { res.json(error.PARAM_MISS) })
  app.delete('/magic/', (req, res, next) => tokenizer.validate(req, res, next),
    (req, res) => { res.json(error.PARAM_MISS) })

const doRequest = function (method, func, stringObj) {
  return new Promise((resolve, reject) => {
    const selectFunctions = `select ${method}('${func}'::text, '${stringObj}'::jsonb)`
    // const selectFunctions = `select nzl(2)`
    log.info(`============ QUERY ============`)
    log.info(selectFunctions)
    db.query(selectFunctions).then(response => {
      log.info(`============ QUERY RETURNED ${ (response.rows || []).length } ROWS ============`)
      resolve({
        status: 'ok',
        query: selectFunctions,
        message: 'query execution succeeded',
        result: response.rows
      })
    }).catch(err => {
      log.error(`============ QUERY FAILED ============`)
      log.error(err.message)
      console.log(error)
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

  // crud get
  app.get('/magic/:function/', (req, res, next) => tokenizer.validate(req, res, next), (req, res) => {
    console.log('GOT A GET', req.params)
    doRequest('db_get', req.params.function, JSON.stringify(req.query)).then(resu => {
      if(resu.status === 'ok') {
        console.log('resu', resu.result[0].db_get)
        res.json(resu.result[0].db_get)
      } else {
        res.json(resu)
      }
    })
  })

  // crud post
  app.post('/magic/:function/', (req, res, next) => tokenizer.validate(req, res, next), (req, res) => {
    console.log('req.body', req.body)
    doRequest('db_post', req.params.function, JSON.stringify(req.body)).then(resu => {
      res.json(resu)
    })
  })

  // crud delete
  app.delete('/magic/:function/', (req, res, next) => tokenizer.validate(req, res, next), (req, res) => {
    doRequest('db_remove', req.params.function, JSON.stringify(req.query)).then(resu => {
      res.json(resu)
    })
  })

  log.info('[crud-routes] setup complete')
}

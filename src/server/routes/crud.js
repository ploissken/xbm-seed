module.exports = function (app, log, db) {

  // requests without parameter return error
  app.get('/magic/', (req, res) => { res.json({ status: 'error', message: 'missing parameter: function' }) })
  app.post('/magic/', (req, res) => { res.json({ status: 'error', message: 'missing parameter: function' }) })
  app.delete('/magic/', (req, res) => { res.json({ status: 'error', message: 'missing parameter: function' }) })

const doRequest = function (method, func, stringObj) {
  return new Promise((resolve, reject) => {
    const selectFunctions = `select ${method}('${func}'::varchar, '${stringObj}'::jsonb)`
    // const selectFunctions = `select nzl(2)`
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

  // crud get
  app.get('/magic/:function/', (req, res) => {
    doRequest('db_get', req.params.function, JSON.stringify(req.query)).then(resu => {
      res.json(resu)
    })
  })

  // crud post
  app.post('/magic/:function/', (req, res) => {
    doRequest('db_create', req.params.function, JSON.stringify(req.query)).then(resu => {
      res.json(resu)
    })
  })

  // crud delete
  app.delete('/magic/:function/', (req, res) => {
    doRequest('db_remove', req.params.function, JSON.stringify(req.query)).then(resu => {
      res.json(resu)
    })
  })

  log.info('[routes] setup complete')
}

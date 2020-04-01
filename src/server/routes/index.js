module.exports = function (app, log, db) {
  // require('./OTHERROUTES')(app, log)

  // hello world (:)
  app.get('/hello', (req, res) => {
    res.json({ 'message': 'Hello World!' })
  })

  app.get('/table/:tableName', (req, res) => {
    console.log(req.params)
    db.query(`SELECT * FROM ${req.params.tableName}`).then(response => {
      res.json(response.rows)
    }).catch(err => {
      res.json({status: 'error', message: err.message})
    })
  })

  // 404
  app.get('*', function (req, res) {
    console.log('404')
    res.status(404).json({ status: 'failure', message: '404 - not found'})
  })

  log.info('[routes] setup complete')

}

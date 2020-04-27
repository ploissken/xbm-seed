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

  app.get('/tables', (req, res) => {
    const selectTableNames = `SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'public'`
    console.log('/tables', selectTableNames)
    db.query(selectTableNames).then(response => {
      console.log(`then`)
      res.json(response.rows)
    }).catch(err => {
      console.log(`catch`)
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

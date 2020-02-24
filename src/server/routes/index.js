module.exports = function (app, log) {
  // require('./OTHERROUTES')(app, log)

  // hello world (:)
  app.get('/hello',
    (req, res) => {
      res.json({ 'message': 'Hello World!' })
    }
  )

  // 404
  app.get('*', function (req, res) {
    console.log('404')
    res.status(404).json({ status: 'failure', message: '404 - not found'})
  })

  log.info('[routes] setup complete')

}

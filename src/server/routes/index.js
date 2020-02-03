module.exports = function (app, db, log, passport) {

  require('./user')(app, db, log, passport)
  require('./voting')(app, db, log, passport)

  // 404
  app.get('*', function (req, res) {
    console.log('404')
    res.status(404).json({ status: 'failure', message: 'not found'})
  })

}

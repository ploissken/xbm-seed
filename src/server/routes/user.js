// multer middleware helps handling image uploads
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatar/')
  },
  filename: function (req, file, cb) {
    console.log(`filename filnemae`, file)
    cb(null, Date.now() + '.jpg')
  }
})
const upload = multer({ storage: storage })

module.exports = function (app, db, log, passport) {

  // perform login
  app.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (e, user, info) => {
      log.info('[local-login] local login complete')
      if (e) {
        log.error(`[local-login] error`)
        log.error(`[local-login] ${JSON.stringify(e)}`)
        return next(e)
      }
      if (user) {
        return res.status(200).json(user)
      }
      if (info) {
        log.info(`[local-login] something went wrong`)
        log.info(`[local-login] ${JSON.stringify(info)}`)
        console.log(info)
        return res.status(403).json(JSON.stringify(info))
      }
    })(req, res, next)
  })

  // create new user
  app.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (e, user, info) => {
      log.info('[local-signup] local signup complete')
      if (e) {
        log.error(`[local-signup] error`)
        log.error(`[local-signup] ${JSON.stringify(e)}`)
        return next(e)
      }
      if (user) {
        return res.status(200).json(user)
      }
      if (info) {
        log.info(`[local-signup] something went wrong`)
        log.info(`[local-signup] ${JSON.stringify(info)}`)
        return res.status(403).json(info)
      }
    })(req, res, next)
  })

  // retrieve user profile if logged in
  app.get('/profile', (req, res) => {
    log.info(`[profile] request`)
    if (req.body.user) {
      log.info(`[profile] user id ${req.body.user._id}`)
      db.User.findOne({ _id: req.body.user._id }).then(usr => {
        return res.status(200).json(usr)
      })
    } else {
      log.info(`[profile] request without authentication`)
      return res.status(403).json({ message: 'you are not logged in' })
    }
  })


  // update avatar picture
  app.post('/update-avatar', upload.single('file'), function (req, res, next) {
    const usr = JSON.parse(req.body.user)
    db.User.updateOne({ _id: usr._id }, { avatar_path: 'avatar/' + req.file.filename}).then(resu => {
      return res.json({
        ...usr,
        avatar_path: 'avatar/' + req.file.filename
      })
    }).catch(err => {
      log.error(err.message)
      return res.status(500).json({ message: `Error: ${err.message}` })
    })
  })

  // update profile information
  app.post('/update', (req, res) => {
    const updtUser = { ...req.body }
    db.User.updateOne({ _id: updtUser._id }, { ...updtUser }).then(resu => {
      return res.json({ ...updtUser })
    }).catch(err => {
      log.error(err.message)
      return res.status(500).json({ message: `Error: ${err.message}` })
    })
  })

  app.get('/logout', (req, res) => {
    console.log(req.body.user)
    if (req.body.user) {
      log.info(req.body.user._id + ' logged out')
      req.logout()
      return res.status(200).json({ message: 'you logged out' })
    } else {
      req.logout()
      return res.status(200).json({ message: 'you were not even logged' })
    }
  })
}

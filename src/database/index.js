const mongoose = require('mongoose')
let db = {}

db.init = async function (log) {
  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://moongo:5442/xm', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    }).then(() => {
      log.info('[database] mongo connected successfully')
      resolve()
    }).catch(e => {
      log.error('[database] mongo connection failure')
      reject(e)
    })
  })
}

db.Vote = mongoose.model('Vote', {
  'voter_id': String,
  'candidate_id': String,
  'created': Date
})

db.User = mongoose.model('User', {
  'username': { type: String, unique: true, dropDups: true },
  'password': String,
  'created': Date,
  'avatar_path' : String
})

module.exports = db

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
//
// db.News = mongoose.model('News', {
//   'href': { type: String, unique: true, dropDups: true },
//   'title': String,
//   'time': Date,
//   'ranking': { type: Array, 'default': [] },
//   'img': String
// })
//
// db.Insta = mongoose.model('Instagram', {
//   'user_info': { profile_pic: String, user_name: String },
//   'url': String,
//   'comments': Number,
//   'likes': Number,
//   'img': String,
//   'uid': { type: String, unique: true, dropDups: true },
//   'time': Date,
//   'ranking': { type: Array, 'default': [] },
//   'caption': String
// })
//
// db.User = mongoose.model('User', {
//   'username': { type: String, unique: true, dropDups: true },
//   'password': String,
//   'created': Date,
//   'google_id': { type: String, unique: true, dropDups: true, required: false },
//   'fb_id': { type: String, unique: true, dropDups: true, required: false },
//   'token': String,
//   'refresh': String,
//   'social_name': String,
//   'gmail': { type: String, unique: true, dropDups: true, required: false }
// })
//
// db.Prefs = mongoose.model('Prefs', {
//   'uid': String,
//   'darkmode': Boolean,
//   'listview': Boolean,
//   'minimal': Boolean,
//   'filterSources': { type: Array, 'default': [] }
// })
//
// db.Favorite = mongoose.model('Fav', {
//   'uid': String,
//   'nid': String
// })

module.exports = db

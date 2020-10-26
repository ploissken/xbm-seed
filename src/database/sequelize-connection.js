'use strict'

var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var basename = path.basename(__filename)

var db = {}

module.exports = (logger) => {
  logger.info('[database] module starting')

  var sequelize = new Sequelize('postgres://xmo-user:xmo-1337_##-pass@txto.com.br:5454/xmo-db')
  sequelize.authenticate().then(() => {
      logger.info('[database] \x1b[1m\x1b[34m Sequelize connected successfully \x1b[0m')
    }).catch(err => {
      logger.error('[database] Unable to connect to the database:', err)
    })

  // read and link models from folder (as sample-sequelize-model.js)
  // fs.readdirSync(__dirname).filter(file => {
  //     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  //   }).forEach(file => {
  //     var model = sequelize['import'](path.join(__dirname, file))
  //     db[model.name] = model
  //   })
  //
  // Object.keys(db).forEach(modelName => {
  //   if (db[modelName].associate) {
  //     db[modelName].associate(db)
  //   }
  // })

  db.sequelize = sequelize
  db.Sequelize = Sequelize

  db.sequelize.sync()

  // sampling stabilishing ORM relations
  // db.User.hasOne(db.UserPrefs)
  // db.User.hasMany(db.Post)
  // db.Post.belongsTo(db.User)

  logger.info('[database] module up and running')

  return db
}

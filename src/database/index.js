// 'use strict'
//
// const fs = require('fs')
// const path = require('path')
// const Sequelize = require('sequelize')
// const basename = path.basename(__filename)
// const db = {}
//
// module.exports = (logger) => {
//   logger.info('[database] module starting')
//
//   let sequelize = new Sequelize('postgres://db_user:secure_db_password@xmdb:5432/xm_db')
//   sequelize.authenticate().then(() => {
//     logger.info('[database] \x1b[1m\x1b[34m Sequelize connected successfully \x1b[0m')
//   }).catch(err => {
//     logger.error('[database] Unable to connect to the database:', err)
//   })
//
//   fs.readdirSync(__dirname).filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
//   }).forEach(file => {
//     let model = sequelize['import'](path.join(__dirname, file))
//     db[model.name] = model
//   })
//
//   Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//       db[modelName].associate(db)
//     }
//   })
//
//   db.sequelize = sequelize
//   db.Sequelize = Sequelize
//
//   db.sequelize.sync()
//
//   // TODO: create some db-relations.js for grouping up these model relations
//   db.User.hasMany(db.Post)
//   db.Post.belongsTo(db.User)
//   db.User.hasOne(db.Chart, { as: 'MyChart', foreignKey: 'user_id' })
//   db.User.hasMany(db.Chart, { as: 'Charts', foreignKey: 'owner_id' })
//   db.User.hasMany(db.Badge)
//   db.User.hasOne(db.ActCounter)
//   db.Chart.belongsTo(db.User)
//   db.User.hasOne(db.UserGoogle)
//   db.User.hasOne(db.UserFb)
//   db.User.hasOne(db.UserPrefs)
//   db.UserGoogle.belongsTo(db.User)
//   db.UserFb.belongsTo(db.User)
//   db.UserPrefs.belongsTo(db.User)
//   db.Badge.belongsTo(db.User)
//   db.ActCounter.belongsTo(db.User)
//   db.Chart.hasMany(db.AstroObj)
//   db.AstroObj.belongsTo(db.Chart)
//
//   logger.info('[database] module up and running')
//
//   return db
// }

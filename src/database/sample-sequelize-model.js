
'use strict'

var bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('User', {
  user_name: DataTypes.STRING,
  password: DataTypes.STRING,
  user_email: DataTypes.STRING,
  user_info: DataTypes.JSON
}, { underscored: true })

// password methods
User.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

User.verifyPassword = (password, usrPassword) => {
  return bcrypt.compareSync(password, usrPassword)
}

return User
}

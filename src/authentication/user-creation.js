const bcrypt = require('bcryptjs')
let userWizard = {}

userWizard.createUser = function (db, logger, newUser) {
  return new Promise(async function (resolve, reject) {
    logger.info(`[user-creation] user-creation started`)
    try {
      let user = {
        username: newUser.username,
        password: '',
        created: new Date(),
        avatar_path: ''
      }

      user.password = bcrypt.hashSync(newUser.password + user.created.toString(), bcrypt.genSaltSync(8), null)

      // persist the new user
      db.User.create(user).then(usr => {
        logger.info(`[user-creation] creation success: new user id ${usr._id}`)
        resolve(usr)
      }).catch(e => {
        logger.error(`[user-creation] db.User.create error`)
        logger.error(`[user-creation] ${e}`)
        reject(e)
      })

    } catch (e) {
      logger.error(`[user-creation] ${e}`)
      reject(e)
    }
  })
}

module.exports = userWizard

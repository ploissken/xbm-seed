const moment = require('moment-timezone')
const tools = require('../../tools/voting-tools')
moment.locale('pt-br')

module.exports = function (app, db, log, passport) {
  // return all users (eligible as lunch's king)
  app.get('/candidates', (req, res) => {
    db.User.find({}).then(users => {
      return res.status(200).json(users)
    }).catch(err => {
      log.error(err.message)
      res.status(500).json({ message: `Error: ${err.message}` })
    })
  })

  app.post('/cast-vote', (req, res) => {
    if (req.body.candidate_id) {
      db.Vote.create({
        candidate_id: req.body.candidate_id,
        voter_id: req.body.voter_id,
        created: new Date()
      }).then(vote => {
        res.json(vote)
      }).catch(err => {
        log.error(err.message)
        res.status(500).json({ message: `Error: ${err.message}` })
      })
    }
  })

  app.get('/get-winner', (req, res) => {
    // get all candidates
    db.User.find().then(users => {
      // get votes from last 6 months
      db.Vote.find({
        created: {
          $gte: moment().subtract(6, 'months'),
          $lt: moment().tz("America/Sao_Paulo").endOf('day').utc()
        }
      }).then(votes => {
        const result = tools.parseVotes(votes, users)
        res.json(result)
      }).catch(err => {
        log.error(err.message)
        res.status(500).json({ message: `Error: ${err.message}` })
      })
    })
  })
}

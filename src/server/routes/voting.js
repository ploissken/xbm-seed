const moment = require('moment-timezone')
const tools = require('../../tools/voting-tools')
moment.locale('pt-br')

module.exports = function (app, db, log, passport) {
  // return all users (eligible as lunch's king)
  app.get('/candidates', (req, res) => {
    db.User.find({}).then(users => {
      console.log('candidates', users)
      return res.status(200).json(users)
    })
  })

  app.post('/cast-vote', (req, res) => {
    console.log('req.body', req.body)
    if (req.body.candidate_id) {
      db.Vote.create({
        candidate_id: req.body.candidate_id,
        voter_id: req.body.voter_id,
        created: new Date()
      }).then(vote => {
        console.log('created vote', JSON.stringify(vote))
        res.json(vote)
      })
    }
  })

  app.get('/get-winner', (req, res) => {
    console.log('req.body', req.body)
    // today
    console.log(moment().tz("America/Sao_Paulo").format('lll'))
    // search time period
    db.Vote.find({
      created: {
        $gte: moment().subtract(7, 'days'), // 7 days
        // $gte: moment().tz("America/Sao_Paulo").startOf('day').utc(), // today
        $lt: moment().tz("America/Sao_Paulo").endOf('day').utc()
      }
    }).then(results => {
      const result = tools.parseVotes(results)

      console.log('result ', result )
      // res.json(result)

      // console.log(results.reduce(r => r.candidate_id))
      db.User.find({
        _id: { $in: Object.keys(result.votedCandidates) }
      }).then(allEverVoted => {
        const response = {
          candidates: allEverVoted,
          dailyResults: result
        }
        res.json(response)
      }).catch(err => {
        console.log(err)
      })
    // })

  })
})
}

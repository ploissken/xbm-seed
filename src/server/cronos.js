
const moment = require('moment-timezone')
moment.locale('pt-br')

module.exports = function (db, log) {
  log.info('[cronos] starting')

  // setup cron to run everyday 12:03
  var CronJob = require('cron').CronJob
  // eslint-disable-next-line no-new
  new CronJob('00 03 12 * * *', function () {
    log.info('[cronos] woke up, looking for todays king')
    db.Vote.find({
      created: {
        $gte: moment().tz("America/Sao_Paulo").startOf('day').utc(),
        $lt: moment().tz("America/Sao_Paulo").endOf('day').utc()
      }
    }).then(votes => {
      // grab today's votes and count them
      let votesPerCandidate = {}
      votes.forEach(v => {
        if (!votesPerCandidate[v.candidate_id]) {
          votesPerCandidate[v.candidate_id] = 0
        }
        votesPerCandidate[v.candidate_id] += 1
      })
      votesPerCandidate = Object.keys(votesPerCandidate).map(cand => {
        return {
          _id: cand,
          votes: votesPerCandidate[cand]
        }
      }).sort((a, b) => b.votes - a.votes)

      // grab today's winner and send him/her an email
      db.User.findOne({ _id: votesPerCandidate[0]._id}).then(user => {
        let mail = require('./mailgun')(log)
        mail.sendMail(user.username)
      })
    })

  }, null, true, 'America/Sao_Paulo')

  log.info('[cronos] module up and running')
}

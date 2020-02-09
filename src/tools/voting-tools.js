const moment = require('moment-timezone')

module.exports = {
  parseVotes(votes, allCandidates) {
    // prepare vote data before composing answer
    const mappedVotes = votes.map(vote => {
      return {
        ...vote._doc,
        week: moment(vote.created).tz("America/Sao_Paulo").format('w'),
        date: moment(vote.created).tz("America/Sao_Paulo").format('l'),
        weekDay: moment(vote.created).tz("America/Sao_Paulo").format('E')
      }
    }).sort((a,b) => { a.week - b.week })

    // group votes as { weekNumber: { weekDay: [ votesAtThatDay ] } }
    let result = {}
    mappedVotes.forEach(vote => {
      if (!result[vote.week])
        result[vote.week] = {}
      if (!result[vote.week][vote.weekDay])
        result[vote.week][vote.weekDay] = []
      result[vote.week][vote.weekDay].push(vote)
    })

    const totalPerWeek = {}
    const winnersPerWeek = {}

    // count votes for each candidate
    Object.keys(result).forEach(weekNumber => {
      const weekTotals = {}
      let weekWinners = []
      Object.keys(result[weekNumber]).map(weekDay => {
        let votingTotals = result[weekNumber][weekDay].reduce((acc, vote) => {
          let cId = vote.candidate_id
          if (!acc[cId]) acc[cId] = []
          acc[cId].push(vote)
          return acc
        })
        const votationDate = result[weekNumber][weekDay][0].created
        // save vote results both daily and weekly
        const candidateResult = allCandidates
          .filter(c => new Date(c.created) <= new Date(votationDate))
          .map(c => {
            const candVotes = votingTotals[c._doc._id]
            if (!weekTotals[c._doc._id]) weekTotals[c._doc._id] = 0
            weekTotals[c._doc._id] += candVotes ? candVotes.length : 0
            return {
              ...c._doc,
              password: undefined,
              votes: candVotes ? candVotes.length : 0
            }
          }).sort((a, b) => b.votes - a.votes)

        // get most and least voted of the day
        const winners = candidateResult.filter(c => c.votes === candidateResult[0].votes)
        const loosers = candidateResult.reverse().filter(c => c.votes === candidateResult[0].votes)
        result[weekNumber][weekDay] = { winners: winners, loosers: loosers }
        weekWinners = [ ...weekWinners, ...winners ]
      })

      totalPerWeek[weekNumber] = Object.keys(weekTotals).map(e => {

        return {
          _id: e,
          kingOfDay: weekWinners.filter(w => w._id + '' === e + '').length,
          weekVotes: weekTotals[e]
        }
      }).sort((a, b) => b.weekVotes - a.weekVotes)
      winnersPerWeek[weekNumber] = weekWinners
    })

    // compose response for easy frontend rendering
    const mapped = Object.keys(result).map(weekNumber => {
      return {
        weekNumber: weekNumber,
        weekResult: {
          winners: totalPerWeek[weekNumber].sort((a, b) => b.kingOfDay - a.kingOfDay)
            .filter(c => c.kingOfDay === totalPerWeek[weekNumber][0].kingOfDay)
            .map(c => { return { ...allCandidates.filter(cand => cand._id + '' === c._id  + '')[0]._doc, ...c } } ),
          leastVoted: totalPerWeek[weekNumber].reverse()
            .filter(c => c.weekVotes === totalPerWeek[weekNumber][0].weekVotes)
            .map(c => { return { ...allCandidates.filter(cand => cand._id + '' === c._id  + '')[0]._doc, ...c } } ),

        },
        dailyResults: Object.keys(result[weekNumber]).map(weekDay => {
          return {
            weekDay: weekDay,
            results: result[weekNumber][weekDay]
          }
        })
      }
    })
    return mapped
  }
}

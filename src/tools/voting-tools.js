const moment = require('moment-timezone')

module.exports = {
  parseVotes(results) {
    // const count = {}
    const dates = {}
    const votesPerDay = []
    let votedCandidates = {}
    results.forEach(r => {
      const strDate = moment(r.created).tz("America/Sao_Paulo").format('l') + ''
      dates[strDate] = dates[strDate]
        ? dates[strDate] = [ ...dates[strDate], { ...r._doc }]
        : dates[strDate] = [{ ...r._doc }]
    })

    // get election results per day
    for (let day in dates) {
      if (dates.hasOwnProperty(day)) {
        const dayVoteCount = {}
        const votesPerCandidate = []
        dates[day].forEach(vote => {
          dayVoteCount[vote.candidate_id] = dayVoteCount[vote.candidate_id]
            ? dayVoteCount[vote.candidate_id] + 1
            : 1
        })
        for (let candidate in dayVoteCount) {
          if (dayVoteCount.hasOwnProperty(candidate)) {
            votesPerCandidate.push({
              candidate_id: candidate,
              votes: dayVoteCount[candidate]
            })
          }
        }
        votesPerDay.push({
          day: day,
          votesPerCandidate: votesPerCandidate.sort((a, b) => b.votes - a.votes)
        })
        votedCandidates = {
          ...votedCandidates,
          ...dayVoteCount
        }
      }
    }
    return {
      votesPerDay: votesPerDay,
      votedCandidates: votedCandidates
    }
  }
}

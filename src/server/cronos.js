// module.exports = function (db, log) {
//   log.info('[cronos] starting')
//
//   // setup cron to run everyday 12:03
//   var CronJob = require('cron').CronJob
//   // eslint-disable-next-line no-new
//   new CronJob('00 03 12 * * *', function () {
//     log.info('[cronos] woke up, executing ACTION')
//     // DO: ACTION
//   }, null, true, 'America/Sao_Paulo')
//
//   log.info('[cronos] module up and running')
// }

// gear up
const path = require('path')
const fs = require('fs')
const c = {
  clear: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  blink: '\x1b[5m',

  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

const morgan = require('morgan')

const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf } = format

// TODO: remember to remove the last comma when dealing with
// this as a json
const combinedFormat = printf(info => {
  return `{'timestamp': '${info.timestamp}', '${info.level}': '${info.message}'},`
})

const consoleFormat = printf(info => {
  return `{'${info.level}': '${info.message}'},`
})

module.exports = function (app) {
  // morgan to log access requests
  let currTime = new Date().toISOString().substring(0, 10)
  let accessLogStream = fs.createWriteStream(path.join(__dirname, '../../logs/' + currTime + '-axs.log'), { flags: 'a' })
  app.use(morgan('combined', { stream: accessLogStream, immediate: true }))

  // winston to log errors, infos and warnings
  let logger = createLogger({
    format: combine(
      timestamp(),
      combinedFormat
    ),
    transports: [
      new transports.File({
        filename: path.join(__dirname, '../../logs/' + currTime + '-err.log'),
        level: 'error' }),
      new transports.File({
        filename: path.join(__dirname, '../../logs/' + currTime + '-all.log')
      })
    ],
    exceptionHandlers: [
      new transports.File({
        filename: path.join(__dirname, '../../logs/' + currTime + '-expt.log') }),
      new transports.Console({ format: format.simple() })
    ],
    exitOnError: false
  })

  // echo logger messages in console
  logger.add(new transports.Console({
    format: combine(consoleFormat),
    level: 'debug'
  }))

  console.log(`${c.magenta}   ${'┌─┐┌─┐┬─┐'}${c.magenta}${'┬  ┬'}${c.magenta}${'┌─┐┬─┐'}   ${'┌─┐┌┬┐┌─┐┬─┐┌┬┐┬┌┐┌┌─┐'} ${c.clear}`)
  console.log(`${c.cyan}   ${'└─┐├┤ ├┬┘'}${c.cyan}${'└┐┌┘'}${c.cyan}${'├┤ ├┬┘'}   ${'└─┐ │ ├─┤├┬┘ │ │││││ ┬'} ${c.clear}`)
  console.log(`${c.magenta}   ${'└─┘└─┘┴└─'}${c.magenta}${' └┘ '}${c.magenta}${'└─┘┴└─'}   ${'└─┘ ┴ ┴ ┴┴└─ ┴ ┴┘└┘└─┘'} ${c.clear}`)

  logger.info('[logger] (' + currTime + ') module up and running')

  return logger
}

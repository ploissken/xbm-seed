const config = require('../config')
const mailgun = require('mailgun-js')({
  apiKey: config.mailgunConf.API_KEY,
  domain: config.mailgunConf.DOMAIN
})

module.exports = function (logger) {
	logger.info('[mailgun] sendmail process started')
	let postOffice = {}

	postOffice.sendMail = function (detination) {

		var data = {
		  from: 'REI DO ALMOÇO <rodrigo@txto.com.br>',
		  to: detination,
		  subject: '👑 Parabéns, rei do Almoço!',
	      text: 'Você foi eleito rei do almoço hoje. Bom trabalho!',
	      html: 'Você foi eleito rei do almoço hoje. Bom trabalho!'
		}

		mailgun.messages().send(data, function (error, body) {
	  	logger.info('[mailgun] ' + JSON.stringify(data))
	  	logger.info('[mailgun] ' + JSON.stringify(body))
	  	if(error) {
	  	  logger.error(error)
	  	} else {
	  		logger.info('[mailgun] no errors, mail possibly sent (:')
	  	}
		})
	}

	return postOffice

}

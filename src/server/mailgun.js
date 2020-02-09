var api_key = '0ad23bd3a8e9ac1f9bd6f9a1d084ab86-3b1f59cf-5423fff5'
var domain = 'txto.com.br'
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain})

// function htmlContent(content, logger) {
//     logger.info('[MAILGUN] raw msg content')
//     logger.info('[MAILGUN] ' + JSON.stringify(content))
//
//     let html =
//         '<b>Nome</b>: ' + content.name + '<br>' +
//         '<b>email</b>: ' + content.sender + '<br>' +
//         '<b>Telefone</b>: ' + content.phone + '<br>' +
//         '<b>Mensagem</b>: ' + content.message
//
//         return html
//
// }


// let mail = require('../server/mailgun')(logger)
// mail.sendMail(req.body)

module.exports = function (logger) {

	logger.info('[MAILGUN] sendmail process started')
	let postOffice = {}

	postOffice.sendMail = function (content) {

		var data = {
		  from: 'REI DO ALMOçO <rodrigo@txto.com.br>',
		  to: 'ploissken@gmail.com',
		  subject: 'Parabéns, rei do Almoço!',
	      text: 'olar',// htmlContent(content, logger),
	      html: 'olar' //htmlContent(content, logger)
		}

		mailgun.messages().send(data, function (error, body) {
		  	logger.info('[MAILGUN] ' + JSON.stringify(data))
		  	logger.info('[MAILGUN] ' + JSON.stringify(body))
		  	if(error) {
		  		logger.error(error)
		  	} else {
		  		logger.info('[MAILGUN] no errors, mail possibly sent (:')
		  	}
		  	console.log(error)
		})

	}

	return postOffice

}

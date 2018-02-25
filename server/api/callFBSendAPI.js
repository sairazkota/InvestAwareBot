/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
const
	config = require("./../config.js"),
	log = require('../behaviours/logger.js'),
	request = require('request');
const PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;

function callSendAPI(messageData) {
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: PAGE_ACCESS_TOKEN
		},
		method: 'POST',
		json: messageData
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var recipientId = body.recipient_id;
			var messageId = body.message_id;

			if (messageId) {
				//log.info("Successfully sent message with id %s to recipient %s",messageId, recipientId);
			} else {
				//log.info("Successfully called Send API for recipient %s",recipientId);
			}
		} else {
			log.error(" [api-callFBSendAPI] Unable to send message.");
			//log.error(response);
			log.error(error);
		}
	});
}
module.exports = callSendAPI;

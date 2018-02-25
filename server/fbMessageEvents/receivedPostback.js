/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */

const
	messageRouter = require("../messageRouter/init.js"),
	log = require('../behaviours/logger.js');

function receivedPostback(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfPostback = event.timestamp;

	// The 'payload' param is a developer-defined field which is set in a postback
	// button for Structured Messages.
	var payload = event.postback.payload;

	//log.info("Received postback for user %d and page %d with payload '%s' at %d", senderID, recipientID, payload, timeOfPostback);

	// When a postback is called, we'll send a message back to the sender to
	// let them know it was successful

	messageRouter.postBackRoute(event);
}

module.exports = receivedPostback;
/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to
 * Messenger" plugin, it is the 'data-ref' field. Read more at
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	log = require('../behaviours/logger.js'),
	messageRouter = require("../messageRouter/init.js");

function receivedAuthentication(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfAuth = event.timestamp;

	var passThroughParam = event.optin.ref;

	//log.info("Received authentication for user %d and page %d with pass " + "through param '%s' at %d", senderID, recipientID, passThroughParam,timeOfAuth);

	
	messageRouter.route(event);
}

module.exports = receivedAuthentication;
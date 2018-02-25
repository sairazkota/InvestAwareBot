
const
	fbMes = require("../fbMessageFunctions/fbMessageFunctions.js"),
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	log = require('../behaviours/logger.js'),
	messageRouter = require("../messageRouter/init.js");

function receivedMessage(event) {
	let senderID = event.sender.id;
	let recipientID = event.recipient.id;
	let timeOfMessage = event.timestamp;
	let message = event.message;

	//log.info("\n"+JSON.stringify(message)+"\n");

	let isEcho = message.is_echo;
	let messageId = message.mid;
	let appId = message.app_id;
	let metadata = message.metadata;

	let messageText = message.text;
	let messageAttachments = message.attachments;
	let quickReply = message.quick_reply;

	messageRouter.route(event);
}

module.exports = receivedMessage;
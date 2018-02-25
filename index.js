/*
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* jshint node: true, devel: true */
'use strict';

const
	bodyParser = require('body-parser'),
	express = require('express'),
	https = require('https'),
	config = require("./server/config.js"),
	log4js = require('log4js'),
	log = require('./server/behaviours/logger.js'),
	path = require('path'),
	scheduler = require('./server/behaviours/scheduler.js'),
	verifyRequestSignature = require('./server/fbMessageEvents/verifyRequestSignature.js'),
	receivedAuthentication = require('./server/fbMessageEvents/receivedAuthentication.js'),
	receivedMessage = require('./server/fbMessageEvents/receivedMessage.js'),
	receivedDeliveryConfirmation = require('./server/fbMessageEvents/receivedDeliveryConfirmation.js'),
	receivedPostback = require('./server/fbMessageEvents/receivedPostback.js'),
	receivedMessageRead = require('./server/fbMessageEvents/receivedMessageRead.js');

const app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use(log4js.connectLogger(log4js.getLogger("http"), {
	level: 'auto'
}));
app.use(bodyParser.json({
	verify: verifyRequestSignature
}));


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, './server/views'));
app.set('view engine', 'pug');



/* This is to view the server file database */

app.get('/database/:id', function (req, res) {
	let users = require('./server/data/db.js');
	let queryUser = req.query.name;
	if (req.params.id == "xport060616") {
		if (queryUser) {
			res.send(users.getUsers(queryUser));
		} else {
			res.send(users.db.get('users').value());
		}
	} else {
		res.send("Failed" + req.query.user + req.query.pass);
	}
});
//initalize.start();
/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
app.get('/webhook', function (req, res) {
	if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.VALIDATION_TOKEN) {
		//log.info("Validating webhook");
		res.status(200).send(req.query['hub.challenge']);
	} else {
		log.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
});

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res) {
	res.sendStatus(200);


	//log.info("Webhook received some thing");
	var data = req.body;
	// Make sure this is a page subscription
	if (data.object == 'page') {
		// Iterate over each entry
		// There may be multiple if batched
		data.entry.forEach(function (pageEntry) {
			//log.info("Looping to each message");
			var pageID = pageEntry.id;
			var timeOfEvent = pageEntry.time;
			// Iterate over each messaging event
			pageEntry.messaging.forEach(function (messagingEvent) {
				//log.info("Webhook messagingEvent: ", messagingEvent);
				if (messagingEvent.optin) {
					receivedAuthentication(messagingEvent);
				} else if (messagingEvent.message) {
					receivedMessage(messagingEvent);
				} else if (messagingEvent.delivery) {
					receivedDeliveryConfirmation(messagingEvent);
				} else if (messagingEvent.postback) {
					receivedPostback(messagingEvent);
				} else if (messagingEvent.read) {
					receivedMessageRead(messagingEvent);
				} else {
					log.info("Webhook received unknown messagingEvent: ", messagingEvent);
				}
			});
		});
		// Assume all went well.
		//

		// You must send back a 200, within 20 seconds, to let us know you've
		// successfully received the callback. Otherwise, the request will time out.
	}
});

app.use('/', require('./server/routes/index'));


/// error handlers
/// catch 404 and forward to error handler
/*app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		log.error("Something went wrong:", err);
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	log.error("Something went wrong:", err);
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});*/


// Start server
// Webhooks must be available via SSL with a certificate signed by a valid
// certificate authority.

//cluster(function() {
const server = app.listen(app.get('port'), function () {
	log.info('Express server listening on port ', server.address().port, " with pid ", process.pid);
});
//});

module.exports = app;

const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	users = require("../data/db.js"),
	dateTimeParser = require("../behaviours/dateTimeParser.js"),
	request = require('request'),
	log = require('../behaviours/logger.js'),
	config = require("./../config.js"),
	echoMessages = require("./echo.js"),
	textMessages = require("./messageText.js"),
	attachmentMessages = require("./messageAttachment.js"),
	postBackMessages = require("./postBack.js"),
	database = require("../database/dbPostgreSQL.js"),
	common = require("../behaviours/common.js"),
	quickReplyMessages = require("./quickReply.js"),
	states = require("../data/states.js");

const inFile = module.exports = {
		route: function (event) {
				database.messageDump(JSON.stringify(event));
				let
					message = event.message,
					isEcho = message.is_echo,
					messageText = message.text,
					messageAttachments = message.attachments,
					quickReply = message.quick_reply;

				if (isEcho) {
					let
						senderID = event.recipient.id,
						metadata = message.metadata,
						allowed = ["CONFIREMD_DONOR_MESSAGE", "SHARE_DONOR_MESSAGE"];
					if (allowed.indexOf(metadata) > -1) {
						let user = users.getUsers(senderID)[0];
						echoMessages.handle(user, metadata);
						return;
					} else if (metadata) {
						if (metadata.indexOf("_") > -1) {
							let metadataArr = metadata.split("_");
							if ((metadataArr[0] == "DONOR" && metadataArr[1] == "READY") ) {
								let user = users.getUsers(senderID)[0];
								echoMessages.handle(user, metadata);
								return;
							}
						}
					}
					return;
				}
				else {
					log.trace("[TRACE - init]");
					let
						senderID = event.sender.id,
						user = users.getUsers(senderID);
					if (user.length == 0) {
						log.trace("[TRACE - in if]");
						request({
								uri: 'https://graph.facebook.com/v2.6/' + senderID + '?access_token=' + config.PAGE_ACCESS_TOKEN,
								method: 'GET'
							}, function (error, response, body) {
								if (!error && response.statusCode == 200) {
									log.trace("[TRACE - fetch user details]");
									let userAPI = JSON.parse(body);
									database.insertUsertoBOT(senderID, userAPI.first_name, userAPI.last_name, null, null, userAPI.profile_pic, userAPI.gender, null, null, common.uniquePicCode(userAPI.profile_pic), userAPI.timezone, function (dbUserDetails) {
											log.trace("[TRACE - insertUsertoBOT called]");
											database.fetchDonorDetails(senderID, function (dbhDonorDetails) {
												if (dbhDonorDetails.length == 0) {
													users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss1, function (id) {
														if (dbUserDetails.verified) {
															database.fetchActiveRequestDetailsWithFpid(senderID, function (dbRequestDetails) {
																if (dbRequestDetails.length == 0) {
																	custom.welcomeCall(senderID, userAPI.first_name, "old", "no", "no","no");
																} else {
																	custom.welcomeCall(senderID, userAPI.first_name, "old", "no", "yes","no");
																}
															});
														} else {
															database.fetchActiveRequestDetailsWithFpid(senderID, function (dbRequestDetails) {
																if (dbRequestDetails.length == 0) {
																	custom.welcomeCall(senderID, userAPI.first_name, "new", "no", "no","no");
																} else {
																	custom.welcomeCall(senderID, userAPI.first_name, "old", "no", "yes","no");
																}
															});
														}
													});
												} else {
													database.fetchActiveRequestDetailsWithFpid(senderID, function (dbRequestDetails) {
															if (dbRequestDetails.length == 0) {
																users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss1, function (id) {
																		custom.welcomeCall(id, userAPI.first_name, "old", "yes", "no","no");
																});
																	} else {
																		users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss1, function (id) {
																			custom.welcomeCall(id, userAPI.first_name, "old", "yes", "yes","no");
																		});

																	}
																});
														}
													});

											});
											return;
										}
										else{
											log.error("API is not called.");
										}
										return;
							});
							}
							else if (user.length == 1) {
								user = user[0];
								if (user.errorCount < 5) {
									if (quickReply) {
										quickReplyMessages.handle(user, quickReply);
										return;
									} else if (messageText) {
										textMessages.handle(user, messageText);
										return;
									} else if (messageAttachments) {
										attachmentMessages.handle(user, messageAttachments);
										return;
									} else {
										return;
									}
									return;
								} else {
									users.removeUsers(user.fpid, function (id) {
										inFile.route(event);
									});
									return;
								}
								return;
							} else {
								users.removeUsers(senderID, function (id) {
									inFile.route(event);
								});
								return;
							}
							return;
						}
						return;
					},
					postBackRoute: function (event) {
						database.messageDump(JSON.stringify(event));
						postBackMessages.handle(event);
						return;
					}
}

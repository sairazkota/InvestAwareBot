const
	callSendAPI = require('../api/callFBSendAPI.js'),
	fbMes = require("./fbMessageFunctions.js"),
	dict = require('../data/dict.js'),
	states = require('../data/states.js'),
	random = require("../behaviours/random.js"),
	common = require("../behaviours/common.js"),
	log = require('../behaviours/logger.js'),
	config = require("../config.js"),
	os = require('os');

module.exports = {
	welcomeCall: function (recipientId, userName, usertype, isAlreadyDonor, hasActiveRequest,wrongreply) {
		var greet = random(dict.greeting);
		var greetFollow;
		var buttons;
		var msg,messData;

		if(wrongreply=="no"){

				if (usertype == "old") greetFollow = random(dict.welcomeReturningUser);
				else if (usertype == "new") greetFollow = random(dict.welcomeNewUser);
				else greetFollow = random(dict.welcomeUser);
				msg = greet.message + " " + userName + ". " + greetFollow.message;
		}
		else{
			messData = random(dict.welcomeUser_WrongReply);
			msg = messData.message;

		}
		if (isAlreadyDonor == "yes" && hasActiveRequest == "no") {
			buttons = [
				{
					"content_type": "text",
					"title": "Request blood",
					"payload": "REQUEST_BLOOD"
        }
			];
		} else if (isAlreadyDonor == "no" && hasActiveRequest == "no") {
			buttons = [
				{
					"content_type": "text",
					"title": "Donate Blood",
					"payload": "DONATE_BLOOD"
            	},
				{
					"content_type": "text",
					"title": "Request blood",
					"payload": "REQUEST_BLOOD"
				}
			];
		} else if (isAlreadyDonor == "yes" && hasActiveRequest == "yes") {
			buttons = [
				{
					"content_type": "text",
					"title": "Donor Details",
					"payload": "REQ_DONORS"
				 },
				{
					"content_type": "text",
					"title": "Close Request",
					"payload": "REQUEST_BLOOD_CLOSE"
				},
				{
					"content_type": "text",
					"title": "New Request",
					"payload": "REQUEST_BLOOD_NEW"
        }
			];
		}
		else if (isAlreadyDonor == "no" && hasActiveRequest == "yes") {
			buttons = [
				{
					"content_type": "text",
					"title": "Donar Details",
					"payload": "REQ_DONORS"
			 	},
				{
					"content_type": "text",
					"title": "Close Request",
					"payload": "REQUEST_BLOOD_CLOSE"
			 },
			 {
				 "content_type": "text",
				 "title": "Donate Blood",
				 "payload": "DONATE_BLOOD"
			 },
			 {
				 "content_type": "text",
				 "title": "New Request ",
				 "payload": "REQUEST_BLOOD_NEW"
			 }
		 ];
		}
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text : msg,
				metadata: "WELCOME_MESSAGE",
				quick_replies: buttons
			}
		};
		callSendAPI(messageData);
	},

	alreadyRegisterdUserMenuclick: function (recipientId, hasRequest,wrongreply) {

		let messData ;
		if(wrongreply=="no"){
			messData = random(dict.alreadyRegisterdUser);
		}
		else{
			messData = random(dict.welcomeUser_WrongReply);
		}
		var buttons;
		if (hasRequest == "yes") {

			buttons = [
				{
					"content_type": "text",
					"title": "New Request",
					"payload": "REQUEST_BLOOD_NEW"
            	 },
				{
					"content_type": "text",
					"title": "Donor Details",
					"payload": "REQ_DONORS"
				 },
				{
					"content_type": "text",
					"title": "Close Request",
					"payload": "REQUEST_BLOOD_CLOSE"
				}
			];
		} else if (hasRequest == "no") {

			buttons = [
				{
					//type: "postback",
					"content_type": "text",
					"title": "Request blood",
					"payload": "REQUEST_BLOOD"
            	}
			];
		}
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "REGISTERED_ALREADY",
				quick_replies: buttons
			}
		};
		callSendAPI(messageData);
	},
	hasActiveRequestUserMenuclick: function (recipientId, isDonor,wrongreply) {
		var buttons;
		let messData ;
		if(wrongreply=="no"){
			messData = random(dict.hasActiveRequestUser);
		}
		else{
			messData = random(dict.welcomeUser_WrongReply);
		}
		if (isDonor == "yes") {
			buttons = [
				{
					"content_type": "text",
					"title": "New Request",
					"payload": "REQUEST_BLOOD_NEW"
            	 },
				{
					"content_type": "text",
					"title": "Donor Details",
					"payload": "REQ_DONORS"
				 },
				{
					"content_type": "text",
					"title": "Close Request",
					"payload": "REQUEST_BLOOD_CLOSE"
				}
			];
		} else if (isDonor == "no") {
			buttons = [
				{
					//type: "postback",
					"content_type": "text",
					"title": "Donate Blood",
					"payload": "DONATE_BLOOD"
            	},
				{
					//type: "postback",
					"content_type": "text",
					"title": "New Request ",
					"payload": "REQUEST_BLOOD_NEW"
            	},
				{
					//type: "postback",
					"content_type": "text",
					"title": "Donar Details",
					"payload": "REQ_DONORS"
				},
				{
					//type: "postback",
					"content_type": "text",
					"title": "Close Request",
					"payload": "REQUEST_BLOOD_CLOSE"
			 	}
            ];

		}
		//let messData = random(dict.hasActiveRequestUser);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "HAS_ACTIVE_REQUEST",
				quick_replies: buttons
			}
		};
		callSendAPI(messageData);
	},
	askBloodGroup: function (recipientId, type) {
		var messData;
		if (type == "donor") {
			messData = random(dict.askDonorBloodGroup);
		} else {
			messData = random(dict.askReqestBloodGroup);

		}
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "BLOOD_GROUP",
				quick_replies: [
					{
						"content_type": "text",
						"title": "A+",
						"payload": "PICK_BLOODGROUP_A+"
		             },
					{
						"content_type": "text",
						"title": "A-",
						"payload": "PICK_BLOODGROUP_A-"
		               }, {
						"content_type": "text",
						"title": "B+",
						"payload": "PICK_BLOODGROUP_B+"
		               }, {
						"content_type": "text",
						"title": "B-",
						"payload": "PICK_BLOODGROUP_B-"
		               }, {
						"content_type": "text",
						"title": "AB+",
						"payload": "PICK_BLOODGROUP_AB+"
		               }, {
						"content_type": "text",
						"title": "AB-",
						"payload": "PICK_BLOODGROUP_AB-"
		               }, {
						"content_type": "text",
						"title": "O+",
						"payload": "PICK_BLOODGROUP_O-"
		               }, {
						"content_type": "text",
						"title": "O-",
						"payload": "PICK_BLOODGROUP_O-"
		               }]
			}
		};
		callSendAPI(messageData);
	},
	askBloodGroupWrong: function (recipientId) {
		let messData = random(dict.askBloodGroupWrong);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_BLOOD_GROUP_WRONG",
				quick_replies: [
					{
						"content_type": "text",
						"title": "A+",
						"payload": "PICK_BLOODGROUP_A+"
		             },
					{
						"content_type": "text",
						"title": "A-",
						"payload": "PICK_BLOODGROUP_A-"
		               }, {
						"content_type": "text",
						"title": "B+",
						"payload": "PICK_BLOODGROUP_B+"
		               }, {
						"content_type": "text",
						"title": "B-",
						"payload": "PICK_BLOODGROUP_B-"
		               }, {
						"content_type": "text",
						"title": "AB+",
						"payload": "PICK_BLOODGROUP_AB+"
		               }, {
						"content_type": "text",
						"title": "AB-",
						"payload": "PICK_BLOODGROUP_AB-"
		               }, {
						"content_type": "text",
						"title": "O+",
						"payload": "PICK_BLOODGROUP_O-"
		               }, {
						"content_type": "text",
						"title": "O-",
						"payload": "PICK_BLOODGROUP_O-"
		               }]
			}
		};
		callSendAPI(messageData);
	},
	pickUpLocationMessage: function (recipientId, type) {
		let messData;
		if (type == "donor") {
			messData = random(dict.askDonorPickup);
		} else {
			messData = random(dict.askReqestPickup);
		}
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "PICKUP_LOCATION"
			}
		};
		callSendAPI(messageData);
	},
	locsListMessage: function (recipientId, locsList, locType) {
		if (locType == "pickup") locType = "PICKUP_LOCATION_";
		else if (locType == "drop") locType = "DROP_LOCATION_";
		else return;
		let elementsArray = [];
		for (let i = 0;
			(i < locsList.length) && (i < 10); i++) {
			elementsArray.push({
				title: common.trimTitle(locsList[i].title),
				//image_url: config.HOST_NAME+"images/share-location.jpg",
				image_url: "http://i.imgur.com/XsEs8yU.jpg",
				buttons: [
					{
						type: "postback",
						title: "Incorrect location",
						payload: "LIST_LOCATION_NOT_FOUND",
					},
					{
						type: "postback",
						title: "Pick this location",
						payload: locType + i,
					}
				  ]
			});
		};
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: elementsArray
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	locationNotFoundMessage: function (recipientId) {
		let messData = random(dict.locationNotFoundMessageImage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "LOCATION_NOT_FOUND_REPLY"
			}
		};
		callSendAPI(messageData);
	},
	notValidLocation: function (recipientId) {
		let confused = random(dict.confused);
		let messData = random(dict.notValidLocation);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: confused.message + " " + messData.message,
				metadata: "NOT_A_LOCATION"
			}
		};
		callSendAPI(messageData);
	},
	notValidLatLng: function (recipientId) {
		let confused = random(dict.confused);
		let messData = random(dict.notValidLatLng);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: confused.message + " " + messData.message,
				metadata: "LAT_LNG_PROB"
			}
		};
		callSendAPI(messageData);
	},
	askDateTimeFreeForm: function (recipientId) {
		let messData = random(dict.askDateTimeFreeForm);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "CHOOSE_DATE_TIME_FREE_FORM"
			}
		};
		callSendAPI(messageData);
	},
	askDateTimeFreeFormWrong: function (recipientId) {
		let messData = random(dict.askDateTimeFreeFormWrong);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "CHOOSE_DATE_TIME_FREE_FORM_WRONG"

			}
		};
		callSendAPI(messageData);
	},
	askDateTimeFreeFormPast: function (recipientId) {
		let messData = random(dict.askDateTimeFreeFormPast);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "CHOOSE_DATE_TIME_FREE_FORM_WRONG",

			}
		};
		callSendAPI(messageData);
	},
	resendOTP: function (recipientId) {
		let messData = random(dict.resendOTP);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "RESEND_OTP"
			}
		};
		callSendAPI(messageData);
	},

	askOTPWrong: function (recipientId) {
		let messData = random(dict.askOTPWrong);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "button",
						text: messData.message,
						buttons: [{
							type: "postback",
							title: "Resend code",
							payload: "OTP_RESEND"
						}, {
							type: "postback",
							title: "Change my number",
							payload: "OTP_CHANGE_MOBILE"
						}]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	askMobileNumber: function (recipientId, type) {
		let messData;

		if (type == "donor") {
			messData = random(dict.askDonorMobileNumber)
		} else {
			messData = random(dict.askRequestMobileNumber);
		}
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_MOBILE"
			}
		};
		callSendAPI(messageData);

	},
	askMobileNumberWrong: function (recipientId) {
		let messData = random(dict.askMobileNumberWrong);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_MOBILE_WRONG"
			}
		};
		callSendAPI(messageData);
	},

	mobileVerified: function (recipientId) {
		let excited = random(dict.excited);
		let messData = random(dict.mobileVerified);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: excited.message + " " + messData.message,
				metadata: "REQUEST_CONFIRMATION"
			}
		};
		callSendAPI(messageData);
	},
	askWhichCountry: function (recipientId, country) {
		let messData = random(dict.askWhichCountry);
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message + " " + country + "?",
				metadata: "ASK_COUNTRY",
				quick_replies: [
					{
						"content_type": "text",
						"title": "Yes",
						"payload": "COUNTRY_YES"
					},
					{
						"content_type": "text",
						"title": "No",
						"payload": "COUNTRY_NO"
					}
					]
			}
		};
		callSendAPI(messageData);
	},
	askWhichCountryWrong: function (recipientId, country) {
		let messData = random(dict.askWhichCountryWrong);
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message + " " + country + "?",
				metadata: "ASK_COUNTRY",
				quick_replies: [
					{
						"content_type": "text",
						"title": "Yes",
						"payload": "COUNTRY_YES"
					},
					{
						"content_type": "text",
						"title": "No",
						"payload": "COUNTRY_NO"
					}
					]
			}
		};
		callSendAPI(messageData);
	},
	askOTP: function (recipientId) {
		let messData = random(dict.askOTP);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ASK_OTP"
			}
		};
		callSendAPI(messageData);
	},
	changeDonorMessage: function (recipientId, pickup, bloodGroup) {
		let currentDate = new Date();
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: "Your Details",
							subtitle: "Location: " + common.trimLocation(pickup) + os.EOL + "Blood Group: " + bloodGroup,
							//image_url: config.HOST_NAME+"images/trip-details.jpg",
							image_url: "http://i.imgur.com/yqgfe3n.jpg",
							buttons: [
								{
									type: "postback",
									title: "Change Blood Group",
									payload: "FINAL_DONOR_CONFIRMATION_CHANGE_BLOODGROUP",
                				},
								{
									type: "postback",
									title: "Change Location",
									payload: "FINAL_DONOR_CONFIRMATION_CHANGE_LOCATION",
								},
								{
									type: "postback",
									title: "Confirm",
									payload: "FINAL_DONOR_CONFIRM",
								}
							  ]
							}]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	changeRequestDeailsMessage: function (recipientId, pickup, bloodGroup, date, time) {

		let currentDate = new Date();
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: "Your Request",
							subtitle: "Location: " + common.trimLocation(pickup) + os.EOL + "Blood Group: " + bloodGroup + os.EOL + "When: " + date.replace(", " + currentDate.getFullYear(), "") + " @" + time,
							//image_url: config.HOST_NAME+"images/trip-details.jpg",
							image_url: "http://i.imgur.com/bzGvsPn.jpg",
							buttons: [
								{
									type: "postback",
									title: "Change Blood group",
									payload: "REQUEST_CHANGE_BLOODGROUP",
                				},
								{
									type: "postback",
									title: "Change Location",
									payload: "REQUEST_CHANGE_LOCATION",
									},
								{
									type: "postback",
									title: "Change Time",
									payload: "REQUEST_CHANGE_TIME",
								}
							  ]
							}]
						}
				}
			}
		};
		callSendAPI(messageData);
	},
	changeRequestMessage: function (recipientId, pickup, bloodGroup, date, time) {
		let currentDate = new Date();
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: "Your Request",
							subtitle: "Location: " + common.trimLocation(pickup) + os.EOL + os.EOL + "Blood Group: " + bloodGroup + os.EOL + "When: " + date.replace(", " + currentDate.getFullYear(), "") + " @" + time,
							//image_url: config.HOST_NAME+"images/trip-details.jpg",
							image_url: "http://i.imgur.com/hmrUdPb.jpg",
							buttons: [
								{
									type: "postback",
									title: "Change Request",
									payload: "FINAL_REQUEST_CONFIRMATION_CHANGE",
								},
								{
									type: "postback",
									title: "Confirm",
									payload: "FINAL_REQUEST_CONFIRMATION_CONFIRM",
								}
							  ]
							}]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	donorReadyMessage: function (recipientId, requestId, requesterName) {
		let messData = random(dict.donorReadyMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message + requesterName + " (details follow) Expect to hear back short...",
				metadata: "DONOR_READY_" + requestId + "_" + recipientId
			}
		};
		callSendAPI(messageData);
	},
	confirmedDonorMessage: function (recipientId, userName) {
		let messData = random(dict.confirmedDonorMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message + userName + "!",
				metadata: "CONFIREMD_DONOR_MESSAGE"
			}
		};
		callSendAPI(messageData);
	},
	ShareDonorMessage: function (recipientId) {
		let messData = random(dict.ShareDonorMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "SHARE_DONOR_MESSAGE"
			}
		};
		callSendAPI(messageData);
	},
	ShareDonorCardMessage: function (recipientId, userName, messageType, pickup, bloodGroup) {
		let message;

		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: "I've enrolled to donate blood and challenge you do the same to save lives",
              item_url: "https://messenger.com/t/thesharebot",
							subtitle: "Location: " + common.trimLocation(pickup) + os.EOL + os.EOL + "Blood Group: " + bloodGroup,
							image_url: "http://i.imgur.com/gZY1mRT.jpg",
							buttons: [{
									type: "element_share",
								}]
							}]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	confirmedRequesterMessage: function (recipientId, userName) {
		let messData = random(dict.confirmedRequesterMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message + userName + "!",
				metadata: "CONFIREMD_REQUESTER_MESSAGE"
			}
		};
		callSendAPI(messageData);
	},
	ShareRequesterMessage: function (recipientId) {
		let messData = random(dict.ShareRequesterMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "SHARE_REQUESTER_MESSAGE"
			}
		};
		callSendAPI(messageData);
	},
	ShareRequesterCardMessage: function (recipientId, userName, pickup, bloodGroup, date, time) {

		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: userName + " needs blood. Share to help!",
							//subtitle: "Location: " + common.trimString(pickup) + os.EOL + os.EOL + "Blood Group: " + bloodGroup,
							subtitle: "Location: " + common.trimLocation(pickup) + os.EOL + "Blood Group: " + bloodGroup + os.EOL + "When: " + date.replace(", " + (new Date()).getFullYear(), "") + " @" + time,
							//image_url: config.HOST_NAME+"images/trip-details.jpg",
							image_url: "http://i.imgur.com/bzGvsPn.jpg",
							buttons: [
								{
									type: "element_share",
								}
							  ]
							}]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	finalRequesterMessage: function (recipientId) {
		let messData = random(dict.finalRequesterMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "FINAL_REQUESTER_MESSAGE"
			}
		};
		callSendAPI(messageData);
	},
		alreadyAcceptedReq: function (recipientId) {
		let messData = random(dict.alreadyAcceptedReq);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "ALREADY_ACC_REQ"
			}
		};
		callSendAPI(messageData);
	},
	reqClosedCantdonate: function (recipientId) {
		let messData = random(dict.reqClosedCantdonate);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "CLOSED_ACC_REQ"
			}
		};
		callSendAPI(messageData);
	},
	requesterCardToDonor: function (recipientId, userName, pickup, bloodGroup, mobile, date, time, profilePic) {

		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: userName,
							subtitle: "Looking for: " + bloodGroup + os.EOL + "Where " + common.trimLocation(pickup) + os.EOL + "Nedds it by: " + date.replace(", " + (new Date()).getFullYear(), "") + " @" + time,
							image_url: profilePic,
							buttons: [
								{
									type: "phone_number",
									title: "Call Person",
									payload: mobile,
                }
              ]
            }]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	DonorCardToRequester: function (recipientId, donorList) {
		let elementsArray = [];
		donorList.forEach(function (userMatch) {
			elementsArray.push({
				title: userMatch.name,
				subtitle: "Location: " + common.trimLocation(userMatch.pickup) + os.EOL + "Blood Group: " + userMatch.bloodGroup,
				image_url: userMatch.profilePicture,
				buttons: [
					{
						type: "phone_number",
						title: "Call Person",
						payload: userMatch.mobileNumber,
					}
					]
			});
		});
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: elementsArray
					}
				}
			}
		};
		callSendAPI(messageData);
	},

	requestersCardToDonor: function (recipientId, List) {
		let elementsArray = [];
		List.forEach(function (userMatch) {
			elementsArray.push({
				title: userMatch.name,
				subtitle: "Location: " + common.trimLocation(userMatch.pickup) + os.EOL + "Blood Group: " + userMatch.bloodGroup,
				image_url: userMatch.profilePicture,
				//image_url: "http://i.imgur.com/2ILxlnQ.jpg",
				buttons: [
					{
						type: "postback",
						title: "Interested to Donate",
						payload: "DONATE_YES_"+userMatch.reqID,
					}
				]
			});
		});
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: elementsArray
					}
				}
			}
		};
		callSendAPI(messageData);
	},

	activeRequestsToDonor: function (recipientId) {
		let messData = random(dict.activeRequestsToDonor);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
					metadata: "REQS_DONOR"
			}
		};
		callSendAPI(messageData);
	},


	noDonorsFound: function (recipientId) {
		let messData = random(dict.noDonorsFound);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
					metadata: "NO_DONOR_FOUND"
			}
		};
		callSendAPI(messageData);
	},
	donorFoundMessage: function (recipientId, requesterName, donorId, requestId) {
		let messData = random(dict.donorFoundMessage);
		let greeting = random(dict.greeting);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: greeting.message + ", " + requesterName + ". " + messData.message,
				metadata: "DONOR_FOUND_" + donorId + "_" + requestId,
			}
		};
		callSendAPI(messageData);
	},
	matchesListMessage: function (recipientId, userMatchList) {
		let elementsArray = [];
		userMatchList.forEach(function (userMatch) {
			elementsArray.push({
				title: userMatch.name,
				subtitle: "Location: " + common.trimLocation(userMatch.pickup) + os.EOL + "Blood Group: " + userMatch.bloodGroup,
				image_url: userMatch.profilePicture,
				buttons: [
					{
						type: "phone_number",
						title: "Call",
						payload: userMatch.mobileNumber,
            		}
        			]
			});
		});
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: elementsArray
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	notReadyDonorMessage: function (recipientId) {
		let messData = random(dict.notReadyDonorMessage);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "NOT_READY"
			}
		};
		callSendAPI(messageData);
	},
	askReadyToDonate: function (recipientId, requesterId) {
		let messData = random(dict.askReadyToDonate);
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: messData.message,
							image_url: "http://i.imgur.com/Zl2Jmqj.jpg",
							buttons: [
								{
									type: "postback",
									title: "Yes",
									payload: "DONATE_YES_" + requesterId,
                				},
								{
									type: "postback",
									title: "No",
									payload: "DONATE_NO_" + requesterId,

                					}
              					]
							}]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	matchConversion: function (recipientId, location, bloodgroup, date, time, tid) {
		let messData = random(dict.matchConversion)
		let currentDate = new Date();
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: messData.message,
							subtitle: "Location: " + common.trimLocation(location) + os.EOL + "Blood Group: " + bloodgroup + os.EOL + "When: " + date.replace(", " + currentDate.getFullYear(), "") + " @" + time,
							//image_url: config.HOST_NAME+"images/confirm-matches.jpg",
							image_url: "http://i.imgur.com/hmrUdPb.jpg",
							buttons: [
								{
									type: "postback",
									title: "Yes",
									payload: "MATCH_CONVERSION_YES_" + tid,
                },
								{
									type: "postback",
									title: "No",
									payload: "MATCH_CONVERSION_NO_" + tid,
                }
              ]
            }]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	noMoreMatches: function (recipientId, location, bloodgroup, date, time) {
		let messData = random(dict.noMoreMatches);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				attachment: {
					type: "template",
					payload: {
						template_type: "generic",
						elements: [{
							title: messData.message,
							subtitle: "Location: " + common.trimLocation(location) + os.EOL + "Blood Group: " + bloodgroup + os.EOL + "When: " + date.replace(", " + new Date().getFullYear(), "") + " @" + time,
							//image_url: config.HOST_NAME+"images/no-matches.jpg"
							image_url: "http://i.imgur.com/tbsM7u0.jpg"
            }]
					}
				}
			}
		};
		callSendAPI(messageData);
	},
	closeRequest: function (recipientId) {
		let messData = random(dict.closeRequest);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "CLOSE_REQUEST"
			}
		};
		callSendAPI(messageData);
	},
	newRequestForActive: function (recipientId) {
		let messData = random(dict.newRequestForActive);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "NEW_REQUEST_MSG"
			}
		};
		callSendAPI(messageData);
	},
	inappropriateButtonClick: function (recipientId) {
		let messData = random(dict.inappropriateButtonClick);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "INAPPROPRIATE"
			}
		};
		callSendAPI(messageData);
	},
	errorCommonMessage: function (recipientId) {
		let angst = random(dict.angst);
		let messData = random(dict.errorCommon);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: angst.message + " " + messData.message + os.EOL + os.EOL + config.TUTORIAL_URL,
				metadata: "ERROR_MESSAGE_KILL"
			}
		};
		callSendAPI(messageData);
	},

	sendTypingOn: function (recipientId) {
		var messageData = {
			recipient: {
				id: recipientId
			},
			sender_action: "typing_on"
		};
		callSendAPI(messageData);
	},

	thanksStayInTouch: function (recipientId) {
		let messData = random(dict.thanksStayInTouch);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "GOOD_BYE_STAY"
			}
		};
		callSendAPI(messageData);
	},

	goodbyeConversion: function (recipientId) {
		let messData = random(dict.goodbyeConversion);
		let messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messData.message,
				metadata: "GOOD_BYE_CONVERSION"
			}
		};
		callSendAPI(messageData);
	}
};

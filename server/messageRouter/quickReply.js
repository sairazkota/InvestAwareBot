const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	fbmsg = require("../fbMessageFunctions/fbMessageFunctions.js"),
	users = require("../data/db.js"),
	states = require("../data/states.js"),
	database = require("../database/dbPostgreSQL.js"),
	// dateTimeParser = require("../behaviours/dateTimeParser.js"),
	common = require("../behaviours/common.js"),
	sms = require("../behaviours/sms.js"),
	log = require('../behaviours/logger.js'),
	config = require("./../config.js"),
	errorMessages = require("./errorMessages.js"),
	request = require('request'),
	messageRoute = require("./init.js");

const inFile = module.exports = {
	handle: function (user, quickReply) {
		let quickReplyPayload = quickReply.payload;
		let metadataArray, travelDateQuick;
		var payloadArr = quickReplyPayload.split("_");
		var match = payloadArr[0] + "_" + payloadArr[1];
		switch (quickReplyPayload) {

			case "REQUEST_BLOOD_NEW":
				log.trace("[quickReply] ["+user.firstName+"] ["+user.fpid+"] [New Request]");
				users.removeUsers(user.fpid,function(id){
					custom.newRequestForActive(user.fpid);
				});
				break;

			case "REQUEST_BLOOD_CLOSE":
				database.updateRequestClose(user.fpid, function () {
					users.removeUsers(user.fpid,function(id){
						custom.closeRequest(user.fpid);
						log.trace("[quickReply] ["+user.firstName+"] ["+user.fpid+"] [Request Close]");
					});
				});
				break;

			case "REQ_DONORS":
				log.trace("[quickReply] ["+user.firstName+"] ["+user.fpid+"] [Requesting for donar list]");
				database.fetchActiveRequestDetailsWithFpid(user.fpid, function (dbRequesterDetails) {
					if (dbRequesterDetails.length == 1) {
						dbRequesterDetails=dbRequesterDetails[0];
							database.fetchDonorOfReq(dbRequesterDetails.requestid, function (dbDonorDetails) {
								if (dbDonorDetails.length >= 1) {
									var donorList = [];
									for (let person1 = dbDonorDetails.length-1; person1 >= 0; person1--) {
										donorList.push({
											fpid: dbDonorDetails[person1].fpid,
											name: dbDonorDetails[person1].firstname + " " + dbDonorDetails[person1].lastname,
											pickup: dbDonorDetails[person1].location,
											profilePicture: dbDonorDetails[person1].profilepicture,
											mobileNumber: dbDonorDetails[person1].mobile,
											bloodGroup: dbDonorDetails[person1].bloodgroup
										});
									}
									users.removeUsers(user.fpid,function(id){
										custom.DonorCardToRequester(user.fpid, donorList);
										setTimeout(function () {
											custom.finalRequesterMessage(user.fpid);
										}, 2000);
									});
								} else {
										users.removeUsers(user.fpid,function(){
											custom.noDonorsFound(user.fpid);
										});
								}
							});
						}
				});
				break;

		case "DONATE_BLOOD":
		case "PERSISTENT_MENU_REGISTER":
		log.trace("[quickReply] ["+user.firstName+"] ["+user.fpid+"] [Want to donate blood]");
			users.removeUsers(user.fpid, function (id) {
				request({
					uri: 'https://graph.facebook.com/v2.6/' + id + '?access_token=' + config.PAGE_ACCESS_TOKEN,
					method: 'GET'
				}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						let userAPI = JSON.parse(body);
						database.insertUsertoBOT(user.fpid, userAPI.first_name, userAPI.last_name, null, null, userAPI.profile_pic, userAPI.gender, null, null, common.uniquePicCode(userAPI.profile_pic), userAPI.timezone, function (dbUserDetails) {
							database.fetchDonorDetails(user.fpid, function (dbhDonorDetails) {
								if (dbhDonorDetails.length == 0) {
									users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss2, function (id) {
										custom.askBloodGroup(id, "donor");
									});
								} else {
									database.fetchActiveRequestDetailsWithFpid(user.fpid, function (dbRequesterDetails) {
										if(dbRequesterDetails.length>=0){											custom.alreadyRegisterdUser(user.fpid,"yes");
										}
										else{
											custom.alreadyRegisterdUser(user.fpid,"no");
										}

									});
									}
							});
						});
						return;

					} else {
						return;
					}
					return;
				});
			});
			break;

		case "REQUEST_BLOOD":
		case "PERSISTENT_MENU_NEED":
			log.trace("[quickReply] ["+user.firstName+"] ["+user.fpid+"] [Requesting for blood]");
			users.removeUsers(user.fpid, function (id) {
				request({
					uri: 'https://graph.facebook.com/v2.6/' + id + '?access_token=' + config.PAGE_ACCESS_TOKEN,
					method: 'GET'
				}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						let userAPI = JSON.parse(body);
						database.insertUsertoBOT(user.fpid, userAPI.first_name, userAPI.last_name, null, null, userAPI.profile_pic, userAPI.gender, null, null, common.uniquePicCode(userAPI.profile_pic), userAPI.timezone, function (dbUserDetails) {
							users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss2a, function (id) {
								custom.askBloodGroup(id, "request");
							});
							return;
						});
					} else {
						return;
					}
					return;
				});
			});
			break;

		default:
			switch (quickReplyPayload + "|" + user.state) {
			case "COUNTRY_YES|" + states.ss6:
			case "COUNTRY_YES|" + states.ss6a:
				var setState;
				//let otp = 4321;
				let otp = Math.floor(1000 + Math.random() * 9000);
				log.info("[quick reply] ["+user.firstName+"] ["+user.fpid+"] [OTP] ["+otp+"]");
				//sms.sendOTP(user.mobile,otp,function(status){
					if (user.state == states.ss6) {
						users.updateStatewithValue(user.fpid, states.ss7, "verified", otp, function (id) {
							custom.askOTP(id);
						});
					} else if (user.state == states.ss6a) {
						users.updateStatewithValue(user.fpid, states.ss7a, "verified", otp, function (id) {
							custom.askOTP(id);
						});
					}
				//});
				break;

			case "COUNTRY_NO|" + states.ss6:
			case "COUNTRY_NO|" + states.ss6a:
				log.trace("[quickReply] ["+user.firstName+"] ["+user.fpid+"] [Country is wrong]");
				var setState;
				if (user.state == states.ss6) setState = states.ss5;
				else if (user.state == states.ss6a) setState = states.ss5a;
				users.updateState(user.fpid, setState, function (id) {
					custom.askMobileNumberWrong(id);
				});
				break;

			default:
				var payloadArr = quickReplyPayload.split("_");
				var match = payloadArr[0] + "_" + payloadArr[1];
				var tempbgtype = payloadArr[2];

				switch (match + "|" + user.state) {
						case "PICK_BLOODGROUP|" + states.ss7c:
							log.trace("[quickReply] ["+user.firstName+"] ["+user.fpid+"] [Picked BloodGroup - "+tempbgtype+"]");
							users.updateStatewithValue(user.fpid, states.ss7b, "bgtype", tempbgtype, function (id) {
								custom.changeDonorMessage(id,user.pickup.title,user.bgtype);
							});
							break;

						case "PICK_BLOODGROUP|" + states.ss7c1:
							log.trace("[quickReply] ["+user.firstName+"] ["+user.fpid+"] [Picked BloodGroup - "+tempbgtype+"]");
							users.updateStatewithValue(user.fpid, states.ss7b1, "bgtype", tempbgtype, function (id) {
								custom.changeRequestMessage(id,user.pickup.title,user.bgtype,user.date,user.time);
							});
							break;

						case "PICK_BLOODGROUP|" + states.ss2:
						case "PICK_BLOODGROUP|" + states.ss2a:
							log.trace("[quickReply] ["+user.firstName+"] ["+user.fpid+"] [Picked BloodGroup - "+tempbgtype+"]");
							var setState, usertype;
							if (user.state == states.ss2) {
								setState = states.ss3;
								usertype = "donor";
							} else if (user.state == states.ss2a) {
								setState = states.ss3a;
								usertype = "request"
							} else {
								log.info("not valid state");
							}
								users.updateStatewithValue(user.fpid, setState, "bgtype", tempbgtype, function (id) {
									custom.pickUpLocationMessage(id, usertype);
							});
							break;
					default:
						errorMessages.handle(user, function (id) {
							custom.inappropriateButtonClick(user.fpid);
						});
						break;
				}
				break;
			}
		}
		return;
	}
}

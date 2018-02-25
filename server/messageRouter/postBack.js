const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	fbmessage = require("../fbMessageFunctions/fbMessageFunctions.js"),
	users = require("../data/db.js"),
	states = require("../data/states.js"),
	database = require("../database/dbPostgreSQL.js"),
	common = require("../behaviours/common.js"),
	request = require('request'),
	sms = require("../behaviours/sms.js"),
	log = require('../behaviours/logger.js'),
	config = require("./../config.js"),
	errorMessages = require("./errorMessages.js"),
	messageRoute = require("./init.js");

const inFileP = module.exports = {
	handle: function (event) {
		const
			postbackPayload = event.postback.payload,
			senderID = event.sender.id;
		if (postbackPayload.indexOf("_") > -1) {
			let postbArr = postbackPayload.split("_");
			switch (postbArr[0] + "|" + postbArr[1]) {
			case "MATCH|CONVERSION":
				database.updateRequestConversion(postbArr[3], ((postbArr[2] == "YES") ? true : false), function () {
					custom.goodbyeConversion(senderID);
					return;
				});
				break;
			case "DONATE|NO":
				custom.notReadyDonorMessage(senderID);
				break;

			case "DONATE|YES":
				log.info(" donar yes req:" + postbArr[2] + " " + senderID);
				database.fetchRequestDetailsWithRequestid(postbArr[2], function (dbRequesterDetails) {
					if (dbRequesterDetails.length >= 1) {
						for (let person = 0; person < dbRequesterDetails.length; person++) {
							log.info("name:" + dbRequesterDetails[person].firstname + " fpid:" + dbRequesterDetails[person].fpid);

							let updatedDonorIds;
							if (dbRequesterDetails[person].matcheddonorids == null) {
								updatedDonorIds = senderID;
							} else {
								let donorArr = dbRequesterDetails[person].matcheddonorids.split("_");
								if (donorArr.indexOf(senderID) > -1) {
									custom.alreadyAcceptedReq(senderID);
									break;
								}
								else{
									updatedDonorIds = dbRequesterDetails[person].matcheddonorids + "_" + senderID;
								}
							}
							database.updateDonorIdsToRequester(postbArr[2], updatedDonorIds, function () {
								custom.donorReadyMessage(senderID, postbArr[2], dbRequesterDetails[person].firstname);
								custom.donorFoundMessage(dbRequesterDetails[person].fpid, dbRequesterDetails[person].firstname, senderID, postbArr[2]);
								setTimeout(function () {
									log.info("donor found in postback");
									database.fetchDonorOfReq(postbArr[2], function (dbDonorDetails) {
										if (dbDonorDetails.length >= 1) {
											var donorList = [];
											for (let person1 = dbDonorDetails.length-1; person1 >= 0 ; person1--) {
												donorList.push({
													fpid: dbDonorDetails[person1].fpid,
													name: dbDonorDetails[person1].firstname + " " + dbDonorDetails[person1].lastname,
													pickup: dbDonorDetails[person1].location,
													profilePicture: dbDonorDetails[person1].profilepicture,
													mobileNumber: dbDonorDetails[person1].mobile,
													bloodGroup: dbDonorDetails[person1].bloodgroup
												});
											}
											custom.DonorCardToRequester(dbRequesterDetails[person].fpid, donorList);
											setTimeout(function () {
												custom.finalRequesterMessage(dbRequesterDetails[person].fpid);
											}, 2000);
										}
									});
								}, 2000);
							});
						}
					}
					else{
						custom.reqClosedCantdonate(senderID);
					}
				});
				break;
			default:
				//Static Postbacks
				switch (postbackPayload) {

				case "DONATE_BLOOD":
				case "PERSISTENT_MENU_REGISTER":
					log.info("registerd");

					users.removeUsers(senderID, function (id) {
						request({
							uri: 'https://graph.facebook.com/v2.6/' + id + '?access_token=' + config.PAGE_ACCESS_TOKEN,
							method: 'GET'
						}, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								let userAPI = JSON.parse(body);
								database.insertUsertoBOT(senderID, userAPI.first_name, userAPI.last_name, null, null, userAPI.profile_pic, userAPI.gender, null, null, common.uniquePicCode(userAPI.profile_pic), userAPI.timezone, function (dbUserDetails) {
									database.fetchDonorDetails(senderID, function (dbhDonorDetails) {
										if (dbhDonorDetails.length == 0) {
											users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss2, function (id) {
												custom.askBloodGroup(id, "donor");

											});
										} else {

											users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss2xx, function (id) {
												//custom.askBloodGroup(id, "donor");
												database.fetchActiveRequestDetailsWithFpid(senderID, function (dbRequesterDetails) {
												if (dbRequesterDetails.length >= 1) {
													custom.alreadyRegisterdUserMenuclick(senderID, "yes","no");
												} else {
													custom.alreadyRegisterdUserMenuclick(senderID, "no","no");
												}
											});

											});

										}
									});
								});
								return;
							} else {
								//log.error("Unale to fetch user details on share ride.");
								return;
							}
							return;
						});
					});
					break;

				case "GET_STARTED_BUTTON_CLICKED":
				case "PERSISTENT_GETTING_STARTED":
					log.info("started clicked");
					users.removeUsers(senderID, function (id) {
						request({
							uri: 'https://graph.facebook.com/v2.6/' + senderID + '?access_token=' + config.PAGE_ACCESS_TOKEN,
							method: 'GET'
						}, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								let userAPI = JSON.parse(body);
								database.insertUsertoBOT(senderID, userAPI.first_name, userAPI.last_name, null, null, userAPI.profile_pic, userAPI.gender, null, null, common.uniquePicCode(userAPI.profile_pic), userAPI.timezone, function (dbUserDetails) {
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
													custom.welcomeCall(senderID, userAPI.first_name, "new", "no", "no","no");
												}
											});
										} else {
											database.fetchActiveRequestDetailsWithFpid(senderID, function (dbRequestDetails) {
												if (dbRequestDetails.length == 0) {
													users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss1, function (id) {
														custom.welcomeCall(id, userAPI.first_name, "old", "yes", "no","no"); //make it yes
													});

												} else {
													users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss1, function (id) {
														custom.welcomeCall(id, userAPI.first_name, "old", "yes", "yes","no"); //make it yes
													});
												}
											});
										}
									});
								});
								return;
							} else {
								//log.error("Unale to fetch user details.");
								return;
							}
							return;
						});
					});
					break;

				case "REQUEST_BLOOD":
				case "PERSISTENT_MENU_NEED":
					log.info("need clicked");
					users.removeUsers(senderID, function (id) {
						request({
							uri: 'https://graph.facebook.com/v2.6/' + id + '?access_token=' + config.PAGE_ACCESS_TOKEN,
							method: 'GET'
						}, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								let userAPI = JSON.parse(body);
								database.insertUsertoBOT(senderID, userAPI.first_name, userAPI.last_name, null, null, userAPI.profile_pic, userAPI.gender, null, null, common.uniquePicCode(userAPI.profile_pic), userAPI.timezone, function (dbUserDetails) {
									database.fetchActiveRequestDetailsWithFpid(senderID, function (dbRequestDetails) {
										if (dbRequestDetails.length == 0) {
											users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss2a, function (id) {
												custom.askBloodGroup(id, "request");
											});

										} else {

											users.insertUser(dbUserDetails.fpid, userAPI.first_name, userAPI.last_name, userAPI.profile_pic, dbUserDetails.mobile, userAPI.gender, userAPI.timezone, dbUserDetails.verified, states.ss2xy, function (id) {
												//custom.askBloodGroup(id, "request");
												database.fetchDonorDetails(senderID, function (dbDonorDetails) {
												if (dbDonorDetails.length >= 1) {
													custom.hasActiveRequestUserMenuclick(senderID, "yes","no");
												} else {
													custom.hasActiveRequestUserMenuclick(senderID, "no","no");
												}
											});
											});

										}
									});
									return;
								});
							} else {
								//log.error("Unale to fetch user details on share ride.");
								return;
							}
							return;
						});
					});
					break;

				default:
					let user = users.getUsers(senderID)[0];
					if ((typeof (user) !== 'undefined') && (typeof (user.state) !== 'undefined')) {

						//Dynamic state defined switch
						switch (postbArr[0] + "|" + postbArr[1] + "|" + user.state) {

						case "PICKUP|LOCATION|" + states.ss3:
						case "PICKUP|LOCATION|" + states.ss3a:
							if ((isNaN(user.pickupLocs[postbArr[2]].location.lat)) || (isNaN(user.pickupLocs[postbArr[2]].location.long)) || (user.pickupLocs[postbArr[2]].location.lat == '') || (user.pickupLocs[postbArr[2]].location.long == '')) {
								errorMessages.handle(user, function (id) {
									custom.notValidLatLng(id);
								});
							} else {
								if (user.state == states.ss3) {
									users.updateStatewithValueErrorCount(user.fpid, states.ss5, 0, "pickup", {
										title: user.pickupLocs[postbArr[2]].title,
										location: user.pickupLocs[postbArr[2]].location
									}, function (id) {
										custom.askMobileNumber(id, "donor");
									});

								} else if (user.state == states.ss3a) {
									users.updateStatewithValueErrorCount(user.fpid, states.ss12, 0, "pickup", {
										title: user.pickupLocs[postbArr[2]].title,
										location: user.pickupLocs[postbArr[2]].location
									}, function (id) {
										custom.askDateTimeFreeForm(id);
									});
								}
							}
							break;
						case "PICKUP|LOCATION|" + states.ss7e1:
						case "PICKUP|LOCATION|" + states.ss7e:
							log.info("pickup clicked pickup1");
							if ((isNaN(user.pickupLocs[postbArr[2]].location.lat)) || (isNaN(user.pickupLocs[postbArr[2]].location.long)) || (user.pickupLocs[postbArr[2]].location.lat == '') || (user.pickupLocs[postbArr[2]].location.long == '')) {
								errorMessages.handle(user, function (id) {
									custom.notValidLatLng(id);
								});
							} else {
								users.updateStatewithValueErrorCount(user.fpid, user.state, 0, "pickup", {
									title: user.pickupLocs[postbArr[2]].title,
									location: user.pickupLocs[postbArr[2]].location
								}, function (id) {
									if (user.state == states.ss7e) {
										users.updateState(user.fpid, states.ss7b, function (id) {
											custom.changeDonorMessage(id, user.pickup.title, user.bgtype);
										});
									} else if (user.state == states.ss7e1) {
										users.updateState(user.fpid, states.ss7b1, function (id) {
											custom.changeRequestMessage(id, user.pickup.title, user.bgtype, user.date, user.time);
										});
									}
								});
							}
							break;

						default:

							//Static state defined switch
							switch (postbackPayload + "|" + user.state) {
							case "OTP_RESEND|" + states.ss7:
							case "OTP_RESEND|" + states.ss7a:
								let otp = user.otp;
								sms.sendOTP(user.mobile,otp,function(status){
									if (user.state == states.ss7) {
										database.updateUserDetails(user.fpid, user.firstName, user.lastName, null, user.mobile, user.profilePic, user.gender, String(otp), user.mobileCountry, common.uniquePicCode(user.profilePic), function (dbUserDetails) {
											users.updateStatewithValue(user.fpid, states.ss7, "verified", otp, function (id) {
												custom.resendOTP(id);
											});
										});
									} else {
										users.updateStatewithValue(user.fpid, states.ss7a, "verified", otp, function (id) {
											custom.resendOTP(id);
										});
									}
								});
								break;

							case "OTP_CHANGE_MOBILE|" + states.ss7:
							case "OTP_CHANGE_MOBILE|" + states.ss7a:
								log.trace("[postBack] ["+user.firstName+"] ["+user.fpid+"] [Want to change mobile number]");
								var setState, usertype;
								if (user.state == states.ss7) {
									setState = states.ss5;
									usertype = "donor";
								} else if (user.state == states.ss7a) {
									setState = states.ss5a;
									usertype = "request";
								}
								users.updateState(user.fpid, setState, function (id) {
									custom.askMobileNumber(id);
								});
								break;

							case "FINAL_DONOR_CONFIRMATION_CHANGE_BLOODGROUP|" + states.ss7b:
								log.trace("[postBack] ["+user.firstName+"] ["+user.fpid+"] [Donor want to change bloodgroup]");
								users.updateState(user.fpid, states.ss7c, function (id) {
									custom.askBloodGroup(id, "donor");
								});
								break;

							case "FINAL_DONOR_CONFIRMATION_CHANGE_LOCATION|" + states.ss7b:
								log.trace("[postBack] ["+user.firstName+"] ["+user.fpid+"] [Donor want to change location]");
								users.updateState(user.fpid, states.ss7d, function (id) {
									custom.pickUpLocationMessage(id, "donor");
								});
								break;

							case "FINAL_DONOR_CONFIRM|" + states.ss7b:
								log.trace("[postBack] ["+user.firstName+"] ["+user.fpid+"] [Donor Confirmed Details]");
								database.fetchActiveRequestMatches(user.fpid, user.bgtype, common.LatLngtoPoint(user.pickup.location), 4326, function (matches) {
									if (matches.length >= 1) {
										let matchList = [];
										for (let person = 0; person < 10; person++) {
											matchList.push({
												reqID: matches[person].reqid_,
												fpid: matches[person].fpid_,
												name: matches[person].firstname_ + " " + matches[person].lastname_,
												pickup: matches[person].location_,
												profilePicture: matches[person].profilepicture_,
												mobileNumber: matches[person].mobile_,
												bloodGroup: matches[person].bloodgroup_
											});
										}

										database.updateUserDetails(user.fpid, user.firstName, user.lastName, null, user.mobile, user.profilePic, user.gender, "VERIFIED", user.mobileCountry, common.uniquePicCode(user.profilePic), function (dbUserDetails) {
											if (user.tid) {
												database.updateDonorDetails(user.tid, user.bgtype, user.pickup.title, common.LatLngtoPoint(user.pickup.location), 4326, function () {
													users.updateState(user.fpid, states.ss9, function (id) {
														custom.activeRequestsToDonor(user.fpid);
														setTimeout(function () {
															custom.requestersCardToDonor(user.fpid, matchList);
														}, 2000);
													});
												});
											} else {
												database.insertDonorDetails(user.fpid, user.bgtype, user.pickup.title, common.LatLngtoPoint(user.pickup.location), 4326, function (tid) {
													users.updateStatewithValue(user.fpid, states.ss9, "tid", tid, function (id) {
														custom.activeRequestsToDonor(user.fpid);
														setTimeout(function () {
															custom.requestersCardToDonor(user.fpid, matchList);
														}, 2000);
													});
												});
											}
										});

									} else {
										database.updateUserDetails(user.fpid, user.firstName, user.lastName, null, user.mobile, user.profilePic, user.gender, "VERIFIED", user.mobileCountry, common.uniquePicCode(user.profilePic), function (dbUserDetails) {
											if (user.tid) {
												database.updateDonorDetails(user.tid, user.bgtype, user.pickup.title, common.LatLngtoPoint(user.pickup.location), 4326, function () {
													users.updateState(user.fpid, states.ss9, function (id) {
														custom.confirmedDonorMessage(user.fpid, user.firstName);
													});
												});
											} else {
												database.insertDonorDetails(user.fpid, user.bgtype, user.pickup.title, common.LatLngtoPoint(user.pickup.location), 4326, function (tid) {
													users.updateStatewithValue(user.fpid, states.ss9, "tid", tid, function (id) {
														custom.confirmedDonorMessage(user.fpid, user.firstName);
													});
												});
											}
										});

									}
								});
								break;

							case "FINAL_REQUEST_CONFIRMATION_CONFIRM|" + states.ss7b1:
								log.trace("[postBack] ["+user.firstName+"] ["+user.fpid+"] [Request confirmed]");
								if (user.tid) {
									database.updateDonorDetails(user.tid, user.bgtype, user.pickup.title, common.LatLngtoPoint(user.pickup.location), common.makeDateTime(user.date, user.time, user.timezone), user.mobile, user.verified, user.mobileCountry, 4326, function () {
										users.updateState(user.fpid, states.ss9, function (id) {
											custom.confirmedRequesterMessage(user.fpid, user.firstName);
										});
									});
								} else {
									database.insertRequestDetails(user.fpid, user.bgtype, user.pickup.title, common.LatLngtoPoint(user.pickup.location), common.makeDateTime(user.date, user.time, user.timezone), user.mobile, user.verified, user.mobileCountry, 4326, function (tid) {
										users.updateStatewithValue(user.fpid, states.ss9, "tid", tid, function (id) {
											custom.confirmedRequesterMessage(user.fpid, user.firstName);
											setTimeout(function () {
												custom.ShareRequesterMessage(user.fpid, user.firstName);
												setTimeout(function () {
													custom.ShareRequesterCardMessage(user.fpid, user.firstName, user.pickup.title, user.bgtype, user.date, user.time);
												}, 2000);
											}, 2000);
										});
									});
								}
								database.fetchDonorMatches(user.fpid, user.bgtype, common.LatLngtoPoint(user.pickup.location), 4326, function (matches) {
									if (matches.length >= 1) {
										for (let person = 0; person < matches.length; person++) {
											/*log.info(" share request details card 13" + user.fpid + user.tid);
											matchList.push({
												fpid: matches[person].fpid_,
												name: matches[person].firstname_ + " " + matches[person].lastname_,
												pickup: matches[person].location_,
												profilePicture: matches[person].profilepicture_,
												mobileNumber: matches[person].mobile_,
												bloodGroup: matches[person].bloodgroup_
											});*/
											custom.askReadyToDonate(matches[person].fpid_, user.tid);
										}
									}
								});
								break;

							case "FINAL_REQUEST_CONFIRMATION_CHANGE|" + states.ss7b1:
								log.trace("[postBack] ["+user.firstName+"] ["+user.fpid+"] [Requester want to change details]");
								users.updateState(user.fpid, states.ss7b1x, function (id) {
									custom.changeRequestDeailsMessage(id, user.pickup.title, user.bgtype, user.date, user.time);
								});
								break;

							case "REQUEST_CHANGE_BLOODGROUP|" + states.ss7b1x:
								log.trace("[postBack] ["+user.firstName+"] ["+user.fpid+"] [Requester want to change bloodgroup]");
								users.updateState(user.fpid, states.ss7c1, function (id) {
									custom.askBloodGroup(id, "request")
								});
								break;

							case "REQUEST_CHANGE_LOCATION|" + states.ss7b1x:
								log.trace("[postBack] ["+user.firstName+"] ["+user.fpid+"] [Donor want to change location]");
								users.updateState(user.fpid, states.ss7d1, function (id) {
									custom.pickUpLocationMessage(id, "request")
								});
								break;

							case "REQUEST_CHANGE_TIME|" + states.ss7b1x:
								log.trace("[postBack] ["+user.firstName+"] ["+user.fpid+"] [Donor want to change time]");
								users.updateState(user.fpid, states.ss7f, function (id) {
									custom.askDateTimeFreeForm(id);
								});
								break;

							case "LIST_LOCATION_FOUND|" + states.ss3:
							case "LIST_LOCATION_FOUND|" + states.ss3a:
							case "LIST_LOCATION_FOUND|" + states.ss7e:
							case "LIST_LOCATION_FOUND|" + states.ss7e1:
								log.trace("[postBack] ["+user.firstName+"] ["+user.fpid+"] [User searched location found]");
								errorMessages.handle(user, function (id) {
									custom.locationFoundMessage(id);
								});
								break;

							case "LIST_LOCATION_NOT_FOUND|" + states.ss3:
							case "LIST_LOCATION_NOT_FOUND|" + states.ss3a:
							case "LIST_LOCATION_NOT_FOUND|" + states.ss7e:
							case "LIST_LOCATION_NOT_FOUND|" + states.ss7e1:
								log.trace("[postBack] ["+user.firstName+"] ["+user.fpid+"] [User searched location found]");
								var setState, usertype;
								users.updateStatewithValue(user.fpid, user.state, "errorCount", user.errorCount, function (id) {
									errorMessages.handle(user, function (id) {
										custom.locationNotFoundMessage(id);
									});
								});
								break;

							default:
								errorMessages.handle(user, function (id) {
									custom.inappropriateButtonClick(user.fpid);
								});
								break;
							}
						}
					} else {
						custom.inappropriateButtonClick(senderID);
						break;
					}
				}
				return;
			}
			return;
		}
	}
}

const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	fbmsg = require("../fbMessageFunctions/fbMessageFunctions.js"),
	users = require("../data/db.js"),
	states = require("../data/states.js"),
	dateTimeParser = require("../behaviours/dateTimeParser.js"),
	common = require("../behaviours/common.js"),
	errorMessages = require("./errorMessages.js"),
	database = require("../database/dbPostgreSQL.js"),
	log = require('../behaviours/logger.js'),
	phone = require("phone"),
	geocode = require('../api/geocode.js'),
	lookup = require('country-data').lookup;

const inFile = module.exports = {
	handle: function (user, messageText) {
		let travelTime, travelDate;

		switch (user.state) {
			case states.ss1:
				database.fetchDonorDetails(user.fpid, function (dbhDonorDetails) {
					if (dbhDonorDetails.length == 0) {
						if (user.verified) {
							database.fetchActiveRequestDetailsWithFpid(user.fpid, function (dbRequestDetails) {
								if (dbRequestDetails.length == 0) {
									custom.welcomeCall(user.fpid, user.firstName, "old", "no", "no","yes");
								}
								else {
									custom.welcomeCall(user.fpid,user.firstName, "old", "no", "yes","yes");
								}
							});
						}
						else {
							custom.welcomeCall(user.fpid, user.firstName, "new", "no", "no","no");
						}
					}
					else {
						database.fetchActiveRequestDetailsWithFpid(user.fpid, function (dbRequestDetails) {
							if (dbRequestDetails.length == 0) {
								custom.welcomeCall(user.fpid,user.firstName, "old", "yes", "no","yes");
							}
							else {
								custom.welcomeCall(user.fpid, user.firstName, "old", "yes", "yes","yes");
							}
						});
					}
				});
				break;

		case states.ss2xx:
			database.fetchActiveRequestDetailsWithFpid(user.fpid, function (dbRequesterDetails) {
				if (dbRequesterDetails.length >= 1) {
					custom.alreadyRegisterdUserMenuclick(user.fpid, "yes","yes");
				} else {
					custom.alreadyRegisterdUserMenuclick(user.fpid, "no","yes");
				}
			});
			break;

		case states.ss2xy:
			database.fetchDonorDetails(user.fpid, function (dbDonorDetails) {
				if (dbDonorDetails.length >= 1) {
					custom.hasActiveRequestUserMenuclick(user.fpid, "yes","yes");
				} else {
					custom.hasActiveRequestUserMenuclick(user.fpid, "no","yes");
				}
			});
			break;

		case states.ss12:
		case states.ss7f:
			let parsedDateTime = dateTimeParser.dateTimeFreeForm(messageText, user.timezone);
			if (parsedDateTime == "past") {
				errorMessages.handle(user, function (id) {
					custom.askDateTimeFreeFormPast(id);
				});
			} else if (parsedDateTime != null) {
				if (user.state == states.ss12) {
					users.updateStatewithValue(user.fpid, states.ss5a, "date", parsedDateTime.date, function (id) {
						users.updateStatewithValue(user.fpid, states.ss5a, "time", parsedDateTime.time, function (id) {
							custom.askMobileNumber(id, "request");
						});
					});
				} else {
					users.updateStatewithValue(user.fpid, states.ss7b1, "date", parsedDateTime.date, function (id) {
						users.updateStatewithValue(user.fpid, states.ss7b1, "time", parsedDateTime.time, function (id) {
							custom.changeRequestMessage(id, user.pickup.title, user.bgtype, user.date, user.time);
						});
					});
				}
			} else {
				errorMessages.handle(user, function (id) {
					custom.askDateTimeFreeFormWrong(id);
				});
			}
			break;

		case states.ss2:
		case states.ss2a:
		case states.ss7c:
		case states.ss7c1:
			var setState, usertype;
			var tempbgtype = messageText.replace(/\s/g, "").toUpperCase();
			bloodGroupArray = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
			if (bloodGroupArray.indexOf(tempbgtype) > -1) {
				if (user.state == states.ss2) {
					setState = states.ss3;
					usertype = "donor";
					users.updateStatewithValue(user.fpid, setState, "bgtype", tempbgtype, function (id) {
						custom.pickUpLocationMessage(id, usertype);
					});
				} else if (user.state == states.ss2a) {
					setState = states.ss3a;
					usertype = "request";
					users.updateStatewithValue(user.fpid, setState, "bgtype", tempbgtype, function (id) {
						custom.pickUpLocationMessage(id, usertype);
					});
				} else if (user.state == states.ss7c) {
					users.updateStatewithValue(user.fpid, states.ss7b, "bgtype", tempbgtype, function (id) {
						custom.changeDonorMessage(id, user.pickup.title, user.bgtype);
					});
				} else if (user.state == states.ss7c1) {
					users.updateStatewithValue(user.fpid, states.ss7b1x, "bgtype", states.ss7b1, function (id) {
						custom.changeRequestMessage(id, user.pickup.title, user.bgtype);
					});
				}
			} else {
				errorMessages.handle(user, function (id) {
					custom.askBloodGroupWrong(id);
				});
			}
			break;

		case states.ss3:
		case states.ss3a:
			var setState;
			if (user.state == states.ss3) setState = states.ss3;
			else if (user.state == states.ss3a) setState = states.ss3a;
			geocode.getLocations(messageText, function (locs) {
				if ((locs.length == 0) || (locs == 404)) {
					errorMessages.handle(user, function (id) {
						custom.notValidLatLng(id);
					});
				} else {
					users.updateStatewithValue(user.fpid, setState, "errorCount", user.errorCount, function (id) {
						users.updateStatewithValue(user.fpid, setState, "pickupLocs", locs, function (id) {
							custom.locsListMessage(id, locs, "pickup");
						});
					});
				}
			});
			break;

		case states.ss7d:
		case states.ss7d1:
			var setState;
			if (user.state == states.ss7d) setState = states.ss7e;
			else if (user.state == states.ss7d1) setState = states.ss7e1;
			geocode.getLocations(messageText, function (locs) {
				if ((locs.length == 0) || (locs == 404)) {
					errorMessages.handle(user, function (id) {
						custom.notValidLatLng(id);
					});
				} else {
					users.updateStatewithValue(user.fpid, setState, "errorCount", user.errorCount, function (id) {
						users.updateStatewithValue(user.fpid, setState, "pickupLocs", locs, function (id) {
							custom.locsListMessage(id, locs, "pickup");
						});
					});
				}
			});
			break;

		case states.ss5:
		case states.ss5a:
			let internationalNumber = new RegExp(/^\d{1,5}\d{6,11}$/);
			if (internationalNumber.test(messageText)) {
				let countryCode = phone("+" + String(messageText));
				if (countryCode.length != 0) {
					let countryName = lookup.countries({
						alpha3: countryCode[1]
					})[0].name;
					if (!countryName) {
						countryName = countryCode[1];
					}
					if (user.state == states.ss5) {
						database.updateUserDetails(user.fpid, user.firstName, user.lastName, null, messageText, user.profilePic, user.gender, null, null, common.uniquePicCode(user.profilePic), function (dbUserDetails) {
							users.updateStatewithValue(user.fpid, states.ss6, "mobileCountry", countryName, function (id) {
								users.updateStatewithValue(user.fpid, states.ss6, "mobile", messageText, function (id) {
								custom.askWhichCountry(id, countryName);
							});
							});
						});
					} else if (user.state == states.ss5a) {
						users.updateStatewithValue(user.fpid, states.ss6a, "mobileCountry", countryName, function (id) {
							users.updateStatewithValue(user.fpid, states.ss6a, "mobile", messageText, function (id) {
								custom.askWhichCountry(id, countryName);
							});
						});

					}
				}
				else {
				errorMessages.handle(user, function (id) {
					custom.askMobileNumberWrong(id);
				});
			}

			} else {
				errorMessages.handle(user, function (id) {
					custom.askMobileNumberWrong(id);
				});
			}
			break;

		case states.ss6:
		case states.ss6a:
			errorMessages.handle(user, function (id) {
				custom.askWhichCountryWrong(id, user.mobileCountry);
			});
			break;

		case states.ss7:
		case states.ss7a:
			if (user.verified == messageText) {
				if (user.state == states.ss7) {
					users.updateState(user.fpid, states.ss7b, function (id) {
						custom.changeDonorMessage(id, user.pickup.title, user.bgtype);
					});
				} else if (user.state == states.ss7a) {
					users.updateState(user.fpid, states.ss7b1, function (id) {
						custom.changeRequestMessage(id, user.pickup.title, user.bgtype, user.date, user.time);
					});
				}
			} else {
				custom.askOTPWrong(user.fpid);
			}
			break;

		case states.ss9a:
		case states.ss9:
		case states.ss9b:
			users.removeUsers(user.fpid, function (id) {
				custom.thanksStayInTouch(id);
			});
			break;

		default:
			errorMessages.handle(user, function (id) {
				custom.inappropriateButtonClick(user.fpid);
			});
			break;
		}
		return;
	}
}

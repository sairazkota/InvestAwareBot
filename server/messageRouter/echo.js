const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	users = require("../data/db.js"),
	database = require("../database/dbPostgreSQL.js"),
	common = require("../behaviours/common.js"),
	log = require('../behaviours/logger.js'),
	config = require("./../config.js"),
	states = require("../data/states.js"),
	dateTimeParser = require("../behaviours/dateTimeParser.js"),
	graphAPI = require("../api/graphapiFB.js");



const inFile = module.exports = {
	handle: function (user, metadata) {

		switch (metadata) {

		case "CONFIREMD_DONOR_MESSAGE":
			custom.ShareDonorMessage(user.fpid, user.firstName);
			break;

		case "CONFIREMD_REQUESTER_MESSAGE":
			custom.ShareRequesterMessage(user.fpid, user.firstName);
			break;

		case "SHARE_DONOR_MESSAGE":
			custom.ShareDonorCardMessage(user.fpid, user.firstName, "donor", user.pickup.title, user.bgtype);
			break;


		default:
			let metadataArr = metadata.split("_");
			switch (metadataArr[0] + "|" + metadataArr[1]) {

			case "DONOR|READY":
				database.fetchRequestDetailsWithRequestid(metadataArr[2], function (dbRequesterDetails) {
					if (dbRequesterDetails.length >= 1) {
						for (let person = 0; person < dbRequesterDetails.length; person++) {
							let date = common.extractDate(new Date(String(dbRequesterDetails[person].requesttime)), dbRequesterDetails[person].timezone);

							let time = common.extractTime(new Date(String(dbRequesterDetails[person].requesttime)), dbRequesterDetails[person].timezone);

							custom.requesterCardToDonor(metadataArr[3], dbRequesterDetails[person].firstname + " " + dbRequesterDetails[person].lastname, dbRequesterDetails[person].location, dbRequesterDetails[person].bloodgroup, dbRequesterDetails[person].mobile, date, time, dbRequesterDetails[person].profilepicture);
						}
					}
				});
				break;

			case "DONOR|FOUND":
				log.info("donor found in echo" + metadataArr[3] + ":" + metadataArr[2]);
				database.fetchDonorOfReq(metadataArr[3], function (dbRequesterDetails) {
					if (dbRequesterDetails.length >= 1) {
						var donorList = [];
						for (let person1 = 0; person1 < dbRequesterDetails.length; person1++) {
							donorList.push({
								fpid: dbRequesterDetails[person1].fpid,
								name: dbRequesterDetails[person1].firstname + " " + dbRequesterDetails[person1].lastname,
								pickup: dbRequesterDetails[person1].location,
								profilePicture: dbRequesterDetails[person1].profilepicture,
								mobileNumber: dbRequesterDetails[person1].mobile,
								bloodGroup: dbRequesterDetails[person1].bloodgroup
							});
						}
						custom.DonorCardToRequester(user.fpid, donorList);
						setTimeout(function () {
							custom.finalRequesterMessage(user.fpid);
						}, 2000);
					}
				});
				break;

			default:
				errorMessages.handle(user, function (id) {
					custom.inappropriateButtonClick(user.fpid);
				});
				break;
			}
		}
		return;
	}
}

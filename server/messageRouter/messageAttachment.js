const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	users = require("../data/db.js"),
	states = require("../data/states.js"),
	log = require('../behaviours/logger.js'),
	errorMessages = require("./errorMessages.js");

const inFile = module.exports = {
	handle: function (user, messageAttachments) {

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

		case states.ss2:
		case states.ss2a:
		case states.ss7c:
		case states.ss7c1:
			errorMessages.handle(user, function (id) {
				custom.askBloodGroupWrong(user.fpid);
			});
			break;

		case states.ss3:
    case states.ss3a:
		case states.ss3:
    case states.ss3a:
      if(messageAttachments && messageAttachments[0].type=="location"){
        if((!isNaN(messageAttachments[0].payload.coordinates.lat))&&(!isNaN(messageAttachments[0].payload.coordinates.long)&&(messageAttachments[0].payload.coordinates.lat!='')&&(messageAttachments[0].payload.coordinates.long!=''))){
					if (user.state == states.ss3) {
						users.updateStatewithValueErrorCount(user.fpid, states.ss5, 0, "pickup", {title:messageAttachments[0].title,location:messageAttachments[0].payload.coordinates}, function (id) {
							custom.askMobileNumber(id, "donor");
						});
					}
					else if (user.state == states.ss3a) {
						users.updateStatewithValueErrorCount(user.fpid, states.ss12, 0, "pickup", {title:messageAttachments[0].title,location:messageAttachments[0].payload.coordinates}, function (id) {
							custom.askDateTimeFreeForm(id);
						});
					}
					else if (user.state == states.ss7e) {
						users.updateStatewithValueErrorCount(user.fpid, states.ss7b, 0, "pickup", {title:messageAttachments[0].title,location:messageAttachments[0].payload.coordinates}, function (id) {
							custom.changeDonorMessage(id, user.pickup.title, user.bgtype);
						});
					}
					else if (user.state == states.ss7e1) {
						users.updateStatewithValueErrorCount(user.fpid, states.ss7b1, 0, "pickup", {title:messageAttachments[0].title,location:messageAttachments[0].payload.coordinates}, function (id) {
							custom.changeRequestMessage(id, user.pickup.title, user.bgtype, user.date, user.time);
						});
					}
        }
        else{
          errorMessages.handle(user,function(id){
            custom.notValidLatLng(id);
            log.trace("[attachments] ["+user.state+"] ["+user.fpid+"] User "+user.firstName+", provided pickup location but has problems in lat longs. ["+user.state+"]");
          });
        }
      }
      else {
        errorMessages.handle(user,function(id){
          custom.notValidLocation(id);
          log.trace("[attachments] ["+user.state+"] ["+user.fpid+"] User "+user.firstName+", given a wrong pickup location. ["+user.state+"]");
        });
        return;
      }
      break;

		case states.ss12:
		case states.ss7f:
			errorMessages.handle(user, function (id) {
				custom.askDateTimeFreeFormWrong(id);
			});
			break;

		case states.ss5:
		case states.ss5a:
			errorMessages.handle(user, function (id) {
				custom.askMobileNumberWrong(id);
			});
			break;

		case states.ss6:
		case states.ss6a:
			errorMessages.handle(user, function (id) {
				custom.askWhichCountryWrong(id, user.mobileCountry);
			});
			break;

		case states.ss7:
		case states.ss7a:
			errorMessages.handle(user, function (id) {
				custom.askOTPWrong(user.fpid);
			});
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

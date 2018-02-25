const
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	database = require("../database/dbPostgreSQL.js"),
	log = require('../behaviours/logger.js'),
	users = require("../data/db.js");

module.exports = {
	handle: function (user, wrongReplyMessage) {
		users.updateErrorCount(user.fpid, user.errorCount + 1, function (id) {
			if (user.errorCount < 5) {
				wrongReplyMessage(id);
				return;
			} else {
				database.errorDump(JSON.stringify(user));
				custom.errorCommonMessage(id);
				return;
			}
			return;
		});
	}
}
const
	request = require('request'),
	log = require('../behaviours/logger.js'),
	config = require("./../config.js");

const inFile = module.exports = {
	call: function (userid, _callback) {
		request({
			uri: 'https://graph.facebook.com/v2.6/' + userid + '?access_token=' + config.PAGE_ACCESS_TOKEN,
			method: 'GET'
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				let userAPI = JSON.parse(body);
				_callback(userAPI);
			} else {
				log.error("Unale to fetch user details in initjs.");
				return;
			}
		});
	}
}
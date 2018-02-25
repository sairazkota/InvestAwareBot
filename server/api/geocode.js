const
	config = require("./../config.js"),
	log = require('../behaviours/logger.js'),
	request = require('request'),
	_ = require('lodash');

const inFile = module.exports = {
	getLocations: function (inputText, _callback) {
		request("https://maps.googleapis.com/maps/api/geocode/json?key=" + config.GOOGLE_KEY + "&address=" + inputText, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				let results = JSON.parse(response.body).results;
				let locations = [];
				_(results).forEach(function (result) {
					locations.push({
						title: result.formatted_address,
						location: {
							lat: result.geometry.location.lat,
							long: result.geometry.location.lng
						}
					});
				});
				return _callback(locations);
			} else {
				log.error(" [geocode-api] Unable to get address list.");
				log.error(error);
				return _callback(404);
			}
		});
	}
}

//inFile.getLocations("Secunderabad Railway Station",function(loc){console.log(loc)});
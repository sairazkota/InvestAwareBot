const
	Sequelize = require('sequelize');
	log = require('../behaviours/logger.js');
//const sequelize = new Sequelize('postgres://chintakr:@localhost:5432/chintakr', {logging:function logging(msg){log.info('[DATABASE] ' + msg);}});
//const sequelize = new Sequelize('postgres://xportapp:xP0rT0pp20!6@localhost:5432/xportapp', {logging:function logging(msg){log.info('[DATABASE] ' + msg);}});
const sequelize = new Sequelize('postgres://uesndonefexzbt:DMVcI5t35viN5dsl9DJNvfrw0Z@ec2-54-243-204-74.compute-1.amazonaws.com:5432/d4cc8m66rq7u1t');
sequelize
	.authenticate()
	.then(function (err) {
		log.info("Connected to PS" + err);
	})
	.catch(function (err) {
		log.error("error Connected to PS" + err);
	});

const inFile = module.exports = {
	insertUsertoBOT: function (_fpid, _firstName, _lastName, _emailID, _mobile, _profilePicture, _gender, _verified, _mobileCounty, _profileUniqueCode, _timezone, _callback) {
		sequelize.query('SELECT * FROM insert_bloodshare_bot_users(:param1,:param2,:param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10,:param11 )', {
			replacements: {
				param1: _fpid,
				param2: _firstName,
				param3: _lastName,
				param4: _emailID,
				param5: _mobile,
				param6: _profilePicture,
				param7: _gender,
				param8: _verified,
				param9: _mobileCounty,
				param10: _profileUniqueCode,
				param11: _timezone
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (userDetails) {
			_callback(userDetails[0]);
		});
	},
	updateUserDetails: function (_fpid, _firstName, _lastName, _emailID, _mobile, _profilePicture, _gender, _verified, _mobileCountry, _profileUniqueCode, _callback) {

		sequelize.query('SELECT * FROM update_bloodshare_bot_user(:param1,:param2,:param3, :param4, :param5, :param6, :param7, :param8, :param9, :param10 )', {
			replacements: {
				param1: _fpid,
				param2: _firstName,
				param3: _lastName,
				param4: _emailID,
				param5: _mobile,
				param6: _profilePicture,
				param7: _gender,
				param8: _verified,
				param9: _mobileCountry,
				param10: _profileUniqueCode
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (userDetails) {
			_callback(userDetails[0]);
		}).catch(function (err) {
			log.info('Unable to connect to the database: updateUserDetails', err);
		});
	},
	insertDonorDetails: function (_fpid, _BGTYPE, _location, _locPoint, _SRID, _callback) {
		sequelize.query('SELECT * FROM insert_bloodgroup_details(:param1,:param2,:param3,:param4,:param5)', {
			replacements: {
				param1: _fpid,
				param2: _BGTYPE,
				param3: _location,
				param4: _locPoint,
				param5: _SRID
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (insertedDonor) {
			_callback(insertedDonor[0].insert_bloodgroup_details);
		});
	},
	insertRequestDetails: function (_fpid, _BGTYPE, _location, _locPoint, _requestTime, _mobile, _verified, _mobileCountry, _SRID, _callback) {
		log.info("insertRequestDetails database");
		sequelize.query('SELECT * FROM insert_request_details(:param1,:param2,:param3,:param4,:param5,:param6,:param7,:param8,:param9)', {

			replacements: {
				param1: _fpid,
				param2: _BGTYPE,
				param3: _location,
				param4: _locPoint,
				param5: _requestTime,
				param6: _mobile,
				param7: String(_verified),
				param8: _mobileCountry,
				param9: _SRID
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (insertedReqest) {
			_callback(insertedReqest[0].insert_request_details);
		}).catch(function (err) {
			log.info('Unable to connect to the database: insertRequestDetails', err);
		});
	},

	updateDonorDetails: function (_donorID, _BGTYPE, _location, _locPoint, _SRID, _callback) {
		sequelize.query('SELECT * FROM update_bloodgroup_details(:param1,:param2,:param3,:param4,:param5)', {
			replacements: {
				param1: _donorID,
				param2: _BGTYPE,
				param3: _location,
				param4: _locPoint,
				param5: _SRID
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function () {
			_callback();
		});
	},
	updateRequestDetails: function (_reqestID, _BGTYPE, _location, _locPoint, _requestTime, _mobile, _verified, _mobileCountry, _matchedDonorIds, _SRID, _callback) {
		log.info("updateRequestDetails database");
		sequelize.query('SELECT * FROM update_request_details(:param1,:param2,:param3,:param4,:param5,:param6,:param7,:param8,:param9,:param10)', {
			replacements: {
				param1: _reqestID,
				param2: _BGTYPE,
				param3: _location,
				param4: _locPoint,
				param5: _requestTime,
				param6: _mobile,
				param7: String(_verified),
				param8: _mobileCountry,
				param9: _matchedDonorIds,
				param10: _SRID

			},
			type: sequelize.QueryTypes.SELECT
		}).then(function () {
			_callback();
		}).catch(function (err) {
			log.info('Unable to connect to the database: updateRequestDetails', err);
		});
	},
	fetchDonorDetails: function (_fpid, _callback) {
		sequelize.query('SELECT * FROM fetch_donor_details(:param1)', {
			replacements: {
				param1: _fpid
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (userDonorDetails) {
			_callback(userDonorDetails);
		});
	},
		fetchDonorOfReq: function (_reqId, _callback) {
		sequelize.query('SELECT * FROM fetch_donars_of_req(:param1)', {
			replacements: {
				param1: _reqId
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (fetchDonorOfReq) {
			_callback(fetchDonorOfReq);
		});
	},
	fetchRequestDetailsWithFpid: function (_fpid, _callback) {
		sequelize.query('SELECT * FROM fetch_request_details_with_fpid(:param1)', {
			replacements: {
				param1: _fpid
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (userRequestDetails1) {
			_callback(userRequestDetails1);
		});
	},
	fetchActiveRequestDetailsWithFpid: function (_fpid, _callback) {
		sequelize.query('SELECT * FROM fetch_active_request_details_with_fpid(:param1)', {
			replacements: {
				param1: _fpid
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (fetchActiveRequestDetailsWithFpid) {
			_callback(fetchActiveRequestDetailsWithFpid);
		});
	},
	fetchRequestDetailsWithRequestid: function (_requestId, _callback) {
		sequelize.query('SELECT * FROM fetch_request_details_with_requestid(:param1)', {
			replacements: {
				param1: _requestId
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (userRequestDetails) {
			_callback(userRequestDetails);
		}).catch(function (err) {
			log.info('Unable to connect to the database: fetchRequestDetailsWithRequestid', err);
		});;
	},

	fetchDonorMatches: function (_reqFpid, _bloodgrouptype, _locPoint, _srid, _callback) {
		sequelize.query('SELECT * FROM fetch_donor_matches(:param1, :param2, :param3, :param4,:param5)', {
			replacements: {
				param1: _reqFpid,
				param2: _bloodgrouptype,
				param3: _locPoint,
				param4: _srid,
				param5: 2000
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (matchesDonorDetails) {
			_callback(matchesDonorDetails);
		}).catch(function (err) {
			log.info('Unable to connect to the database: matchesDonorDetails', err);
		});

	},
	fetchActiveRequestMatches: function (_donorFpid, _bloodgrouptype, _locPoint, _srid, _callback) {
		sequelize.query('SELECT * FROM fetch_active_request_matches(:param1, :param2, :param3, :param4,:param5)', {
			replacements: {
				param1: _donorFpid,
				param2: _bloodgrouptype,
				param3: _locPoint,
				param4: _srid,
				param5: 2000
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (matchesDonorDetails) {
			_callback(matchesDonorDetails);
		}).catch(function (err) {
			log.info('Unable to connect to the database: fetchActiveRequestMatches', err);
		});

	},
	fetchRequestStatus: function (_buffer, _callback) {
		sequelize.query('SELECT * FROM fetch_request_status(:param1)', {
			replacements: {
				param1: _buffer
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (userRequestDetails) {
			_callback(userRequestDetails);
			log.info("successfully updated status");
		}).catch(function (err) {
			log.info('Unable to connect to the database: fetchRequestStatus', err);
		});
	},
	updateDonorIdsToRequester: function (_requestID, _donorIds, _callback) {
		sequelize.query('SELECT * FROM update_donorid_into_request_details(:param1,:param2)', {
			replacements: {
				param1: _requestID,
				param2: _donorIds
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function () {
			_callback();
		});
	},

	updateRequestFoundMatch: function (_requestID, _foundMatch, _callback) {
		sequelize.query('SELECT * FROM update_request_match(:param1,:param2)', {
			replacements: {
				param1: _requestID,
				param2: _foundMatch
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function () {
			_callback();
		});
	},
	updateRequestConversion: function (_requestID, _conversion, _callback) {
		sequelize.query('SELECT * FROM update_request_conversion(:param1,:param2)', {
			replacements: {
				param1: _requestID,
				param2: _conversion
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function () {
			_callback();
		});
	},
	updateRequestClose: function (_fpid, _callback) {
		sequelize.query('SELECT * FROM update_request_close(:param1)', {
			replacements: {
				param1: _fpid
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function () {
			_callback();
		});
	},

	messageDump: function (_messageEvent) {
		sequelize.query('SELECT * FROM insert_message(:param1)', {
			replacements: {
				param1: _messageEvent
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (matchesDetails) {
			//log.info(matchesDetails)
		});
	},
	errorDump: function (_sessionData) {
		sequelize.query('SELECT * FROM insert_error_instances(:param1)', {
			replacements: {
				param1: _sessionData
			},
			type: sequelize.QueryTypes.SELECT
		}).then(function (matchesDetails1) {
			//log.info(matchesDetails)
		});
	}
}

const low = require('lowdb');
const fileAsync = require('lowdb/lib/file-async');
const _ = require('lodash');


// Start database using file-async storage
const db = low('server/data/db.json', {
	storage: fileAsync,
	writeOnChange: false
});

// Init
db.defaults({
	users: []
}).value();
const usersDB = db.get('users');

var inFile = module.exports = {
	getUsers: function (_fpid) {
		return usersDB.filter({
			fpid: _fpid
		}).value();
	},
	insertUser: function (_fpid, _firstName, _lastName, _pic, _mobile, _gender, _timezone, _verified, _state, _callback) {
		usersDB.value().push({
			fpid: _fpid,
			updatedOn: Date.now(),
			firstName: _firstName,
			lastName: _lastName,
			profilePic: _pic,
			mobile: _mobile,
			gender: _gender,
			state: _state,
			errorCount: 0,
			pickup: {},
			drop: {},
			date: "",
			time: "",
			timezone: _timezone,
			verified: _verified,
			tid: null
		});
		db.write().then(function (success) {
			return _callback(_fpid);
		}, function (error) {
			return error;
		});
	},
	insertUserwithData: function (_fpid, _firstName, _lastName, _pic, _mobile, _gender, _timezone, _verified, _state, _pickup, _drop, _date, _time, _tid, _callback) {
		usersDB.value().push({
			fpid: _fpid,
			updatedOn: Date.now(),
			firstName: _firstName,
			lastName: _lastName,
			profilePic: _pic,
			mobile: _mobile,
			gender: _gender,
			state: _state,
			errorCount: 0,
			pickup: _pickup,
			drop: _drop,
			date: _date,
			time: _time,
			timezone: _timezone,
			verified: _verified,
			tid: _tid
		});
		db.write().then(function (success) {
			return _callback(_fpid);
		}, function (error) {
			return error;
		});
	},
	updateStatewithValue: function (_fpid, _state, _key, _val, _callback) {
		let useme = usersDB.find({
			fpid: _fpid
		}).value();
		useme["state"] = _state;
		useme[_key] = _val;
		db.write().then(function (success) {
			return _callback(_fpid);
		}, function (error) {
			return error;
		});
	},
	updateStatewithValueErrorCount: function (_fpid, _state, _errorCount, _key, _val, _callback) {
		let useme = usersDB.find({
			fpid: _fpid
		}).value();
		useme["state"] = _state;
		useme["errorCount"] = _errorCount;
		useme[_key] = _val;
		db.write().then(function (success) {
			return _callback(_fpid);
		}, function (error) {
			return error;
		});
	},
	updateErrorCount: function (_fpid, _errorCount, _callback) {
		usersDB.find({
			fpid: _fpid
		}).assign({
			updatedOn: Date.now(),
			errorCount: _errorCount
		}).value();
		db.write().then(function (success) {
			return _callback(_fpid);
		}, function (error) {
			return error;
		});
	},
	updateState: function (_fpid, _state, _callback) {
		usersDB.find({
			fpid: _fpid
		}).assign({
			updatedOn: Date.now(),
			state: _state,
			errorCount: 0
		}).value();
		db.write().then(function (success) {
			return _callback(_fpid);
		}, function (error) {
			return error;
		});
	},
	removeUsers: function (_fpid, _callback) {
		usersDB.remove({
			fpid: _fpid
		}).value();
		db.write().then(function (success) {
			return _callback(_fpid);
		}, function (error) {
			return error;
		});
	},

	removeTimedOutUsers: function (_bufferMin, _callback) {
		let usr = low('server/data/db.json', {
			storage: fileAsync,
			writeOnChange: false
		}).get('users');
		let uDB = [];
		_.filter(usr.value(), function (o) {
			if ((((new Date().getTime() - o.updatedOn) / 1000) / 60) >= _bufferMin) {
				//uDB.push(o.fpid);
				inFile.removeUsers(o.fpid, function (id) {
					return _callback(id);
				});
			}
		});
		//return _callback(uDB);
	}
}
module.exports.db = db;
module.exports.usersDB = usersDB;

//inFile.insertUser("_fpid","_firstName","_lastName","_pic","_mobile","_gender","_deviceType","_timezone","_verified","_state",function(){});

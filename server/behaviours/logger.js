const
	logjs = require("./log4js.js");
	winston = require("./winston.js");

const inFile = module.exports = {
	fatal: function (message) {
		logjs.fatal(message);
		winston.log('verbose',message);
	},
	error: function (message) {
		logjs.error(message);
		winston.log('error',message);
	},
	warn: function (message) {
		logjs.warn(message);
		winston.log('warn',message);
	},
	debug: function (message) {
		logjs.debug(message);
		winston.log('debug',message);
	},
	info: function (message) {
		logjs.info(message);
		winston.log('info',message);
	},
	trace: function (message) {
		logjs.trace(message);
		winston.log('silly',message);
	}
}

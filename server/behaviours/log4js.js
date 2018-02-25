/**
 * make a log directory, just in case it isn't there.
 */
const log4js = require('log4js');

try {
	require('fs').mkdirSync('./log');
} catch (e) {
	if (e.code != 'EEXIST') {
		//console.error("Could not set up log directory, error was: ", e);
		process.exit(1);
	}
}

log4js.configure('./config/log4js.json');

const logjs = log4js.getLogger("ridesharebot");

module.exports = logjs;

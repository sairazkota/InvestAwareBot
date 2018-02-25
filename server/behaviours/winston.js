var winston = require('winston');
require('winston-loggly-bulk');
require('loggly');

winston.add(winston.transports.Loggly, {
	token: "6a90e405-c7a5-41f1-93aa-12a5b97b3041",
	subdomain: "ridesharebot",
	tags: ["bloodshare-production"],
	json: true
});
winston.level = 'verbose';
winston.level = 'debug';
winston.level = 'silly';
winston.remove(winston.transports.Console);
module.exports = winston;

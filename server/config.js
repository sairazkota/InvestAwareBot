const config = require('config');


/*
 * Be sure to setup your config values before running this code. You can
 * set them using environment variables or modifying the config file in /config.
 *
 */

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
	process.env.MESSENGER_APP_SECRET :
	config.get('appSecret');

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
	(process.env.MESSENGER_VALIDATION_TOKEN) :
	config.get('validationToken');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
	(process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
	config.get('pageAccessToken');

const HOST_NAME = config.get('hostname');

const GOOGLE_KEY = config.get('geocodekey');

const TUTORIAL_URL_ANDROID = config.get('tutorial_url_android');
const TUTORIAL_URL_IOS = config.get('tutorial_url_ios');
const TUTORIAL_URL = config.get('tutorial_url');

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN)) {
	console.error("Missing config values");
	process.exit(1);
}

module.exports.APP_SECRET = APP_SECRET;
module.exports.VALIDATION_TOKEN = VALIDATION_TOKEN;
module.exports.PAGE_ACCESS_TOKEN = PAGE_ACCESS_TOKEN;
module.exports.HOST_NAME = HOST_NAME;
module.exports.GOOGLE_KEY = GOOGLE_KEY;
module.exports.TUTORIAL_URL_ANDROID = TUTORIAL_URL_ANDROID;
module.exports.TUTORIAL_URL_IOS = TUTORIAL_URL_IOS;
module.exports.TUTORIAL_URL = TUTORIAL_URL;
const
	plivo = require('plivo'),
	development = plivo.RestAPI({
		authId: 'SAZWRKYMQ5N2RLMWJMNG',
		authToken: 'Mzk1NjdkZjM4YTM1Njk4ZjM3OTAyZjQ2N2NiNmM5'
	}),
	production = plivo.RestAPI({
		authId: 'SAMDDMZMFKMWY5YJCWNJ',
		authToken: 'MzBkN2VhNjgxNDZhMjY3ZjdkODg2MjRlMjYxOTA4'
	});
const inFile = module.exports = {
	sendOTP: function (mobile, otp, _callback) {
		var params = {
			'src': '18052209185', // Sender's phone number with country code
			'dst': mobile, // Receiver's phone Number with country code
			'text': otp + " is your BloodShare Bot verification code", // Your SMS Text Message - English
			'url': "https://bloodshare.co/smsreport/", // The URL to which with the status of the message is sent
			'method': "GET" // The method used to call the url
		};
		production.send_message(params, function (status, response) {
			//console.log('Status: ', status);
			//console.log('API Response:\n', response);
			//console.log('Message UUID:\n', response['message_uuid']);
			//console.log('Api ID:\n', response['api_id']);
			return _callback(status);
		});
	}
}

//inFile.sendOTP(919542742976,"1234");
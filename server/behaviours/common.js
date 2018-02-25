var moment = require('moment');
Date.prototype.addHours = function (h) {
	this.setTime(this.getTime() + (h * 60 * 60 * 1000));
	return this;
}
const inFile = module.exports = {

	timeZoneSettle: function (dateTime, tz) {
		return dateTime.addHours(tz);
	},

	trimString: function (string) {
		if (string.length > 61)
			return string.substring(0, 60) + "...";
		else
			return string;
	},

	trimLocation: function (string) {
		if (string.length > 28)
			return string.substring(0, 25) + "...";
		else
			return string;
	},

	trimTitle: function (string) {
		if (string.length > 30)
			return string.substring(0, 86) + "...";
		else
			return string;
	},

	makeDateTime: function (dateT, timeT, tzT) {
		let timezone = inFile.fbTimeZoneConverter(tzT);
		let cDT = new Date();
		return new Date(dateT + " ," + cDT.getFullYear() + " " + timeT + " " + timezone);
	},

	fbTimeZoneConverter: function (a) {
		if (a == 0) {
			return "GMT+0000";
		} else if (a < 0) {
			a = String(a).replace("-", "").split(".");
			if (a.length == 1)
				return "GMT-" + a[0] + "00";
			else
				return "GMT-" + a[0] + "30"
		} else {
			a = String(a).split(".");
			if (a.length == 1)
				return "GMT+" + a[0] + "00";
			else
				return "GMT+" + a[0] + "30"
		}
	},

	convertTZ: function (date, offset) {
		// convert to msec
		// add local time zone offset
		// get UTC time in msec
		var utc = date.getTime() + (date.getTimezoneOffset() * 60000);

		// create new Date object for different city
		// using supplied offset
		var newDate = new Date(utc + (3600000 * offset));

		// return time as a string
		return newDate;
	},

	pointToLatLng: function (point) {
		point = point.replace("POINT(", "").replace(")", "").split(" ");
		return {
			"lat": point[1],
			"long": point[0]
		};
	},

	LatLngtoPoint: function (latlng) {
		return 'POINT(' + latlng.long + ' ' + latlng.lat + ')';
	},

	extractDate: function (dateD, tz) {
		let localTime = dateD.addHours(tz);
		return moment(localTime).format("ll").replace(", " + new Date().getFullYear(), "");
	},

	extractTime: function (dateD, tz) {
		let localTime = dateD.addHours(tz);
		return moment(localTime).format("LT");
	},

	uniquePicCode: function (pic) {
		if (pic) {
			let uniqueCode = pic.split("?")[0].split("/");
			uniqueCode = uniqueCode[uniqueCode.length - 1];
			uniqueCode = uniqueCode.split(".")[0].replace("_n", "");
			return uniqueCode;
		} else return null;
	}
}

//console.log(inFile.extractDate('2016-08-06T11:02:29.170Z',6.5));

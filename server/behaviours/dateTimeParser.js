const
	chrono = require('chrono-node'),
	moment = require('moment'),
	log = require('./logger.js'),
	common = require('./common.js');

Date.prototype.addHours = function (h) {
	this.setTime(this.getTime() + (h * 60 * 60 * 1000));
	return this;
}

let currentDateTime;
const inFile = module.exports = {
	dateParser: function (input, inTime, tz) {
		currentDateTime = new Date().addHours(tz);
		if (input == "TODAY") {
			if (inTime) {
				let timeDate = new Date(moment(currentDateTime).format("ll") + " " + inTime);
				if (timeDate < currentDateTime) return "past";
				else return moment(currentDateTime).format("ll");
			} else {
				return moment(currentDateTime).format("ll");
			}
		} else if (input == "TOMORROW") {
			let tomorrow = moment(currentDateTime).add(1, 'day');
			return tomorrow.format("ll");
		} else {
			if (input.indexOf(".") > -1) input = input.replace(".", "/");
			if (input.indexOf("-") > -1) input = input.replace("-", "/");
			input = input + "/2016";
			let datePattern = new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g);
			if (datePattern.test(input)) {
				let USdatePattern = new RegExp(/^(0?[1-9]|1[0-2])\/(0?[1-9]|1[0-2])\/2016$/g);
				let USMatch = USdatePattern.test(input);
				if (USMatch) input = input.split("/")[1] + "/" + input.split("/")[0] + "/" + input.split("/")[2];
				let givenD = new Date(chrono.parseDate(input));
				if (givenD < currentDateTime) return "past";
				else return moment(givenD).format("ll");
			} else {
				return null;
			}
		}
	},
	timeParser: function (input, inDate, tz) {
		currentDateTime = new Date().addHours(tz);
		if (input.indexOf(".") > -1) input = input.replace(".", ":");
		if (input.indexOf("-") > -1) input = input.replace("-", ":");
		if (((input.length == 1) || (input.length == 2)) && (input.indexOf(":") == -1)) input = input + ":00";
		let timePattern24hrs = new RegExp(/^([01]?[0-9]|2[0-3])(:[0-5][0-9])?$/);
		let timePattern12hrs = new RegExp(/^((1[0-2]|0?[1-9])(:([0-5][0-9]))? ?([AaPp][Mm]))$/);
		if ((timePattern12hrs.test(input)) || (timePattern24hrs.test(input))) {
			let timeD = moment(new Date(chrono.parseDate(input))).format("LT");
			let timeDate = new Date(inDate + ", " + currentDateTime.getFullYear() + " " + timeD);
			if (timeDate < currentDateTime) return "past";
			else return timeD;
		} else return null;
	},
	dateTimeFreeForm: function (inputText, tz) {
		currentDateTime = new Date().addHours(tz);
		inputText = " " + inputText.toLowerCase();
		if (inputText.indexOf('day after tomorrow') > -1) {
			let tomorrow = moment(currentDateTime).add(2, 'day').format("ll");
			inputText = inputText.replace('day after tomorrow', tomorrow);
		}
		if (inputText.indexOf('tomorrow') > -1) {
			let tomorrow = moment(currentDateTime).add(1, 'day').format("ll");
			inputText = inputText.replace('tomorrow', tomorrow);
		}
		if (tz == 5.5) {
			let indiaDDMM = inputText.match(/^.* (0?[1-9]|1[0-2])\/(0?[1-9]|1[0-2])(?: |\/[0-9]{4}|\/[0-9]{2}).*$/);
			if (indiaDDMM) inputText = inputText.replace(indiaDDMM[1] + "/" + indiaDDMM[2], indiaDDMM[2] + "/" + indiaDDMM[1])
		}
		let parsedDT = chrono.parseDate(inputText + " " + common.fbTimeZoneConverter(tz));
		if (parsedDT) {
			if (inputText.indexOf(' in ') > -1) {
				parsedDT = parsedDT.addHours(tz);
			}
			parsedDT = parsedDT.addHours(tz);
			if (parsedDT < currentDateTime) return "past";
			else return {
				date: moment(parsedDT).format("ll").replace(", " + currentDateTime.getFullYear(), ""),
				time: moment(parsedDT).format("LT")
			};
		} else {
			return null;
		}
	}
}

//console.log((inFile.dateTimeFreeForm("Day after tomorrow 10am ",5)));
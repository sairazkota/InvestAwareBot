const os = require('os');
const dict = {
	greeting: {
		0: {
			message: "Hi"
		},
		1: {
			message: "Hello"
		},
		2: {
			message: "Aloha"
		},
		3: {
			message: "Yo"
		},
		4: {
			message: "Hey"
		}
	},
	cuss: {
		0: {
			message: "Damn!"
		},
		1: {
			message: "Daaaaaaamn!"
		},
		2: {
			message: "Whoops!"
		},
		3: {
			message: "Crap!"
		}
	},
	goodbye: {
		0: {
			message: "Bye"
		},
		1: {
			message: "Goodbye"
		}
	},
	excited: {
		0: {
			message: "Yay!"
		},
		1: {
			message: "Woot!"
		},
		2: {
			message: "Hooray!"
		},
		3: {
			message: "Excellent!"
		},
		4: {
			message: "Yippie!"
		},
	},
	angst: {
		0: {
			message: "Whoa!"
		},
		1: {
			message: "Ruh!"
		},
		2: {
			message: "Gah!"
		},
		3: {
			message: "Shoot!"
		},
		4: {
			message: "Heck!"
		},
		5: {
			message: "Whoops!"
		},
		6: {
			message: "Dang!"
		},
	},
	confused: {
		0: {
			message: "Um..."
		},
		1: {
			message: "Uh?"
		},
		2: {
			message: "Erm."
		},
		3: {
			message: "Huh."
		},
		4: {
			message: "Sigh!"
		},
		5: {
			message: "Ugh!"
		},
	},
	niceday: {
		0: {
			message: "Have a great day"
		},
		1: {
			message: "Have an awesome day"
		},
		2: {
			message: "Have a super day"
		},
		3: {
			message: "Have a nice day"
		},
		4: {
			message: "Have a wicked day"
		}
	},
	welcomeUser: {
		0: {
			message: "How can I help you today?"
		}
	},
	welcomeReturningUser: {
		0: {
			message: "It's good to see you again"
		},
	},
	welcomeNewUser: {
		0: {
			message: "I'll help you some person who has required blood group "
		},
	},
	welcomeUser_WrongReply: {
		0: {
			message: "Please  pick one from these options to continue.."
		},
	},
	alreadyRegisterdUser: {
		0: {
			message: "You have already registered"
		},
	},
	hasActiveRequestUser: {
		0: {
			message: "You already have an active request"
		}
	},
	askDonorBloodGroup: {
		0: {
			message: "Tap to pick your blood group type"
		}
	},
	askReqestBloodGroup: {
		0: {
			message: "Tap to pick the blood group type you’re in need of"
		}
	},
	askBloodGroupWrong: {
		0: {
			message: "Oops, I didn’t recognize that blood group type? Tap on the appropriate blue bubble to pick  blood group type"
		},
	},
	askDonorPickup: {
		0: {
			message: "What location is most convenient location for you to donate blood? Type the name of the location, or just share the location using the map pin"
		},
	},
	askReqestPickup: {
		0: {
			message: "At which location do you need the blood? Type the name of the location, or share the location using the map pin"
		},
	},
	notValidLocation: {
		0: {
			message: "This doesn't seem to be a valid location. Type the location, or tap on the pushpin icon in the keyboard to continue"
		}
	},
	notValidLatLng: {
		0: {
			message: "I wasn't able to identify this location. Try picking a location close your area of interest instead"
		}
	},
	locationNotFoundMessageImage: {
		0: {
			message: "Share the location by tapping the pushpin/location icon"
		}
	},
	locationFoundMessage: {
		0: {
			message: "Pick the closest location from the list above to continue"
		}
	},
	askDateTimeFreeForm: {
		0: {
			message: "What date & time do you need the blood by? Tap a bubble below, or try entering something  like Sep 30 8:30pm"
		},
	},
	askDateTimeFreeFormWrong: {
		0: {
			message: "I wasn't able to understand that. What date & time do you need the blood by? Eg. Sep 30 9:30pm"
		},
	},
	askDateTimeFreeFormPast: {
		0: {
			message: "You picked a date & time in the past. Pick a date & time in the foreseeable future"
		},
	},
	askDonorMobileNumber: {
		0: {
			message: "Enter your mobile number with the country code. For instance if you use an India number then type 91XXXXXXXXXX"
		},
	},
	askRequestMobileNumber: {
		0: {
			message: "Type your mobile number with the country code. For instance if you use an India number then type 91XXXXXXXXXX"
		},
	},
	askOTP: {
		0: {
			message: "Enter the code I sent you in the text message to proceed"
		},
	},
	resendOTP: {
		0: {
			message: "Sent you a code again; enter the code to proceed"
		},
	},
	askOTPWrong: {
		0: {
			message: "The code you entered is incorrect. Try entering it again"
		},
	},
	askWhichCountry: {
		0: {
			message: "Is your number from "
		},
	},
	askWhichCountryWrong: {
		0: {
			message: "Please let me know is your number from "
		},
	},
	askMobileNumberWrong: {
		0: {
			message: "Whoops! Try entering your mobile number with the country code again"
		},
	},
	mobileVerified: {
		0: {
			message: "your number has been verified! Finding matches now..."
		},
	},
	donorReadyMessage: {
		0: {
			message: "That’s very kind of you! I’ve expressed your willingness to help to "
		}
	},
	confirmedDonorMessage: {
		0: {
			message: "Fantastic! We have your details and will notify you when someone is in need of your blood type. Your act of kindness will go a long way in saving many lives-I’m proud of you, "
		}
	},
	ShareDonorMessage: {
		0: {
			message: "Share your blood deed and inspire others to save a life by donating blood too"
		}
	},
	confirmedRequesterMessage: {
		0: {
			message: "Fantastic! I’ll contact all donors in your area and will notify you as soon as I find a matching donor "
		}
	},
	ShareRequesterMessage: {
		0: {
			message: "Share this message to increase the chances of finding a blood donor. The more you share, the more likely you’ll help someone in need"
		}
	},
	finalRequesterMessage: {
		0: {
			message: "I really hope things work out for you. I’ll keep notifying you with more matches as soon as I find more good samaritans. In the meanwhile, stay positive!"
		}
	},
	noDonorsFound: {
		0: {
			message: "No donors found so far...."
		}
	},
	donorFoundMessage: {
		0: {
			message: "I found some wonderful people that are willing to donate blood to help you. Call them and identify the next steps"
		}
	},
	activeRequestsToDonor: {
		0: {
			message: "These people waiting for a donor pick one whom would like donate "
		}
	},
	notReadyDonorMessage: {
		0: {
			message: "You missed an opportunity to save a life......"
		}
	},
	askReadyToDonate: {
		0: {
			message: "Hey there! Someone is in need of your blood type. Would you be willing to donate?"
		}
	},
	matchConversion: {
		0: {
			message: "Did you find someone to donate blood?"
		}
	},
	alreadyAcceptedReq: {
		0: {
			message: "You've already shown your interest to donate blood to this person"
		}
	},
	reqClosedCantdonate: {
		0: {
			message: "This request has been closed, Thanks for your kindness"
		}
	},
	noMoreMatches: {
		0: {
			message: "I didn’t find any matching donors at this time.You should contact nearby blood banks immediately"
		}
	},
	closeRequest: {
		0: {
			message: "I hope everything went well your request has been close"
		}
	},
	newRequestForActive: {
		0: {
			message: "You already have one active request if you want to create more please mailt to hello.sharebot@gmail.com"
		}
	},
	inappropriateButtonClick: {
		0: {
			message: "I need the information asked in the previous message in order to proceed"
		},
	},
	errorCommon: {
		0: {
			message: "I wasn't able to understand that. Try this quick tutorial"
		},
		1: {
			message: "I tried hard but wasn’t able to understand what you entered.Perhaps quick tutorial might help"
		}
	},
	thanksStayInTouch: {
		0: {
			message: "Thanks! I'll stay in touch "
		}
	},
	goodbyeConversion:{
		0:{message: "Thanks for dropping by! Bye :)"}
	}
};

module.exports = dict;

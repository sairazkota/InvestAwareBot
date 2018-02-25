const
	schedule = require('node-schedule'),
	custom = require("../fbMessageFunctions/customMessageFunctions.js"),
	  
	database = require("../database/dbPostgreSQL.js"),
	log = require('./logger.js'),
	common = require("./common.js"),
	users = require("../data/db.js"),
	_ = require('lodash');

//var rule = new schedule.RecurrenceRule();
//rule.second = [0, 10, 20, 30, 40, 50];
//var j = schedule.scheduleJob(rule, function(){
var j = schedule.scheduleJob('*/10 * * * *', function () {
	//log.info(new Date().getTime() + " Scheduler Running");
	users.removeTimedOutUsers(10, function (id) {
		//log.info(new Date().getTime()+" Deleted - id");
	});
	
	database.fetchRequestStatus(10,function(userRequests){
    _(userRequests).forEach(function(userRequest){
      if(userRequest.foundmatch_){
		  custom.matchConversion(userRequest.fpid_,userRequest.location_,userRequest.bloodgroup_,common.extractDate(new Date(String(userRequest.requesttime_)),userRequest.timezone_),common.extractTime(new Date(String(userRequest.requesttime_)),userRequest.timezone_),userRequest.requestid_);
      }
      else{
    	custom.noMoreMatches(userRequest.fpid_,userRequest.location_,userRequest.bloodgroup_,common.extractDate(new Date(String(userRequest.requesttime_)),userRequest.timezone_),common.extractTime(new Date(String(userRequest.requesttime_)),userRequest.timezone_));
      }
    });
  });
});
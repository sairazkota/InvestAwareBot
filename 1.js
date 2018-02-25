database.fetchRequestDetailsWithRequestid(metadataArr[3], function (dbRequesterDetails) {
				if (dbRequesterDetails.length >= 1) {
					for (let requester = 0; requester < dbRequesterDetails.length; requester++) {
						
						var donorsArr = dbRequesterDetails[requester].matcheddonorids.split("_");
						console.log(" requester:"+dbRequesterDetails[requester].firstname+"ids:"+dbRequesterDetails[requester].matcheddonorids);

						for (let donor = donorsArr.length - 1; donor >= 0; donor--) {
							
							database.fetchDonorDetails(donorsArr[donor], function (dbDonorDetails) {
								
								if (dbDonorDetails.length == 1) {
									for (let person1 = 0; person1 < dbDonorDetails.length; person1++) {
										donorList.push({
											fpid: dbDonorDetails[person1].fpid,
											name: dbDonorDetails[person1].firstname + " " + dbDonorDetails[person1].lastname,
											pickup: dbDonorDetails[person1].location,
											profilePicture: dbDonorDetails[person1].profilepicture,
											mobileNumber: dbDonorDetails[person1].mobile,
											bloodGroup: dbDonorDetails[person1].bloodgroup
										});
										console.log(" donor :"+dbDonorDetails[person1].firstname +
												   dbDonorDetails[person1].fpid+";"+dbDonorDetails[person1].lastname+":"+ dbDonorDetails[person1].profilepicture+":"+dbDonorDetails[person1].mobile
												   +":"+dbDonorDetails[person1].bloodgroup);
									}
									console.log("list1:"+donorList);
								}
								console.log("list2:"+donorList);
								
								
							});
							console.log("list3:"+donorList);
						}
						console.log("list:"+donorList);
						custom.DonorCardToRequester(dbRequesterDetails[requester].fpid, donorList);
						setTimeout(function () {
							custom.finalRequesterMessage(dbRequesterDetails[requester].fpid);
						}, 2000);
					}

				} else {
					console.log("no request details gghh found");
				}
			});
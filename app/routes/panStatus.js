const express = require('express');
const router = express.Router();
const functions = require('./functions')
var async = require('async');
var http = require('http');
var soap = require('soap');
var parseString = require('xml2js').parseString;
var request = require("request");

//DB connection
var client = require('../../config/database');



exports.postPanStatus = (req, res) => {
	//currentPage = req.session.activePage = "/PANStatus";
	loginStatus = functions.checkLoginStatus(req);
	if (loginStatus) {
        
	} else {
		console.log("end");
	}
};


exports.postPanValidation = (req, res) => {

    
    console.log("Hi in PAN ");
	loginStatus = functions.checkLoginStatus(req);
   
	if (loginStatus) {
 console.log("inside login status",loginStatus);

		//password = "web@12345";
		//passKey = "test";
		
		PAN = req.body.pan;
       // PAN='AKBPB7607H';
		//username = "WEBINTMM";
		//POSCODE = "MONEYMATTER";
		var ePass = ""; //= "FjFMCDg4YPtsxrGRtJmeVQ%3d%3d";
       //live
        username = "IMMPL";
        POSCODE = "2500001173";
        password = "Syed@686";
        passKey = "test@123";
        async.waterfall([
            
				function (callback) {
                    console.log("Inside callback");
					
                    var optionsForPassword = {
						hostname: "www.cvlkra.com",
						path: '/paninquiry.asmx/GetPassword?password='+password+'&PassKey='+passKey
					};

					var getPassword = http.get(optionsForPassword, function (response) {
						var encryptedPassword = '';
						response.on('data', function (chunk) {
							encryptedPassword += chunk;
						});
						response.on('end', function () {
							// console.log(encryptedPassword);
							parseString(encryptedPassword, function (err, result) {
								//tot = 	JSON.stringify(result)
								// console.log(result["string"]["_"]);
								console.log(result);
								ePass = result["string"]["_"];
                                console.log("Password: ",ePass);
								callback(null, ePass)
							});
						})
					}).on('error', function (e) {
						console.log('problem with request: ' + e.message);
						callback(false)
					});

				},
				function (ePass, callback) {
                    
					// get the PAN Status
					var optionsForPANStaus = {
						hostname: "www.cvlkra.com",
						path: '/paninquiry.asmx/GetPanStatus?panNo='+PAN+'&userName='+username+'&PosCode='+POSCODE+'&password='+ ePass+'&PassKey='+passKey
						//path: '/PANInquiry.asmx/GetPanStatus?panNo=BDKPS1141N&userName=WEBINTMM&PosCode=MONEYMATTER&password='+ePass+'&PassKey='+passKey
					};

					var getPANStatus = http.get(optionsForPANStaus, function (response) {
						var statusPAN = '';
						response.on('data', function (chunk) {
							statusPAN += chunk;
						});
						response.on('end', function () {
							// console.log(statusPAN);
							parseString(statusPAN, function (err, result1) {
								//console.log(result1.APP_RES_ROOT.APP_PAN_INQ[0].APP_PAN_NO[0]);
								//console.log(result1.APP_RES_ROOT);
								appStatus = result1.APP_RES_ROOT.APP_PAN_INQ[0].APP_STATUS[0];
								//console.log(appStatus);
								//callback()

								panData = result1.APP_RES_ROOT.APP_PAN_INQ[0].APP_NAME[0];
								panNo = result1.APP_RES_ROOT.APP_PAN_INQ[0].APP_PAN_NO[0];

								msg = "";
								switch (appStatus) {

									case "000": msg = "Not Checked with respective KRA";
										break;
									case "001": msg = "Submitted";
										break;
									case "002": msg = "KRA Verified";
										break;
									case "003": msg = "Hold";
										break;

									case "004": msg = "Rejected";
										break;
									case "005": msg = "Not available";
										break;
									case "006": msg = "Deactivated";
										break;
									case "011": msg = "Existing KYC Submitted";
										break;
									case "012": msg = "Existing KYC Verified";
										break;
									case "013": msg = "Existing KYC hold";
										break;
									case "014": msg = "Existing KYC Rejected";
										break;
									case "022": msg = "KYC REGISTERED WITH CVLMF";
										break;
									case "888": msg = " Not Checked with Multiple KRA";
										break;
									case "999": msg = "Invalid PAN NO Format";
										break;
								}
                                
                                
                                var pan=PAN;
                                if(appStatus=='002')
                                    {
                                        var kycstatus="Complaint";    
                                    }
                                else{
                                        var kycstatus='Pending';
                                      /*  console.log("status of PAN :",appStatus);
                                        console.log("Messg ",msg);*/
                                    }
                                
                                
                                console.log("PAN details",pan,kycstatus);
                              if(kycstatus=="Complaint"){
                              var query = client.query("update pandetails set pan=$2,kycstatus=$3 where userid=$1", [req.session.user.userid,pan,kycstatus], function (err, result) {
							if (err) {
								console.log("cant insert to pandetails", err);
								
							} else {
							         	console.log("Insertion success to pandetails");
									}
						});
                                   data = {
									"statusCode": appStatus,
									"msg": msg,
									"pan": panNo,
									"name": panData
								}
                              
                              }
                                else{
                                    data = {
									"statusCode": "not complaint"
								}
                                    
                                }
                                    
                                                             
								

								var panJSON = JSON.stringify(data);
								//console.log(panJSON+"dad")
								callback(null, panJSON)

							});
						})
					}).on('error', function (e) {
						console.log('problem with request: ' + e.message);
					});


				}], function (err, result) {
					// result is 'd'  
					if (err)
						throw err;

					//console.log(result+"inside ur");

					panMsg = req.session.panMessage = result;
					//console.log(panMsg+"assigned");
					res.send(panMsg);
				}
			)

	}


};


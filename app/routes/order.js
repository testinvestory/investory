/* 
* Modules *
*/
const express = require('express');
// const router = express.Router();
const async = require('async');

const crypto = require('crypto');
/* common functions */
const functions = require('./functions');

//DB connection
var client = require('../../config/database');

var http = require('http');
var soap = require('soap');
var parseString = require('xml2js').parseString;
var request = require("request");

var currentPage;
var fs= require('fs');
var pdf2png=require("pdf2png");

var fd = require('node-freshdesk-api');
var freshdesk = new fd('https://immplinvestory.freshdesk.com', 'LpZkws9gCh6Ashxbltap');

function getClientId (userid) {
  var date = new Date()
  var month = date.getMonth() + 1
  month = (month < 10 ? '0' : '') + month
  var day = date.getDate()
  day = (day < 10 ? '0' : '') + day
  return day + userid

}
function getDate1() {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  month = (month < 10 ? '0' : '') + month
  var day = date.getDate()
  day = (day < 10 ? '0' : '') + day  
  return  day + month + year
}
  
exports.postInsertOrder = (req, res) => {

	var userID = "109401";
	var memberID = "10940";
	var password = "Syed@22";
	var passKey = "test";
    var clientId;
    var nishant;
	async.waterfall([function(callback){
      
        var clientId=req.session.user.clientid;
                var userID = "109401";
	             var memberID = "10940";
	             var password = "Syed@22";
	             var passKey = "test";
        
            if(clientId=="not client"){
               nishant=1; 
    console.log("Client Creation +++++++++////++++++++");
    async.waterfall([function (callback) {
            
                var clientData;
                var userid=req.session.user.userid;
				var query = client.query("select * from bseformdetail as t1 join nachformdetail as t2 on t1.userid=t2.userid where t1.userid="+userid,function (err, result) {
					if (err)
                    {
						console.log("Cant get Aeets values");
                        clientData='false';
                    }
                    else
                   {
					clientData = result.rows[0];
					callback(null, clientData)
                  }
				});
            
            
            
      },function (clientData,callback) {
            
            	var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
                    
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing"><soap:Header><a:Action soap:mustUnderstand="1">http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/getPassword</a:Action>\n<a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n</soap:Header>\n<soap:Body>\n<ns:getPassword>\n<ns:UserId>'+userID+'</ns:UserId>\n<ns:MemberId>'+memberID+'</ns:MemberId>\n<ns:Password>'+password+'</ns:Password>\n<ns:PassKey>'+passKey+'</ns:PassKey>\n</ns:getPassword>\n</soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON
					//	console.log(buffer);
                   // console.log("herrerererererere",results);
                    //console.log("check",results["s:Envelope"]["s:Body"][0]["getPasswordResponse"][0]["getPasswordResult"])
                    
                    var password = results["s:Envelope"]["s:Body"][0]["getPasswordResponse"][0]["getPasswordResult"];
				
					clientpass = password.toString().split("|");
					console.log("Client create Service Password " + clientpass[1]);
					callback(null,clientData,clientpass[1])

				})

			});
            
            
            
      },function(clientData,clientpassword,callback){
          
           var clientCode=getClientId(req.session.user.userid);
           
          
          // console.log("Data needed",clientData);
          
          
              clientId=clientCode;
          var holdingType="SI";      //Single Holding type SI => Hard coded
          var taxStatus="01";       //Hard coded currently no data in db as tax indivisual as 01
          var occupationCode="03";  //Occupaition code has to extracted based on user detail in db 03->Professional
          var name=clientData.name;
          var clientAppName1="";    // mandatary Currenlty no data found
          //2 blank
           var dob=clientData.dob;
          var dob1=dob.replace(/-/g, "/");
        
          
          var clientGender="M";     //Currenlty no data found need to get data from user
          var clientFather="";       // if client minor CLIENT FATHERHUSBAND tax status 02 then mandatory
          var pan=clientData.pan; 
          var clientNomineeName=clientData.nominee;
          var clientNomineeRelation=clientData.nomineerelation;
          var clientGaurdianPan="";  
          var clientType="P";        //Physical P Demat D
         // var defaultDp="NSDL";     //Default DP Id (CDSL / NSDL),PHYS in case of Physical no data found
                                     
          //2 blanks
          //var nsdlDpid="NSDL";          // Mandatary if NSDL
         // var nsdlcltid="NSDL";         //  Mandatary if NSDL
          
          var bankName=clientData.bankname;
          var branch=clientData.branch;
          var branchcity=clientData.branch;
          var accType="SB";             //clientData.accounttype; savings as SB
          var accNO=clientData.accountno;
          var micrno=clientData.micr;              //"560037002"   //clientData.ifsc            //Mandatory
          var neftcode=clientData.ifsc        //Mandatory
                                       
           // 4 blanks
          var city=clientData.city;
          var state="KA";                  //clientData.state; as code KA hardcoded currently
          var pincode=clientData.pincode;
          var country=clientData.country;
          var mobile=clientData.mobile;
          var telephone=clientData.telephone;
          
          //2 blanks
          var email=clientData.email;
          var clientCommunicate="P";   // Physical as P ,Mobile as M only MFD 
          var divPayMode="05";    //01-Cheque 02-Direct Credit 03-ECS 04-NEFT 05-RTGS
        
          //3 blanks
          
          var comAddress1=clientData.address;
          var comAddress2=clientData.address;
           //1 blank
          var comCity=clientData.city;
          var comPincode=clientData.pincode;
          var comState=clientData.state;
          var comCountry="101";    //country code india as 101
          var comPhone=clientData.mobile;
          //3 blanks
          
           
             
          
          var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
                    
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n<soap:Header>\n<a:Action>http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI</a:Action>\n<a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n</soap:Header>\n<soap:Body><ns:MFAPI>\n<ns:Flag>02</ns:Flag>\n<ns:UserId>109401</ns:UserId>\n<ns:EncryptedPassword>'+clientpassword+'</ns:EncryptedPassword>\n<ns:param>'+clientId+'|'+holdingType+'|'+taxStatus+'|'+occupationCode+'|'+name+'|||'+dob1+'|'+clientGender+'||'+pan+'|'+clientNomineeName+'|'+clientNomineeRelation+'||'+clientType+'||||||'+accType+'|'+accNO+'|582006506|'+neftcode+'|Y||||||||||||||||||||||'+comAddress1+'|||'+city+'|'+state+'|'+pincode+'|'+country+'|||||'+email+'|'+clientCommunicate+'|'+divPayMode+'|||||||||||||||'+mobile+'</ns:param>\n</ns:MFAPI>\n</soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//	console.log(buffer);
					//
                    console.log("herrerererererere",results);
					
                    
                    console.log("check",results["s:Envelope"]["s:Body"][0]['MFAPIResponse'][0]['MFAPIResult'])
                    
                    
                    var createClientMasg = results["s:Envelope"]["s:Body"][0]['MFAPIResponse'][0]['MFAPIResult'];
				    createClientMasg = createClientMasg.toString().split("|");
                     console.log("Is Client Created ???",createClientMasg[1]);
                   
					callback(null,clientId,createClientMasg[0],clientData) 
                
					

				})
            });
          
      },function(clientId,creteClientMasg,clientData,callback){
          
         
         
          var userid=req.session.user.userid;
          
          if(creteClientMasg=='100'){
              var query = client.query("update users set clientid=$2 where userid=$1",[userid,clientId],function (err, result) {
					if (err) {
						console.log("cant insert users clientid", err);
						res.send("false");
					} else {
						
                        console.log("Insert to users clientid Success");
						//callback(null, req.session.userinvestmentheaderid)
					}
                  callback(null,clientId,clientData)
				});
              
          }
          
          
      },function(clientId,clientData,callback){
          
       
          //console.log("client data",clientData);
          var aofPath=clientData.aof;
          var nachPath=clientData.nach;
          console.log("aof path",aofPath);
          console.log("nach path",nachPath);
          
         
          
         var dateName=getDate1();
          
         
          
          var userID = "109401";
	      var memberID = "10940";
	      var password = "Syed@22";
	      var passKey = "test";
          var email=req.session.user.email;
         // var tifPath="E:/bseDocuments/"+email+"/";
          var tifPath="/home/ubuntu/bsedocuments/"+email+"/";
           var pathAOFtif=tifPath+"/"+memberID+clientId+dateName+".tiff";
          var filename=memberID+clientId+dateName+".tiff";
     if(aofPath){
              
             
               pdf2png.convert(aofPath, function(resp){
            if(!resp.success)
            {
                console.log("Something went wrong: " + resp.error);
                return;
            }
    
            console.log("the pdf got converted, now save it!");
    
            fs.writeFile(pathAOFtif, resp.data, function(err) {
            if(err) {
                    console.log(err);
                  }
            else {
                  console.log("The file AOF as tif was saved!");
                }
            });
               });
              
          }
        /*  if(nachPath){
               pdf2png.convert("E:/bseDocuments/raj@test.com/Nach.pdf", function(resp){
            if(!resp.success)
            {
                console.log("Something went wrong: " + resp.error);
                return;
            }
    
            console.log("the pdf got converted, now save it!");
    
            fs.writeFile("E:/bseDocuments/raj@test.com/Nach.tiff", resp.data, function(err) {
            if(err) {
                    console.log(err);
                  }
            else {
                  console.log("The file nach as tif was saved!");
                    }
                });
               });
          }
          
         */
       callback(null,pathAOFtif,clientId,clientData,filename)   
          
      },function(pathAOFtif,clientId,clientData,filename,callback){
           console.log("Client create getPassword method",clientId)
          
          
        
         //Get the encrypted password from MFFile upload service
         var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/StarMFFileUploadService/StarMFFileUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFFileUploadService"><soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action soap:mustUnderstand="1">http://tempuri.org/IStarMFFileUploadService/GetPassword</wsa:Action><wsa:To>http://bsestarmfdemo.bseindia.com/StarMFFileUploadService/StarMFFileUploadService.svc/Basic</wsa:To></soap:Header><soap:Body><tem:GetPassword><tem:Param><star:MemberId>' + memberID + '</star:MemberId><star:Password>' + password + '</star:Password><star:UserId>'+ userID +'</star:UserId></tem:Param></tem:GetPassword></soap:Body></soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON
                   
						//console.log("File upload-------------",results);
                   var password = results["s:Envelope"]["s:Body"][0]["GetPasswordResponse"][0]["GetPasswordResult"][0]["b:ResponseString"][0];
                    
                   var pass = password.toString();
                    console.log("Password-------------",pass);
                   callback(null,pass,pathAOFtif,clientId,clientData,filename)

				})

			});
          
          
      },function(password,pathAOFtif,clientId,clientData,filename,callback){
          
          console.log("AOF creation method",clientId)
          req.session.clientId=clientId;
            console.log("file and path",pathAOFtif);
            var clientId=clientId;
            var doctype="RIA";        //Document type
            var flag="UCC";            //Flag
            var userID = "109401";
	        var memberID = "10940";
	        var passKey = "test";
            //Upload file to MFFile upload service
          
             var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/StarMFFileUploadService/StarMFFileUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFFileUploadService"><soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action soap:mustUnderstand="1">http://tempuri.org/IStarMFFileUploadService/UploadFile</wsa:Action><wsa:To>http://bsestarmfdemo.bseindia.com/StarMFFileUploadService/StarMFFileUploadService.svc/Basic</wsa:To></soap:Header><soap:Body><tem:UploadFile><tem:data> <star:ClientCode>' + clientId + '</star:ClientCode> <star:DocumentType>' + doctype + '</star:DocumentType><star:EncryptedPassword>' + password +'</star:EncryptedPassword><star:FileName>'+filename+'</star:FileName><star:Filler1>NULL</star:Filler1><star:Flag>' + flag + '</star:Flag><star:MemberCode>' + memberID + '</star:MemberCode><star:UserId>'+ userID +'</star:UserId> <star:pFileBytes></star:pFileBytes></tem:data></tem:UploadFile></soap:Body></soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON
                   
						console.log("File \\\\-------------",results);
                    
                    
                    var data = results["s:Envelope"]["s:Body"][0]['UploadFileResponse'][0]['UploadFileResult'][0]['b:ResponseString'];
                    console.log("Password-------------",data);
                   
                 //var fault=results["s:Envelope"]["s:Body"][0]['s:Fault'][0]['s:Reason'][0]['s:Text'];
                   // console.log("Fault",fault);
                   //var data = results["s:Envelope"]["s:Body"][0];
                    //console.log("Password-------------",data);
                     req.session.clientId=clientId;
                  callback(null)
                       
				})
            });
		
          
                
      }],
		function (err,result) {
        
			if (err)
				throw err;
           
            console.log("RESULTS",result)
                var clientVal=req.session.clientId;
                    console.log("Client created succesfully................................................",clientVal)
                    callback(null,clientVal)   

		})
                   
                    
                         
            }
        else{
            
                clientId=req.session.user.clientid;
                console.log("Client exist already ................................................",clientId)
                   callback(null,clientId) 
        }
       
       
                
             
     },function (clientId,callback) {
            
       
        
			//user investments header
			var userId = req.session.savedplanheader.userid;
			var goalId = req.session.savedplanheader.goalid;
			var riskProfile = req.session.savedplanheader.riskprofile;
			var masterAmount = req.session.savedplanheader.masteramount;
			var totalYears = req.session.savedplanheader.totalyears;
			var sip = req.session.savedplanheader.sip;
			var status = "pending";


			creation_date = new Date();
			modified_date = new Date();

			//Header table insert
			var query = client.query("INSERT INTO userinvestmentsheader(userid,goalid,riskprofile, masteramount, totalyears, sip,status,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING userinvestmentheaderid", [userId, goalId, riskProfile, masterAmount, totalYears, sip, status,
				creation_date, modified_date, req.session.user.name], function (err, result) {
					if (err) {
						console.log("cant insert assets header allocation data", err);
						res.send("false");
					} else {
						//res.send(1);
						//console.log("savedplanid" + result.rows[0]['userinvestmentheaderid']);

						req.session.userinvestmentheaderid = result.rows[0]['userinvestmentheaderid'];
						callback(null, req.session.userinvestmentheaderid,clientId)
					}
				});
		}, function (userid,clientId,callback) {
            
            
			var len = req.session.savedplandetail.length;
			//user investment orders
			var userId = req.session.savedplanheader.userid;
			var goalId = req.session.savedplanheader.goalid;
			var riskProfile = req.session.savedplanheader.riskprofile;

			var userinvestmentheaderid = req.session.userinvestmentheaderid;

			var orderDate = new Date();
			var userPan = "AKBPB7607H";
			var orderType = "invest";


			var bsetxn = [];
			var userinvestmentorderid = [];
			//user investments detail

            console.log("SCHEMES INSERT");
			var x = 1;
			var y = len;

			for (i = 0; i < len; i++) {
				var transNo = functions.getTransactionID(req.session.user.userid) + i;
				console.log("out loop" + req.session.savedplandetail[i].allocationdescription);
				var amount = req.session.savedplandetail[i].allocationamount;
				var schemeCode = req.session.savedplandetail[i].schemecode;
				var schemeDesc = req.session.savedplandetail[i].allocationdescription;
				var schemeCategory = req.session.savedplandetail[i].allocationcategory;
				var allocationPercentage = req.session.savedplandetail[i].allocationpercentage;

				var schemeId = req.session.savedplandetail[i].schemeid;


				if (x <= y) {
					bsetxn[i] = transNo;
					//console.log("SchemeDesc" + schemeDesc + "id" + schemeId + "amount" + amount + "txn" + bsetxn[i]);
					var query = client.query("INSERT INTO userinvestmentorders(userinvestmentorderdate,userid,userpan,ordertype,goalid,riskprofile,schemeid,amount,bsetxnreference,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING userinvestmentorderid", [orderDate, userId, userPan, orderType, goalId, riskProfile, schemeId, amount, transNo,
						creation_date, modified_date, req.session.user.name], function (err, result1) {
							if (err) {
								console.log("cant insert assets header allocation data", err);
								res.send("false");
							} else {
								//res.send(1);
								//console.log("userinvestmentorderid" + result1.rows[0]['userinvestmentorderid']);

								var dummy = result1.rows[0]['userinvestmentorderid'];
								userinvestmentorderid.push(dummy);
								//console.log("dummy" + userinvestmentorderid + "i" + i);

								//userinvestmentorderid[i] =dummy;


								if (x >= y) {
									//console.log("inside callback" + i)
									//							console.log("inside callback x"+x)
									//							console.log("inside callback y"+y)
								//	console.log("send" + userinvestmentorderid + "transaction" + bsetxn)
									req.session.bsetxn = bsetxn;
									callback(null, userinvestmentorderid,clientId)
								}
								x++;

								//console.log("inside loop x" + x)
								//console.log("inside loop y" + y)

							}


						});


				}


			}

		}, function (id,clientId,callback) {

			var len = req.session.savedplandetail.length;
			//user investment orders
			var userId = req.session.savedplanheader.userid;
			var goalId = req.session.savedplanheader.goalid;
			var riskProfile = req.session.savedplanheader.riskprofile;

			var userinvestmentheaderid = req.session.userinvestmentheaderid;


			var orderDate = new Date();
			var userPan = "AKBPB7607H";
			var orderType = "invest";



			//user investments detail


			var x = 1;
			var y = len;

			for (i = 0; i < len; i++) {
				var userinvestmentorderid = id[i];
				var transNo = functions.getTransactionID(req.session.user.userid) + i;
				//console.log("out loop" + req.session.savedplandetail[i].allocationdescription);
				var amount = req.session.savedplandetail[i].allocationamount;
				var schemeCode = req.session.savedplandetail[i].schemecode;
				var schemeDesc = req.session.savedplandetail[i].allocationdescription;
				var schemeCategory = req.session.savedplandetail[i].allocationcategory;
				var allocationPercentage = req.session.savedplandetail[i].allocationpercentage;

				var schemeId = req.session.savedplandetail[i].schemeid;
				//console.log("orderid" + userinvestmentorderid);

				if (x <= y) {
					var query = client.query("INSERT INTO userinvestmentdetail(userinvestmentheaderid,schemeid,schemedescription,schemecategory,allocationpercentage,allocationamount,created,modified,createdby,orderid,schemecode) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [userinvestmentheaderid, schemeId, schemeDesc, schemeCategory, allocationPercentage, amount, creation_date, modified_date, req.session.user.name, userinvestmentorderid, schemeCode],
						function (err, result2) {
							if (err) {
								console.log("cant insert assets header allocation data", err);
								res.send("false");
							} else {
								//res.send(1);
								//console.log("User investment details" + result2.rows);


								if (x >= y) {
									//							console.log("inside callback"+i)
									//							console.log("inside callback x"+x)
									//							console.log("inside callback y"+y)
									callback(null, x,clientId)
								}
								x++;

							//	console.log("inside loop x" + x)
							//	console.log("inside loop y" + y)





							}


						});


				}


			}
		},
		function (x, clientId,callback) {

             
			//get the password for the order creation 

			var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmf.in/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmf.in/MFOrderEntry/getPassword</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:getPassword  xmlns="http://bsestarmf.in/MFOrderEntry/getPassword">\n         <ns:UserId>109401</ns:UserId>\n          <ns:Password>Syed@22</ns:Password>\n         <ns:PassKey>test</ns:PassKey>\n      </ns:getPassword>\n   </soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);
                
                console.log('statusCode:', response && response.statusCode);
				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//	console.log(buffer);
					//console.log("Response----------------",response);
                  //  console.log("herrerererererere",results);
					var password = results["s:Envelope"]["s:Body"][0]["getPasswordResponse"][0]["getPasswordResult"][0];
					//console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
					orderBsePassArray = password.toString().split("|");
					//console.log("Order ENtry Service Password " + orderBsePassArray[1]);
					callback(null, orderBsePassArray[1],clientId)

				})

			});





		},
		function (pass,clientId,callback) {

			var len = req.session.savedplandetail.length;
            // console.log("in orders client id",clientId);
			x = 1; y = len;

			//order entry
			for (i = 0; i < len; i++) {


			//	console.log("init x" + x);
			//	console.log("init" + y);
                
                
				var amount = req.session.savedplandetail[i].allocationamount;

                console.log("bse" + i);
				var transCode = "NEW";
				var transNo = req.session.bsetxn[i];
				var orderId = "";
				var clientCode = clientId;
				var schemeCode = req.session.savedplandetail[i].schemecode;
				var buySell = "P";
				var buySellType = "FRESH";
				var DPTxn = "P";
				var orderValue = amount;
				var quantity = "";
				var allRedeem = "N";
				var folioNo = "";
				var remarks = "";
				var KYCStatus = "Y";
				var refNo = "";
				var subBrCode = "";
				var EUIN = "E123456";
				var EUINVal = "Y";
				var minRedeem = "N";
				var DPC = "N";
				var IPAdd = "";

			//	console.log("transactionNo" + transNo[i]);
				var orderBody = '<ns:TransCode>' + transCode + '</ns:TransCode><ns:TransNo>' + transNo + '</ns:TransNo><ns:OrderId>' + orderId + '</ns:OrderId><ns:UserID>' + userID + '</ns:UserID><ns:MemberId>' + memberID + '</ns:MemberId><ns:ClientCode>' + clientCode + '</ns:ClientCode><ns:SchemeCd>' + schemeCode + '</ns:SchemeCd><ns:BuySell>' + buySell + '</ns:BuySell><ns:BuySellType>' + buySellType + '</ns:BuySellType><ns:DPTxn>' + DPTxn + '</ns:DPTxn><ns:OrderVal>' + orderValue + '</ns:OrderVal><ns:Qty>' + quantity + '</ns:Qty><ns:AllRedeem>' + allRedeem + '</ns:AllRedeem><ns:FolioNo>' + folioNo + '</ns:FolioNo><ns:Remarks>' + remarks + '</ns:Remarks><ns:KYCStatus>' + KYCStatus + '</ns:KYCStatus><ns:RefNo>' + refNo + '</ns:RefNo><ns:SubBrCode>' + subBrCode + '</ns:SubBrCode><ns:EUIN>' + EUIN + '</ns:EUIN><ns:EUINVal>' + EUINVal + '</ns:EUINVal><ns:MinRedeem>' + minRedeem + '</ns:MinRedeem><ns:DPC>' + DPC + '</ns:DPC><ns:IPAdd>' + IPAdd + '</ns:IPAdd><ns:Password>' +
					pass + '</ns:Password><ns:PassKey>' + passKey + '</ns:PassKey><ns:Parma1></ns:Parma1><ns:Param2></ns:Param2><ns:Param3></ns:Param3>';

				var options = {
					method: 'POST',
					url: 'http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc',
					headers: {
						'cache-control': 'no-cache',
						'content-type': 'application/soap+xml; charset=utf-8'
					},
					body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmf.in/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmf.in/MFOrderEntry/orderEntryParam</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:orderEntryParam  xmlns="http://bsestarmf.in/MFOrderEntry/orderEntryParam">\n         ' + orderBody + '  </ns:orderEntryParam>\n   </soap:Body>\n</soap:Envelope>'
				};

				//console.log("in loop" + req.session.savedplandetail[i].allocationdescription);

				request(options, function (error, response, body) {
					if (error) throw new Error(error);

                   // console.log("Response orders----------------",response);
					parseString(body, function (err, results) {
						// Get The Result From The Soap API and Parse it to JSON

						//	console.log(buffer);
						//
						var orderResponse = results["s:Envelope"]["s:Body"][0]["orderEntryParamResponse"][0]["orderEntryParamResult"];
						bseOrderArray = orderResponse.toString().split("|");
						//console.log("Transaction code - " + bseOrderArray[0]);
						//console.log("Unique Reference Number - " + bseOrderArray[1]);
						//console.log("Order Number - " + bseOrderArray[2]);
						//console.log("UserId - " + bseOrderArray[3]);
						//console.log("MemberId - " + bseOrderArray[4]);
						//console.log("Client Code - " + bseOrderArray[5]);
						//console.log("BSE Remarks - " + bseOrderArray[6]);
						//console.log("Flag - " + bseOrderArray[7]);
						var bseStatus;
						if (bseOrderArray[7] == 1)
							bseStatus = "failure";
						else
							bseStatus = "success";

						var bseTransactionReference = bseOrderArray[1];
						var bseOrderReference = bseOrderArray[2];


						if (x <= y) {

							var query = client.query("UPDATE userinvestmentorders SET bseorderreference = $1, bsestatus = $2 WHERE bsetxnreference =$3 ", [bseOrderReference, bseStatus, bseTransactionReference], function (err, result1) {
								if (err) {
									console.log("cant insert assets header allocation data", err);
									res.send("false");
								} else {
									//res.send(1);
									// console.log("userinvestmentorderid"+result1.rows[0]['userinvestmentorderid']);


									//userinvestmentorderid = result1.rows[0]['userinvestmentheaderid'];



									if (x >= y) {
										//							console.log("inside callback"+i)
										//							console.log("inside callback x"+x)
										//							console.log("inside callback y"+y)
										callback(null,clientId)
									}
									x++;

									//console.log("inside loop x" + x)
									//console.log("inside loop y" + y)

								}


							});



						} else {

							console.log("count is more than the expected value" + x + "length" + y);
						}





					})

				});


			}
          
		},function (clientId,callback) {

			//console.log("I am the payment ",clientId);
            //console.log("USERID",userID)
            //console.log("USERID",memberID)
			//get Password for Payment Link
			var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/getPassword</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:getPassword  xmlns="http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/getPassword">\n         <ns:UserId>' + userID + '</ns:UserId>\n         <ns:MemberId>' + memberID + '</ns:MemberId>\n         <ns:Password>Syed@22</ns:Password>\n <ns:PassKey>test</ns:PassKey>\n      </ns:getPassword>\n   </soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//	console.log(buffer);
					//
					var password = results["s:Envelope"]["s:Body"][0]["getPasswordResponse"][0]["getPasswordResult"][0];
					//console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
					bsePassArray = password.toString().split("|");
					console.log("MFUPload Service Password " + bsePassArray[1]);
					callback(null, bsePassArray[1],clientId)

				})

			});
           

		},
		function (uploadPass,clientId,callback) {

          //  console.log("the payment link",clientId);
         //     console.log("final USERID",userID)
        //    console.log("final membID",memberID)
			//make the payment 

            
			var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:MFAPI  xmlns="http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI">\n         <ns:Flag>03</ns:Flag>\n		 <ns:UserId>109401</ns:UserId>\n         <ns:EncryptedPassword>' + uploadPass + '</ns:EncryptedPassword>\n<ns:param>10940|' + clientId + '|http://54.152.36.19:3000/BsePaymentStatus</ns:param>\n            </ns:MFAPI>\n   </soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//console.log(results);
					//
					var link = results["s:Envelope"]["s:Body"][0]["MFAPIResponse"][0]["MFAPIResult"][0];
					//console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
					bseLinkArray = link.toString().split("|");
					//console.log("Payment link " + bseLinkArray[1]);
                    
                                        freshdesk.createTicket({
                                              name: req.session.user.name,
                                              email: req.session.user.email,
                                              subject: 'Received BSE Payment link',
                                              description: req.session.user.name+' Placed Orders into BSE Succesfuly and Received BSE Payment link',
                                              status: 2,
                                              priority: 2
                                                }, function (err, data) {
                                                    console.log(err);
                                                })
                    
                    
					callback(null)
					res.render('bseRedirect', { data: bseLinkArray[1] });

				})

			});

			//Check the Payment Status
			/*		 	 var options = {
								method: 'POST',
								url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
				headers: {
								'cache-control': 'no-cache',
								'content-type': 'application/soap+xml; charset=utf-8'
					},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:MFAPI  xmlns="http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI">\n         <ns:Flag>11</ns:Flag>\n		 <ns:UserId>109401</ns:UserId>\n         <ns:EncryptedPassword>'+uploadPass+'</ns:EncryptedPassword>\n         <ns:param>SOHANTEST1|720191|BSEMF</ns:param>\n            </ns:MFAPI>\n   </soap:Body>\n</soap:Envelope>' };
			
			  request(options, function (error, response, body) {
				if (error) throw new Error(error);
			
					parseString(body, function(err, results){
				// Get The Result From The Soap API and Parse it to JSON
						
						  //console.log(results);
						//
					   var link = results["s:Envelope"]["s:Body"][0]["MFAPIResponse"][0]["MFAPIResult"][0];
					   //console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
						bsePaymentStatus = link.toString().split("|");
					   console.log("Payment Status "+bsePaymentStatus[1]);
						//return bsePaymentStatus[1];
					 // callback(null,bseLinkArray[1])
					   
			   })
				  
			  });	
					 */
		}],
		function (err, result) {

			if (err)
				throw err;




		})



};

exports.postProceedOrder = (req, res) => {

	//bse credentials	
	var userID = "109401";
	var memberID = "10940";
	var password = "Syed@22";
	var passKey = "test";


	async.waterfall([
		function (callback) {
			console.log(req.body.savedplanid);
			var query = client.query("SELECT * FROM savedplansheader  where savedplansheader.userid=$1 and savedplansheader.savedplanid = $2 ", [req.session.user.userid, req.body.savedplanid],
				function (err, result) {
					if (err)
						console.log("Cant get assets values" + err);


					//console.log("details header" + result.rows.length);
					asetData = result.rows[0];
					//console.log(asetData);
					if (result.rows.length > 0) {

						req.session.savedplanheader1 = asetData;
					//	console.log(req.session.savedplanheader1);
						callback(null, asetData)

					}



				})


		},
		function (asetData, callback) {


			//user investments header
			var userId = req.session.savedplanheader1.userid;
			var goalId = req.session.savedplanheader1.goalid;
			var riskProfile = req.session.savedplanheader1.riskprofile;
			var masterAmount = req.session.savedplanheader1.masteramount;
			var totalYears = req.session.savedplanheader1.totalyears;
			var sip = req.session.savedplanheader1.sip;
			var status = "pending";

			console.log(userId, goalId);

			creation_date = new Date();
			modified_date = new Date();

			//Header table insert
			var query = client.query("INSERT INTO userinvestmentsheader(userid,goalid,riskprofile, masteramount, totalyears, sip,status,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING userinvestmentheaderid", [userId, goalId, riskProfile, masterAmount, totalYears, sip, status,
				creation_date, modified_date, req.session.user.name], function (err, result) {
					if (err) {
						console.log("cant insert assets header allocation data", err);
						res.send("false");
					} else {
						//res.send(1);
						console.log("savedplanid" + result.rows[0]['userinvestmentheaderid']);


						req.session.userinvestmentheaderid1 = result.rows[0]['userinvestmentheaderid'];
						callback(null, req.session.userinvestmentheaderid1)



					}


				});




		}, function (assetData, callback) {

			var query = client.query("SELECT * FROM savedplansdetail where savedplanid=$1 and allocationtype=$2", [req.body.savedplanid, 'scheme'],
				function (err, result) {
					if (err)
						console.log("Cant get assets values");



					asetDataAllocationDetail = result.rows;

					//console.log(asetDataAllocationDetail);
					req.session.savedplandetail1 = asetDataAllocationDetail;
					callback(null, asetDataAllocationDetail)




				})




		}, function (asetDataAllocationDetail, callback) {

			var len = req.session.savedplandetail1.length;
			//user investment orders
			var userId = req.session.savedplanheader1.userid;
			var goalId = req.session.savedplanheader1.goalid;
			var riskProfile = req.session.savedplanheader1.riskprofile;

			var userinvestmentheaderid = req.session.userinvestmentheaderid1;

			var orderDate = new Date();
			var userPan = "AKBPB7607H";
			var orderType = "invest";


			var bsetxn1 = [];
			var userinvestmentorderid = [];
			//user investments detail


			var x = 1;
			var y = len;

			for (i = 0; i < len; i++) {
				var transNo = functions.getTransactionID(req.session.user.userid) + i;
				//console.log("out loop" + req.session.savedplandetail1[i].allocationdescription);
				var amount = req.session.savedplandetail1[i].allocationamount;
				var schemeCode = req.session.savedplandetail1[i].schemecode;
				var schemeDesc = req.session.savedplandetail1[i].allocationdescription;
				var schemeCategory = req.session.savedplandetail1[i].allocationcategory;
				var allocationPercentage = req.session.savedplandetail1[i].allocationpercentage;

				var schemeId = req.session.savedplandetail1[i].schemeid;


				if (x <= y) {
					bsetxn1[i] = transNo;
					//console.log("SchemeDesc" + schemeDesc + "id" + schemeId + "amount" + amount + "txn" + bsetxn1[i]);
					var query = client.query("INSERT INTO userinvestmentorders(userinvestmentorderdate,userid,userpan,ordertype,goalid,riskprofile,schemeid,amount,bsetxnreference,created,modified,createdby) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING userinvestmentorderid", [orderDate, userId, userPan, orderType, goalId, riskProfile, schemeId, amount, transNo,
						creation_date, modified_date, req.session.user.name], function (err, result1) {
							if (err) {
								console.log("cant insert assets header allocation data", err);
								res.send("false");
							} else {
								//res.send(1);
								//console.log("userinvestmentorderid" + result1.rows[0]['userinvestmentorderid']);

								var dummy = result1.rows[0]['userinvestmentorderid'];
								userinvestmentorderid.push(dummy);
								//console.log("dummy" + userinvestmentorderid + "i" + i);

								//userinvestmentorderid[i] =dummy;


								if (x >= y) {
									console.log("inside callback" + i)
									//							console.log("inside callback x"+x)
									//							console.log("inside callback y"+y)
									console.log("send" + userinvestmentorderid + "transaction" + bsetxn1)
									req.session.bsetxn1 = bsetxn1;
									callback(null, userinvestmentorderid)
								}
								x++;

							//	console.log("inside loop x" + x)
							//	console.log("inside loop y" + y)

							}


						});


				}


			}

		}, function (id, callback) {

			var len = req.session.savedplandetail1.length;
			//user investment orders

			var userId = req.session.savedplanheader1.userid;
			var goalId = req.session.savedplanheader1.goalid;
			var riskProfile = req.session.savedplanheader1.riskprofile;

			var userinvestmentheaderid = req.session.userinvestmentheaderid1;


			var orderDate = new Date();
			var userPan = "AKBPB7607H";
			var orderType = "invest";



			//user investments detail


			var x = 1;
			var y = len;

			for (i = 0; i < len; i++) {
				var userinvestmentorderid = id[i];
				var transNo = functions.getTransactionID(req.session.user.userid) + i;
				console.log("out loop" + req.session.savedplandetail1[i].allocationdescription);
				var amount = req.session.savedplandetail1[i].allocationamount;
				var schemeCode = req.session.savedplandetail1[i].schemecode;
				var schemeDesc = req.session.savedplandetail1[i].allocationdescription;
				var schemeCategory = req.session.savedplandetail1[i].allocationcategory;
				var allocationPercentage = req.session.savedplandetail1[i].allocationpercentage;

				var schemeId = req.session.savedplandetail1[i].schemeid;
				//console.log("orderid" + userinvestmentorderid);

				if (x <= y) {
					var query = client.query("INSERT INTO userinvestmentdetail(userinvestmentheaderid,schemeid,schemedescription,schemecategory,allocationpercentage,allocationamount,created,modified,createdby,orderid,schemecode) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [userinvestmentheaderid, schemeId, schemeDesc, schemeCategory, allocationPercentage, amount, creation_date, modified_date, req.session.user.name, userinvestmentorderid, schemeCode],
						function (err, result2) {
							if (err) {
								console.log("cant insert assets header allocation data", err);
								res.send("false");
							} else {
								//res.send(1);
								//console.log("User investment details" + result2.rows);


								if (x >= y) {
									//							console.log("inside callback"+i)
									//							console.log("inside callback x"+x)
									//							console.log("inside callback y"+y)
									callback(null, x)
								}
								x++;

							//	console.log("inside loop x" + x)
							//	console.log("inside loop y" + y)





							}


						});


				}


			}
		},
		function (x, callback) {


			//get the password for the order creation 

			var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmf.in/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmf.in/MFOrderEntry/getPassword</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:getPassword  xmlns="http://bsestarmf.in/MFOrderEntry/getPassword">\n         <ns:UserId>' + userID + '</ns:UserId>\n          <ns:Password>Syed@22</ns:Password>\n         <ns:PassKey>test</ns:PassKey>\n      </ns:getPassword>\n   </soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//	console.log(buffer);
					//
                   // console.log("========",results)
					var password = results["s:Envelope"]["s:Body"][0]["getPasswordResponse"][0]["getPasswordResult"][0];
					//console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
					orderBsePassArray = password.toString().split("|");
					console.log("Order ENtry Service Password " + orderBsePassArray[1]);
					callback(null, orderBsePassArray[1])

				})

			});





		},
		function (pass, callback) {

			var len = req.session.savedplandetail1.length;

			x = 1; y = len;

			//order entry
			for (i = 0; i < len; i++) {


			//	console.log("init x" + x);
			//	console.log("init" + y);


				var amount = req.session.savedplandetail1[i].allocationamount;

				console.log("bse" + i);
				var transCode = "NEW";
				var transNo = req.session.bsetxn1[i];
				var orderId = "";
				var clientCode = "SOHANDEMO2";
				var schemeCode = req.session.savedplandetail1[i].schemecode;
				var buySell = "P";
				var buySellType = "FRESH";
				var DPTxn = "P";
				var orderValue = amount;
				var quantity = "";
				var allRedeem = "N";
				var folioNo = "";
				var remarks = "";
				var KYCStatus = "Y";
				var refNo = "";
				var subBrCode = "";
				var EUIN = "E123456";
				var EUINVal = "Y";
				var minRedeem = "N";
				var DPC = "N";
				var IPAdd = "";

				//console.log("transactionNo" + transNo[i]);
				var orderBody = '<ns:TransCode>' + transCode + '</ns:TransCode><ns:TransNo>' + transNo + '</ns:TransNo><ns:OrderId>' + orderId + '</ns:OrderId><ns:UserID>' + userID + '</ns:UserID><ns:MemberId>' + memberID + '</ns:MemberId><ns:ClientCode>' + clientCode + '</ns:ClientCode><ns:SchemeCd>' + schemeCode + '</ns:SchemeCd><ns:BuySell>' + buySell + '</ns:BuySell><ns:BuySellType>' + buySellType + '</ns:BuySellType><ns:DPTxn>' + DPTxn + '</ns:DPTxn><ns:OrderVal>' + orderValue + '</ns:OrderVal><ns:Qty>' + quantity + '</ns:Qty><ns:AllRedeem>' + allRedeem + '</ns:AllRedeem><ns:FolioNo>' + folioNo + '</ns:FolioNo><ns:Remarks>' + remarks + '</ns:Remarks><ns:KYCStatus>' + KYCStatus + '</ns:KYCStatus><ns:RefNo>' + refNo + '</ns:RefNo><ns:SubBrCode>' + subBrCode + '</ns:SubBrCode><ns:EUIN>' + EUIN + '</ns:EUIN><ns:EUINVal>' + EUINVal + '</ns:EUINVal><ns:MinRedeem>' + minRedeem + '</ns:MinRedeem><ns:DPC>' + DPC + '</ns:DPC><ns:IPAdd>' + IPAdd + '</ns:IPAdd><ns:Password>' +
					pass + '</ns:Password><ns:PassKey>' + passKey + '</ns:PassKey><ns:Parma1></ns:Parma1><ns:Param2></ns:Param2><ns:Param3></ns:Param3>';

				var options = {
					method: 'POST',
					url: 'http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc',
					headers: {
						'cache-control': 'no-cache',
						'content-type': 'application/soap+xml; charset=utf-8'
					},
					body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmf.in/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmf.in/MFOrderEntry/orderEntryParam</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:orderEntryParam  xmlns="http://bsestarmf.in/MFOrderEntry/orderEntryParam">\n         ' + orderBody + '  </ns:orderEntryParam>\n   </soap:Body>\n</soap:Envelope>'
				};

			//	console.log("in loop" + req.session.savedplandetail1[i].allocationdescription);

				request(options, function (error, response, body) {
					if (error) throw new Error(error);


					parseString(body, function (err, results) {
						// Get The Result From The Soap API and Parse it to JSON

						//	console.log(buffer);
						//
						var orderResponse = results["s:Envelope"]["s:Body"][0]["orderEntryParamResponse"][0]["orderEntryParamResult"];
						bseOrderArray = orderResponse.toString().split("|");
						/*console.log("Transaction code - " + bseOrderArray[0]);
						console.log("Unique Reference Number - " + bseOrderArray[1]);
						console.log("Order Number - " + bseOrderArray[2]);
						console.log("UserId - " + bseOrderArray[3]);
						console.log("MemberId - " + bseOrderArray[4]);
						console.log("Client Code - " + bseOrderArray[5]);
						console.log("BSE Remarks - " + bseOrderArray[6]);
						console.log("Flag - " + bseOrderArray[7]);*/
						var bseStatus;
						if (bseOrderArray[7] == 1)
							bseStatus = "failure";
						else
							bseStatus = "success";

						var bseTransactionReference = bseOrderArray[1];
						var bseOrderReference = bseOrderArray[2];


						if (x <= y) {

							var query = client.query("UPDATE userinvestmentorders SET bseorderreference = $1, bsestatus = $2 WHERE bsetxnreference =$3 ", [bseOrderReference, bseStatus, bseTransactionReference], function (err, result1) {
								if (err) {
									console.log("cant insert assets header allocation data", err);
									res.send("false");
								} else {


									if (x >= y) {
										//							
										callback(null)
									}
									x++;

									//console.log("inside loop x" + x)
									//console.log("inside loop y" + y)

								}


							});



						} else {

							//console.log("count is more than the expected value" + x + "length" + y);
						}





					})

				});


			}

		},
		function (callback) {

			//console.log("I am the payment ");
			//get Password for Payment Link
			var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/getPassword</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:getPassword  xmlns="http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/getPassword">\n         <ns:UserId>' + userID + '</ns:UserId>\n         <ns:MemberId>10940</ns:MemberId>\n         <ns:Password>Syed@22</ns:Password>\n         <ns:PassKey>test</ns:PassKey>\n      </ns:getPassword>\n   </soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//	console.log(buffer);
					//
					var password = results["s:Envelope"]["s:Body"][0]["getPasswordResponse"][0]["getPasswordResult"][0];
					//console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
					bsePassArray = password.toString().split("|");
					console.log("MFUPload Service Password " + bsePassArray[1]);
					callback(null, bsePassArray[1])

				})

			});


		},
		function (uploadPass, callback) {



			//make the payment 


			var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n   <soap:Header>\n   <a:Action >http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI</a:Action>\n   <a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n   </soap:Header>\n   <soap:Body>\n      <ns:MFAPI  xmlns="http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI">\n         <ns:Flag>03</ns:Flag>\n		 <ns:UserId>' + userID + '</ns:UserId>\n         <ns:EncryptedPassword>' + uploadPass + '</ns:EncryptedPassword>\n         <ns:param>10940|SOHANDEMO2|http://54.152.36.19:3000/BsePaymentStatus</ns:param>\n    </ns:MFAPI>\n   </soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//console.log(results);
					//
					var link = results["s:Envelope"]["s:Body"][0]["MFAPIResponse"][0]["MFAPIResult"][0];
					//console.log("myFault"+results["Fault"]["Reason"][0]["Text"]);
					bseLinkArray = link.toString().split("|");
					//console.log("Payment link " + bseLinkArray[1]);
					// callback(null,bseLinkArray[1])
					res.render('bseRedirect', { data: bseLinkArray[1] });

				})

			});


		}],
		function (err, result) {

			if (err)
				throw err;




		})



};

// module.exports = router;
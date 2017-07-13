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

var fs= require('fs');
var pdf2png=require("pdf2png");

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
    
    
exports.getClient = (req, res) => {

    var userID = "109401";
	var memberID = "10940";
	var password = "Syed@11";
	var passKey = "test";
    
    console.log("Client Creation +++++++++////++++++++");
    async.waterfall([
        function (callback) {
            
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
            
            
            
      },
        
        
		function (clientData,callback) {
            
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
           
           console.log("client code",clientCode)
           console.log("Data needed",clientData);
          
          
          var clientId=clientCode;
          var holdingType="SI";      //Single Holding type SI => Hard coded
          var taxStatus="01";       //Hard coded currently no data in db as tax indivisual as 01
          var occupationCode="03";  //Occupaition code has to extracted based on user detail in db 03->Professional
          var name=clientData.name;
          var clientAppName1="";    // mandatary Currenlty no data found
          //2 blank
           var dob=clientData.dob;
          var dob1=dob.replace(/-/g, "/");
         console.log("dobbbb",dob1);
          
          var clientGender="M";     //Currenlty no data found need to get data from user
          var clientFather="";       // if client minor CLIENT FATHERHUSBAND tax status 02 then mandatory
          var pan=clientData.pan; 
          var clientNomineeName=clientData.nominee;
          var clientNomineeRelation=clientData.nomineerelation;
          var clientGaurdianPan="";  
          var clientType="D";        //Physical P Demat D
          var defaultDp="NSDL";     //Default DP Id (CDSL / NSDL),PHYS in case of Physical no data found
                                     
          //2 blanks
          var nsdlDpid="NSDL";          // Mandatary if NSDL
          var nsdlcltid="NSDL";         //  Mandatary if NSDL
          
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
          var divPayMode="01";    //01-Cheque 02-Direct Credit 03-ECS 04-NEFT 05-RTGS
        
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
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://bsestarmfdemo.bseindia.com/2016/01/" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n<soap:Header>\n<a:Action>http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI</a:Action>\n<a:To>http://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Basic</a:To>\n</soap:Header>\n<soap:Body><ns:MFAPI>\n<ns:Flag>02</ns:Flag>\n<ns:UserId>109401</ns:UserId>\n<ns:EncryptedPassword>'+clientpassword+'</ns:EncryptedPassword>\n<ns:param>'+clientId+'|'+holdingType+'|'+taxStatus+'|'+occupationCode+'|'+name+'|||'+dob1+'|'+clientGender+'||'+pan+'|'+clientNomineeName+'|'+clientNomineeRelation+'||'+clientType+'|'+defaultDp+'|||'+nsdlDpid+'|'+nsdlcltid+'|'+accType+'|'+accNO+'|582006506|'+neftcode+'|Y||||||||||||||||||||||'+comAddress1+'|||'+city+'|'+state+'|'+pincode+'|'+country+'|||||'+email+'|'+clientCommunicate+'|'+divPayMode+'|||||||||||||||'+mobile+'</ns:param>\n</ns:MFAPI>\n</soap:Body>\n</soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON

					//	console.log(buffer);
					//
                    console.log("herrerererererere",results);
					
                    
                    console.log("check",results["s:Envelope"]["s:Body"][0]['MFAPIResponse'][0]['MFAPIResult'])
                    
                    
                    var creteClientMasg = results["s:Envelope"]["s:Body"][0]['MFAPIResponse'][0]['MFAPIResult'];
				    creteClientMasg = creteClientMasg.toString().split("|");
                     console.log("Is Client Created ???",creteClientMasg[1]);
					
					callback(null,clientId,creteClientMasg[0],clientData)

				})
            });
          
      },function(clientId,creteClientMasg,clientData,callback){
          
          console.log("Client id",clientId)
          console.log("Masg Code",creteClientMasg)
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
          
          console.log(clientId);
          //console.log("client data",clientData);
          var aofPath=clientData.aof;
          var nachPath=clientData.nach;
          console.log("aof path",aofPath);
          console.log("nach path",nachPath);
          
         
          
         var dateName=getDate1();
          
          console.log("date as ddmmyyyy",dateName);
          
          var userID = "109401";
	      var memberID = "10940";
	      var password = "Syed@11";
	      var passKey = "test";
          var email=req.session.user.email;
          var tifPath="E:/bseDocuments/"+email+"/";
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
          
            console.log("file and path",pathAOFtif);
            var clientcode=clientId;
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
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFFileUploadService"><soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action soap:mustUnderstand="1">http://tempuri.org/IStarMFFileUploadService/UploadFile</wsa:Action><wsa:To>http://bsestarmfdemo.bseindia.com/StarMFFileUploadService/StarMFFileUploadService.svc/Basic</wsa:To></soap:Header><soap:Body><tem:UploadFile><tem:data> <star:ClientCode>' + clientcode + '</star:ClientCode> <star:DocumentType>' + doctype + '</star:DocumentType><star:EncryptedPassword>' + password +'</star:EncryptedPassword><star:FileName>'+filename+'</star:FileName><star:Filler1>NULL</star:Filler1><star:Flag>' + flag + '</star:Flag><star:MemberCode>' + memberID + '</star:MemberCode><star:UserId>'+ userID +'</star:UserId> <star:pFileBytes></star:pFileBytes></tem:data></tem:UploadFile></soap:Body></soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON
                   
						console.log("File \\\\-------------",results);
                    
                    
                    var data = results["s:Envelope"]["s:Body"][0]['UploadFileResponse'][0]['UploadFileResult'][0]['b:ResponseString'];
                    console.log("Password-------------",data);
                   
                   /* var fault=results["s:Envelope"]["s:Body"][0]['s:Fault'][0]['s:Reason'][0]['s:Text'];
                    console.log("Fault",fault);*/
                   //var data = results["s:Envelope"]["s:Body"][0];
                    //console.log("Password-------------",data);
                  // callback(true)

				})

			});
          
          
          
      }],
		function (err, result) {

			if (err)
				throw err;




		})

    
    

};
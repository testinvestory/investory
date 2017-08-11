const express = require('express');
// const router = express.Router();
const async = require('async');

const crypto = require('crypto');
/* common functions */
const functions = require('./functions');

//DB connection
var client = require('../../config/database');

var multer  =   require('multer');
var fs = require('node-fs');

var http = require('http');
var soap = require('soap');
var parseString = require('xml2js').parseString;
var request = require("request");

var fs      = require('fs');
var pdf2png=require("pdf2png");


exports.getbseform = (req, res) => {
 
loginStatus = functions.checkLoginStatus(req);
    
    
    mobile = req.useragent["isMobile"];
		if (mobile)
			pageName = "bseformmobile";
		else
			pageName = "bseform";
async.waterfall([
    function (callback) {
       var user;
         var query = client.query("select * from users where userid="+req.session.user.userid, function (err, result)
                 {
					if (err)
						console.log("Cant get user deatils in bseform from db");
                    else if(result.rows.length>0)
                    {
                        
                        user=result.rows[0];
                       
                    }
                    else{
                        user='false';
                    }
            // console.log("USERSS",user)
             callback(null,user)
                    });
    }, function (user,callback) {
        
        	var panstatus;

				var query = client.query("select * from pandetails where userid="+req.session.user.userid, function (err, result) {
					if (err)
						console.log("Cant get pan status from db");
                    else if(result.rows.length>0){
					var panstatus = result.rows[0];
                    
                    }else {
                        var panstatus='false';
                    }
                   // console.log("Pan details------",panstatus)
					callback(null, panstatus,user)
                });
        
    }, function (panstatus,user,callback) {
               
      
         var data; 
         var query = client.query("select * from bseformdetail where userid="+req.session.user.userid, function (err, result2) {
					if (err)
						console.log("Cant get user status from db");
        
                    else if(result2.rows.length>0)
                        {
                          data=result2.rows[0];
                            
                        }
                    else{
                           
                          data='false';
                        }
             // console.log("bse",data)
              res.render(pageName,{user:user,panstatus:panstatus,data:data});
             callback(true, 'ok')
             
         
         });
    }], function (err, result) {

				if (err = 'ok')
					return;



			})
   
};

exports.getpdf = (req, res) => {
    
    
 var query = client.query("select * from bseformdetail where userid="+req.session.user.userid, function (err, result) {
					if (err){
						console.log("Cant get pan status from db");
                         var data='false';
                    }
                    else{
                        
                       var data=result.rows[0] 
                    }
                res.render("pdf",{data:data});
                    
                    });
};





exports.postBseFormData = (req,res) =>{
    loginStatus = functions.checkLoginStatus(req);
    
     mobile = req.useragent["isMobile"];
		if (mobile)
			pageName = "bseformmobile";
		else
			pageName = "bseform";
   
    
    var name=req.body.name;
    var pan=req.body.pan;
    var kyc=req.body.kyc;
    var dob=req.body.dob;
    var mobile=req.body.mobile;
    var email=req.body.email;
    var holdingType=req.body.holding;
    var telephone=req.body.tel;
    var city=req.body.city;
    var state=req.body.state;
    var country=req.body.country;
    var occupation=req.body.occupation;
    var address=req.body.address;
    var pincode=req.body.pincode;
    
    var bankName=req.body.bankname;
    var branch=req.body.branch;
    var ifsc=req.body.ifsc;
    var accountNo=req.body.accno;
    var accType=req.body.acctype;
    var micr=req.body.micr;
    
    var nomineeName=req.body.nomineename;
    var nomineeRelation=req.body.nrelationship;
    var guardianName=req.body.guardianname;
    var nomineeAddress=req.body.nomineeaddress;

  
    var creation_date = new Date();
    var modified_date = new Date();
    
    async.waterfall([
         function (callback) {
      var query = client.query('update bseformdetail set userid=$1,name=$2,pan=$3,kyc=$4,dob=$5,email=$6,mobile=$7,telephone=$8,holdingtype=$9,occupation=$10,address=$11,city=$12,pincode=$13,state=$14,country=$15,bankname=$16,branch=$17,ifsc=$18,accountno=$19,accounttype=$20,nominee=$21,nomineerelation=$22,guardianname=$23,nomineeaddress=$24,created=$25,modified=$26,micr=$27 where userid=$1', [req.session.user.userid,name,pan,kyc,dob,email,mobile,telephone,holdingType,occupation,address,city,pincode,state,country,bankName,branch,ifsc,accountNo,accType,nomineeName,nomineeRelation,guardianName,nomineeAddress,creation_date, modified_date,micr], function (err, result) {
          if (err) {
            console.log('cant insert bseformdata data', err)
          }
          else{
              console.log("bseformdata inserted db succesfully");
          }
           callback(null)
      });
         },
     
    function (callback) {
       var user;
         var query = client.query("select * from users where userid="+req.session.user.userid, function (err, result)
                 {
					if (err)
						console.log("Cant get user deatils in bseform from db");
                    else if(result.rows.length>0)
                    {
                        
                        user=result.rows[0];
                       
                    }
                    else{
                        user='false';
                    }
            // console.log("USERSS",user)
             callback(null,user)
                    });
    }, function (user,callback) {
        
        	var panstatus;

				var query = client.query("select * from pandetails where userid="+req.session.user.userid, function (err, result) {
					if (err)
						console.log("Cant get pan status from db");
                    else if(result.rows.length>0){
					var panstatus = result.rows[0];
                    
                    }else {
                        var panstatus='false';
                    }
                   // console.log("Pan details------",panstatus)
					callback(null, panstatus,user)
                });
        
    }, function (panstatus,user,callback) {
               
        
         var data; 
         var query = client.query("select * from bseformdetail where userid="+req.session.user.userid, function (err, result2) {
					if (err)
						console.log("Cant get user status from db");
        
                    else if(result2.rows.length>0)
                        {
                          data=result2.rows[0];
                            
                        }
                    else{
                           
                          data='false';
                        }
             // console.log("bse",data)
              res.render(pageName,{user:user,panstatus:panstatus,data:data});
             callback(true, 'ok')
             
         
         });
    }], function (err, result) {

				if (err = 'ok')
					return;



			})  


    
};



exports.getnach = (req,res) =>{

    loginStatus = functions.checkLoginStatus(req);
      mobile = req.useragent["isMobile"];
		if (mobile)
			pageName = "nachmobile";
		else
			pageName = "nach";
    
    
async.waterfall([
    function (callback) {
       var user;
         var query = client.query("select * from users where userid="+req.session.user.userid, function (err, result)
                 {
					if (err)
						console.log("Cant get user deatils in bseform from db");
                    else if(result.rows.length>0)
                    {
                        
                        user=result.rows[0];
                       
                    }
                    else{
                        user='false';
                    }
            // console.log("USERSS",user)
             callback(null,user)
                    });
    }, function (user,callback) {
        
        	var bseformdata;

				var query = client.query("select * from bseformdetail where userid="+req.session.user.userid, function (err, result) {
					if (err)
						console.log("Cant get bseformdetail status from db");
                    else if(result.rows.length>0){
					var bseformdata = result.rows[0];
                    
                    }else {
                        var bseformdata='false';
                    }
                   // console.log("Pan details------",panstatus)
					callback(null, bseformdata,user)
                });
        
    }, function (bseformdata,user,callback) {
               
       
         var data; 
         var query = client.query("select * from nachformdetail where userid="+req.session.user.userid, function (err, result2) {
					if (err)
						console.log("Cant get user status from db");
        
                    else if(result2.rows.length>0)
                        {
                          data=result2.rows[0];
                            
                        }
                    else{
                           
                          data='false';
                        }
             // console.log("bse",data)
              res.render(pageName,{user:user,bseformdata:bseformdata,data:data});
             callback(true, 'ok')
             
         
         });
    }], function (err, result) {

				if (err = 'ok')
					return;



			})
   
    
   
};
exports.postNachFormData = (req,res) =>{
    
    loginStatus = functions.checkLoginStatus(req);
      mobile = req.useragent["isMobile"];
		if (mobile)
			pageName = "nachmobile";
		else
			pageName = "nach";
    
    
    var micr=req.body.micr;
    var umrn=req.body.umrn;
    var date=req.body.date1;
    var sbankcode=req.body.sbankcode;
    var utilitycode=req.body.utilitycode;
    var bselimited=req.body.bselimited;
    var rs=req.body.rs;
    var frequency=req.body.frequency;
    var debittype=req.body.Debit;
    var Mandatereference1=req.body.ref1;
    var Mandatereference2=req.body.ref2;
    var periodefrom=req.body.from;
    var periodeto=req.body.to;
    
    
    var mobile=req.body.mobile;
    var email=req.body.email;
    
    
    var bankName=req.body.bankname;
    var ifsc=req.body.ifsc;
    var accountNo=req.body.accno;
    var creation_date = new Date();
    var modified_date = new Date();
  
       async.waterfall([
         function (callback) {
      var query = client.query('update nachformdetail set micr=$2,umrn=$3,createddate=$4,sbankcode=$5,utilitycode=$6,bselimited=$7,rupees=$8,frequencyofdebit=$9,debittype=$10,Mandatereference1=$11,Mandatereference2=$12,periodefrom=$13,periodeto=$14,mobile=$15,email=$16,bankname1=$17,ifsc1=$18,accountno1=$19,created=$20,modified=$21 where userid=$1', [req.session.user.userid,micr,umrn,date,sbankcode,utilitycode,bselimited,rs,frequency,debittype,Mandatereference1,Mandatereference2,periodefrom,periodeto,mobile,email,bankName,ifsc,accountNo,creation_date, modified_date], function (err, result) {
          if (err) {
            console.log('cant insert nachformdata data', err)
          }
          else{
              console.log("bseformdata inserted db succesfully");
          }
           callback(null)
      });
         },
     
    function (callback) {
       var user;
         var query = client.query("select * from users where userid="+req.session.user.userid, function (err, result)
                 {
					if (err)
						console.log("Cant get user deatils in bseform from db");
                    else if(result.rows.length>0)
                    {
                        
                        user=result.rows[0];
                       
                    }
                    else{
                        user='false';
                    }
            
             callback(null,user)
         
         });
    }, function (user,callback) {
               
       
         var data; 
         var query = client.query("select * from nachformdetail where userid="+req.session.user.userid, function (err, result2) {
					if (err)
						console.log("Cant get user status from db");
        
                    else if(result2.rows.length>0)
                        {
                          data=result2.rows[0];
                            
                        }
                    else{
                           
                          data='false';
                        }
              res.render(pageName,{user:user,data:data});
             callback(true, 'ok')
              });
         }], function (err, result) {

				if (err = 'ok')
					return;



			})  
    
};



exports.getnachpdf = (req, res) => {
    
    
 var query = client.query("select * from nachformdetail where userid="+req.session.user.userid, function (err, result) {
					if (err){
						console.log("Cant get pan status from db");
                        var data='false';
                    }
                    else{
                       
                       var data=result.rows[0]  ;
                    }
                        
                  res.render("nachpdf",{data:data});  
                    });
};

var store =   multer.diskStorage({    
                destination: function (req, file, callback) 
                    {
       //var name = '/home/ubuntu/panuploads/'+pan; //location for directory to store documents 
                        
                    var email=req.session.user.email;            
                  // var name='E:/bseDocuments/'+email;
                    var name='/home/ubuntu/bsedocuments/'+email;
                    
                    fs.mkdir(name, 0777, true, function (err) 
                    {
                        if (err) 
                            {
                                console.log(err);
                            } 
                        else
                            {
                                console.log('name ' + name + ' created.');
                            }
                            callback(null,name)
      
                    });
                 },
            filename : function (req, file, callback) 
                    {
                        
                        callback(null, file.originalname);
                    }

                    });
        var uploadDocument = multer({ storage : store}).single('doc'); //array('doc',2)

exports.postDocument =(req ,res) =>{
    
    loginStatus = functions.checkLoginStatus(req);
    
    var email=req.session.user.email; 
    async.waterfall([
      function(callback)
        {
            
            
            uploadDocument(req,res,function(err) 
                {
                    if(err) 
                    {
                     console.log(err);
                     console.log("Error uploading pic.");
                    }
                  console.log("Document is uploaded");
                 
                 // console.log(req.files.length);
               // if(req.files.length==2){
                    var filename1=req.file.originalname;
                   // var filename2=req.files[1].originalname;
                    // var path1bse='E:/bseDocuments/'+email+'/'+filename1;
                    // var path2nach='E:/bseDocuments/'+email+'/'+filename2;
                   var path1bse='/home/ubuntu/bsedocuments/'+email+'/'+filename1;
                   //var path2nach='/home/ubuntu/bsedocuments/'+email+'/'+filename2;
             //   }
              //  else{
                    //var filename1=req.files.originalname;
                     //var path1bse='E:/bseDocuments/'+email+'/'+filename1;
                    // var path1bse='/home/ubuntu/bsedocuments/'+email+'/'+filename1;
                     //var path2nach=0;
               // }
                
               
                //console.log(path1bse);
               // callback(null,path1bse,path2nach)
                callback(null,path1bse)
                });
            
            
           
        },
       function(path1bse,callback)
         {
            
            // console.log("path2nach",path2nach);
             if(path1bse){
                    var query=client.query("update bseformdetail set aof=$2 where userid=$1", [req.session.user.userid,path1bse
	           ],function(err,result){
	           if(err)
	            console.log("Cant get update bseformdetail details from users table",err);
	           else
	            {
	        		 console.log("Upadte to bseformdetail details Success..!");
			  }
             });
        }
        /*if(path2nach){
            
             var query=client.query("update nachformdetail set nach=$2 where userid=$1", [req.session.user.userid,path2nach
	           ],function(err,result){
	           if(err)
	            console.log("Cant get update nachformdetail details from users table",err);
	           else
	            {
	        		 console.log("Upadte to nachformdetail details Success..!");
			  }
             });
            
        }*/
             
         }
        ], function (err, result) 
          {
            if (err)
              {
                console.log(err);   
              }
        res.redirect('/profile');
      });   

   res.redirect('/profile'); 
};


exports.postaofStatus=(req,res) =>{
   // console.log("Status as Downloaded");
    var status='downloaded'
    var query=client.query("update bseformdetail set aofstatus=$2 where userid=$1", [req.session.user.userid,status
	           ],function(err,result){
	           if(err)
	            console.log("Cant get update bseformdetail details from users table",err);
	           else
	            {
	        		 console.log("Upadte to bseformdetail details Success..!");
			  }
             });
    
};


exports.getUploadfile =(req,res) =>{
    
    var userID = "109401";  // User code
	var memberID = "10940";  // member code
	var password = "Syed@11"; //Password
	var passKey = "test";     //Pass key
    
    var clientcode="NISHANT"; //Client code
    var doctype="RIA";        //Document type
    var flag="UCC";            //Flag
    
    async.waterfall([
		function (callback) {
   
            
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
                   // console.log("Password-------------",pass);
                   callback(null,pass)

				})

			});
            
        },
        function(password,callback){
            
            
          //Upload file to MFFile upload service
             var options = {
				method: 'POST',
				url: 'http://bsestarmfdemo.bseindia.com/StarMFFileUploadService/StarMFFileUploadService.svc/Basic',
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/soap+xml; charset=utf-8'
				},
				body: '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/" xmlns:star="http://schemas.datacontract.org/2004/07/StarMFFileUploadService"><soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action soap:mustUnderstand="1">http://tempuri.org/IStarMFFileUploadService/UploadFile</wsa:Action><wsa:To>http://bsestarmfdemo.bseindia.com/StarMFFileUploadService/StarMFFileUploadService.svc/Basic</wsa:To></soap:Header><soap:Body><tem:UploadFile><tem:data> <star:ClientCode>' + clientcode + '</star:ClientCode> <star:DocumentType>' + doctype + '</star:DocumentType><star:EncryptedPassword>' + password +'</star:EncryptedPassword><star:FileName>10940NISHANT04072017.tif</star:FileName><star:Filler1>NULL</star:Filler1><star:Flag>' + flag + '</star:Flag><star:MemberCode>' + memberID + '</star:MemberCode><star:UserId>'+ userID +'</star:UserId> <star:pFileBytes></star:pFileBytes></tem:data></tem:UploadFile></soap:Body></soap:Envelope>'
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				parseString(body, function (err, results) {
					// Get The Result From The Soap API and Parse it to JSON
                   
						console.log("File \\\\-------------",results);
                    
                    
                    var data = results["s:Envelope"]["s:Body"][0]['UploadFileResponse'][0]['UploadFileResult'];
                   
                    
                   /* var fault=results["s:Envelope"]["s:Body"][0]['s:Fault'][0]['s:Reason'][0]['s:Text'];
                    console.log("Fault",fault);*/
                   //var data = results["s:Envelope"]["s:Body"][0];
                    //console.log("Password-------------",data);
                   callback(null)

				})

			});
            
            
        }],
		function (err, result) {

			if (err)
				throw err;




		})
    
};




/* 
* Modules *
*/
const express = require('express');
const router = express.Router();
const async = require('async');
const pg = require('pg');
const crypto = require('crypto');
/* common functions */
const functions = require('./functions');
//const conString = "postgres://postgres:postgres@localhost:5432/investory";
var conString = process.env.DATABASE_URL ||  "postgres://postgres:123@localhost:5432/investory";
var client = new pg.Client(conString);
client.connect();

var multer  =   require('multer');

var fs = require('node-fs');
var currentPage;

exports.getProfile = (req, res) => {
	
    currentPage = req.session.activePage = "/profile";
	let goalsCount;
	  mobile = req.useragent["isMobile"];
    if(mobile)
   		pageName = "profileMobile";
	else
		pageName = "yourStory";
		 
	console.log(">>>>>>>>>>I am here");
	loginStatus = functions.checkLoginStatus(req);
	
    //profile
     
   var query=client.query("select * from users inner join profile on users.userid = profile.userid  where users.userid=$1",[req.session.user.userid],function(err,result){
            if(err)
                console.log("Cant get profile details from users table");
       
       
            if(result.rows.length>0)
                {
                    var query = client.query("SELECT count(userinvestmentsheader.goalid) FROM userinvestmentsheader INNER JOIN goal ON userinvestmentsheader.goalid = goal.goalid WHERE userinvestmentsheader.userid=$1 and status in ('pending', 'reconciled')", [req.session.user.userid],
			 function (err, qresult) {
                     if(err)
                console.log("Cant get goals details in profile");
                    if(qresult.rows.length>0)
                {
                    goalCount=qresult.rows[0];
                    console.log(">>>>>>>>>>I am in goal count",goalCount.count);
                     
                   if(goalCount.count > 0)
                   {
                       goalsCount=goalCount.count
                      
                   }else
                         goalsCount=false;
                    
                
	               res.render(pageName,{
	  
	  	           user : req.user ,
                       goalCount:goalsCount,
				   profile: result.rows[0],
                   message: 'updated',
	  	           selectorDisplay: "show",
	  		       loggedIn: loginStatus,
	               smessage: req.flash('signupMessage'),
		           lmessage: req.flash('loginMessage'),
	  	            path:'profileData',
	 
	  	            footerDisplay: "hide",
	                footerData1: "Blog",
	               footerData2: "FAQs"
  });
			
		}
    });
    }
                                             
	});
  
  
};

exports.postProfile = (req, res) => {
	   currentPage = req.session.activePage = "/profile";

loginStatus = functions.checkLoginStatus(req);

                var dob=req.body.dob;
    console.log("DOB",dob);
                var age=req.body.age;
     console.log("DOB",age);
                var gender=req.body.gender;
                var maritalstatus=req.body.maritalstatus;
                var address=req.body.address;
                var pincode=req.body.pincode;
                var city=req.body.city;
                var pan=req.body.pan;
     // console.log("dob",dob);
                 // name:req.body.username,
                //email:req.body.email,
                //mobile:req.body.mnumber,
                // bank_details:req.body.bankdetails     
			   //email:req.session.userEmail
                //var created//new date();
                //var modified=//new date();    ,$10,$11 ,created,modified
       
      // console.log(dob,age,gender,maritalstatus,address,pincode,city,pan);
        console.log("profile Post",req.user.userid);
	var query=client.query("update profile set userid=$1,age=$2,gender=$3,maritalstatus=$4,address=$5,pincode=$6,city=$7,pan=$8,createdby=$9,dob=$10 where userid=$1", [req.session.user.userid, age, gender, maritalstatus, address, pincode, city, pan, req.session.user.name,dob
	],function(err,result){
	        if(err)
	            console.log("Cant get update profile details from users table",err);
	        if(result.rows.length>0)
	            {
	        		 console.log("Insert to profile details Success..!");
			  }

	    res.redirect("/profile");
	});
};
exports.postprofilebank = (req, res) => {
    
    currentPage = req.session.activePage = "/profile";

	loginStatus = functions.checkLoginStatus(req);

                    var bank=req.body.bank;
                    var ifsc=req.body.ifsc;
                    var branch=req.body.branch;
                    var account=req.body.accno;
    
              var query=client.query("insert into pandetails(userid,bankname,accno,ifsc,branch,createdby) values($1,$2,$3,$4,$5,$6)", [req.session.user.userid, bank,account,ifsc, branch, req.session.user.name],function(err,result)
   	/*var query=client.query("update pandetails set bankname=$2,accno=$3,ifsc=$4,branch=$5 where userid=$1", [req.session.user.userid,bank,account,ifsc, branch],function(err,result)*/{ 
                  if(err)
                       console.log("Insert error in bank details",err);
                  if(result.rows.length>0)
                {
            		 console.log("Insert to pan details Success..!");
			  }
              });
        res.redirect("/profile");
    
};


var store =   multer.diskStorage({    
                destination: function (req, file, callback) 
                    {

        				//callback(null,'/home/ubuntu/dbfiles');
                       callback(null, 'C:/Users/Nishant/Desktop/new code/30.05.17/investory-master/investory-master/public/images/profiles');
                         //   /home/ubuntu/investory-master06.06/public/images/profiles
      
                     },
                 filename : function (req, file, callback) 
                    {
                        
                        callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
                    }

                    });
                var uploadPic = multer({ storage : store}).single('doc');

            
exports.postProfilePic = (req ,res ) => {
    currentPage = req.session.activePage = "/profile";

	loginStatus = functions.checkLoginStatus(req);
   
 
    async.waterfall([
      function(callback)
        {
            
            
            uploadPic(req,res,function(err) 
                {
                    if(err) 
                    {
                     console.log(err);
                     console.log("Error uploading pic.");
                    }
                  console.log("Pic is uploaded");
                
                    file_name=req.file.originalname;

                   console.log("in upload ",file_name);
                
                //var paths="../dbfiles/"+file_name;
				 var paths="/images/profiles/"+file_name;
                callback(null,paths)
                });
            
            
           
        },
       function(paths,callback)
         {
            console.log("paths",paths);
        
             var query=client.query("update users set image=$2 where userid=$1", [req.session.user.userid,paths
	],function(err,result){
	        if(err)
	            console.log("Cant get update profile details from users table",err);
	        else
	            {
	        		 console.log("Upadte to profile details Success..!");
			  }
             });
             
           
             
             
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
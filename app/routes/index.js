/*
* Modules *
*/
const express = require('express')
const router = express.Router()
const async = require('async')

const crypto = require('crypto')
/* common functions */
const functions = require('./functions')

//DB connection
var client = require('../../config/database');




var currentPage

router.get('/', functions.isLoggedIn, function (req, res) {
  loginStatus = functions.checkLoginStatus(req)
       
  currentPage = req.session.activePage = '/'
    
     mobile = req.useragent["isMobile"];
    if(mobile)
   		pageName = "mobile";
	else
		pageName = "index";
    
    
       var userid=req.session.user.userid;    
    if(loginStatus){
    var query = client.query("select aof,aofstatus,kycstatus from bseformdetail as t1 join pandetails as t2 on t1.userid=t2.userid  where t1.userid=$1",[userid],function (err, result) {
					if (err)
                    {
						console.log("Cant get data values",err);
                       var aofUploadStatus='false';
                         res.render(pageName, {
                            user: req.user,
                             aofUploadStatus:null,
                            smessage: req.flash('signupMessage'),
                            lmessage: req.flash('loginMessage'),
                            selectorDisplay: 'hide',
                            loggedIn: loginStatus,
                            footerDisplay: 'show',
                            footerData1: 'Blog',
                            footerData2: 'FAQs',
                            moods: functions.mood

                        })
                    }
                    else
                   {
					var aofUploadStatus = result.rows[0];
					   
                        res.render(pageName, {
                            user: req.user,
                            aofUploadStatus:aofUploadStatus,
                            smessage: req.flash('signupMessage'),
                            lmessage: req.flash('loginMessage'),
                            selectorDisplay: 'hide',
                            loggedIn: loginStatus,
                            footerDisplay: 'show',
                            footerData1: 'Blog',
                            footerData2: 'FAQs',
                            moods: functions.mood

                        })
                  }
				});
    
    }else{
        
                        res.render(pageName, {
                            user: req.user,
                            aofUploadStatus:null,
                            smessage: req.flash('signupMessage'),
                            lmessage: req.flash('loginMessage'),
                            selectorDisplay: 'hide',
                            loggedIn: loginStatus,
                            footerDisplay: 'show',
                            footerData1: 'Blog',
                            footerData2: 'FAQs',
                            moods: functions.mood

                        })
        
         }
    
  

});

  

module.exports = router

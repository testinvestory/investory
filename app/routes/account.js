/* 
* Modules *
*/
var bcrypt = require('bcrypt-nodejs');
const express = require('express');
const router = express.Router();
const async = require('async');
const pg = require('pg');
const crypto = require('crypto');
/* common functions */
const functions = require('./functions');
const conString = "postgres://postgres:postgres@localhost:5432/investory";
//var conString = process.env.DATABASE_URL ||  "postgres://postgres:123@localhost:5432/investory";
var client = new pg.Client(conString);
client.connect();


var currentPage;

exports.getAccount = (req, res) => {
	currentPage = req.session.activePage = "/Accounts";

	loginStatus = functions.checkLoginStatus(req);


	mobile = req.useragent["isMobile"];
	if (mobile)
		pageName = "accountsMobile";
	else
		pageName = "yourStory";

	console.log("invoices", req.session.user.userid);
	var query = client.query("select to_char(a.userinvestmentorderdate,'dd-Mon-yyyy') as investdate, b.name, a.amount,NULLIF(a.units,0) as units from userinvestmentorders a, schemesmaster b where a.schemeid = b.schemeid and a.userid=$1", [req.session.user.userid], function (err, result) {
		if (err)
			console.log("Cant get portfolio details in goal selection" + err);
		console.log("ja be loude" + result.rows.length)

		if (result.rows.length > 0) {
			console.log("statements");


			var len = result.rows.length;


			res.render(pageName, {

				user: req.user,
				stmt: result.rows,
				length: len,
				selectorDisplay: "show",
				loggedIn: loginStatus,
				path: 'accountData',
				smessage: req.flash('signupMessage'),
				lmessage: req.flash('loginMessage'),
				path1: 'accountInvestmentData',
				footerDisplay: "hide",
				footerData1: "Blog",
				footerData2: "FAQs"
			});
		} else {

			res.render(pageName, {

				user: req.user,
				stmt: false,
				selectorDisplay: "show",
				loggedIn: loginStatus,
				path: 'accountData',
				smessage: req.flash('signupMessage'),
				lmessage: req.flash('loginMessage'),
				path1: 'accountInvestmentData',
				footerDisplay: "hide",
				footerData1: "Blog",
				footerData2: "FAQs"
			});


		}
	});
};

exports.getInvoice = (req, res) => {
	currentPage = req.session.activePage = "/Invoices";
	loginStatus = functions.checkLoginStatus(req);
	var today = new Date();
	var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
	mobile = req.useragent["isMobile"];
	if (mobile)
		pageName = "myInvoicesMobile";
	else
		pageName = "yourStory";
	console.log("invoices", req.session.user.userid);
	var query = client.query("SELECT a.usersubscriptionorderid, to_char(orderdate, 'dd-Mon-yyyy') AS orderdate, amount, paymentreference, durationdays, to_char(planrenewaldate, 'dd-Mon-yyyy') AS planrenewaldate  FROM usersubscriptionsorder a, usersubscriptions b WHERE a.userid = b.userid AND a.usersubscriptionorderid = b.usersubscriptionorderid AND a.status = 'success' AND a.userid = $1 ORDER BY 3 DESC", [req.session.user.userid], function (err, result) {
		if (err)
			console.log("Cant get portfolio details in goal selection");
		if (result.rows.length > 0) {
			console.log("statements");
			var len = result.rows.length;
			res.render(pageName, {
				user: req.user,
				stmt: result.rows,
				length: len,
				selectorDisplay: "show",
				loggedIn: loginStatus,
				path: 'accountData',
				smessage: req.flash('signupMessage'),
				lmessage: req.flash('loginMessage'),
				path1: 'accountInvoicesData',
				footerDisplay: "hide",
				footerData1: "Blog",
				footerData2: "FAQs",
				date: date,
				currentPage: currentPage
			});
		}
	});
};

exports.getTransaction = (req, res) => {

	currentPage = req.session.activePage = "/transaction";

	/*loginStatus = functions.checkLoginStatus(req);
	mobile = req.useragent["isMobile"]
	if (mobile) {
		res.render('transactionMobile.ejs', {

		});
	} else {
		res.render('yourStory.ejs', {

			user: req.user,
			selectorDisplay: "show",
			loggedIn: loginStatus,
			path: 'accountData',
			smessage: req.flash('signupMessage'),
			lmessage: req.flash('loginMessage'),
			path1: 'accountTransactionData',
			footerDisplay: "hide",
			footerData1: "Blog",
			footerData2: "FAQs",
			currentPage: currentPage
		});
	}*/

		loginStatus = functions.checkLoginStatus(req);
        
        mobile = req.useragent["isMobile"];
		if (mobile)
			pageName = "transactionMobile";
		else
			pageName = "yourStory";
        
		mobile = req.useragent["isMobile"]
		
        var query = client.query("select * from userTransactionlog where userid=$1",[req.session.user.userid], function (err, result) {
			if (err)
				console.log("Cant get transactons");
           
			if (err)
				console.log("Cant get portfolio details in goal selection" + err);
        
        if(result.rows.length>0){
			res.render(pageName, {

				user: req.user,
                trxn:result.rows,
				selectorDisplay: "show",
				loggedIn: loginStatus,
				path: 'accountData',
				smessage: req.flash('signupMessage'),
				lmessage: req.flash('loginMessage'),
				path1: 'accountTransactionData',
				footerDisplay: "hide",
				footerData1: "Blog",
				footerData2: "FAQs",
				currentPage: currentPage
			});
        }else{
            res.render(pageName, {

				user: req.user,
                trxn:false,
				selectorDisplay: "show",
				loggedIn: loginStatus,
				path: 'accountData',
				smessage: req.flash('signupMessage'),
				lmessage: req.flash('loginMessage'),
				path1: 'accountTransactionData',
				footerDisplay: "hide",
				footerData1: "Blog",
				footerData2: "FAQs",
				currentPage: currentPage
			});
        }
        
        });
};

exports.getSetting = (req, res) => {

	currentPage = req.session.activePage = "/Settings";

	mobile = req.useragent["isMobile"];
	if (mobile)
		pageName = "settingsMobile";
	else
		pageName = "yourStory";


	loginStatus = functions.checkLoginStatus(req);
	res.render(pageName, {
        message:req.flash(),
             val:'0',
		user: req.user,
		selectorDisplay: "show",
		loggedIn: loginStatus,
		path: 'accountData',
		smessage: req.flash('signupMessage'),
		lmessage: req.flash('loginMessage'),
		path1: 'accountSettingsData',
		footerDisplay: "hide",
		footerData1: "Blog",
		footerData2: "FAQs",
		currentPage: currentPage
	});
};

exports.postupdatePassword = (req, res) => {

	currentPage = req.session.activePage = "/Settings";
        loginStatus = functions.checkLoginStatus(req);
        
        
    let oldPassword=req.body.pwd;
    let newPassword=req.body.newpwd;
    let confirmPassword=req.body.conpwd;
       
        var query=client.query("select * from users where userid=$1", [req.session.user.userid],function(err,result1){ 
            
            if(err)
                console.log("User deatils not fetched in Settings");
            
             
           let curretPassword=result1.rows[0]['password'];
            let bool=bcrypt.compareSync(oldPassword,curretPassword);
      if (bool){
                 console.log("Old password is correct "+bool);
          
          
    if(newPassword==confirmPassword)
    {
        console.log("New and confirm passwords are Matched")
      let Password=bcrypt.hashSync(confirmPassword, bcrypt.genSaltSync(8), null);
   
    var query=client.query("update users set password=$1 where userid=$2", [Password,req.session.user.userid
    ],function(err,result){
            if(err)
                console.log("Cant get update profile details from users table",err);
            else
                {
            		 console.log("Password update Success");
			  
            req.flash('SuccessMessage', 'Password update Success');
                   
        res.render("yourStory",{
               message:req.flash('SuccessMessage'),            
                val:'1',
                user: req.user,
			selectorDisplay: "show",
			loggedIn: loginStatus,
			path: 'accountData',
			smessage: req.flash('signupMessage'),
			lmessage: req.flash('loginMessage'),
            success:'false',
			path1: 'accountSettingsData',
			footerDisplay: "hide",
			footerData1: "Blog",
			footerData2: "FAQs",
			currentPage: currentPage
            
        });
     }
    
    });
    }
    else{
               console.log("Passwords not matched");  
       req.flash('NotMatched','Passwords not matched');
        
               res.render("yourStory",{
                   message:req.flash('NotMatched'),
                val:'2',
            user: req.user,
			selectorDisplay: "show",
			loggedIn: loginStatus,
			path: 'accountData',
			smessage: req.flash('signupMessage'),
			lmessage: req.flash('loginMessage'),
			path1: 'accountSettingsData',
			footerDisplay: "hide",
			footerData1: "Blog",
			footerData2: "FAQs",
			currentPage: currentPage});
        }
      }
            
    else{
                console.log("Old Password entered is wrong");
              
         req.flash('OldMatched','Old Password entered is wrong');
        let val=3;
                res.render("yourStory",{
                 message:req.flash('OldMatched'),   
               val:'3',
            user: req.user,
			selectorDisplay: "show",
			loggedIn: loginStatus,
			path: 'accountData',
			smessage: req.flash('signupMessage'),
			lmessage: req.flash('loginMessage'),
            success:'false',
			path1: 'accountSettingsData',
			footerDisplay: "hide",
			footerData1: "Blog",
			footerData2: "FAQs",
			currentPage: currentPage
                });
        }
            
        });
};

exports.getReports = (req, res) => {
	currentPage = req.session.activePage = "/reports";

	mobile = req.useragent["isMobile"];
	if (mobile)
		pageName = "reportsMobile";
	else
		pageName = "yourStory";


	loginStatus = functions.checkLoginStatus(req);
	res.render(pageName, {

		user: req.user,
		selectorDisplay: "show",
		loggedIn: loginStatus,
		path: 'reportsData',
		smessage: req.flash('signupMessage'),
		lmessage: req.flash('loginMessage'),
		footerDisplay: "hide",
		footerData1: "Blog",
		footerData2: "FAQs"
	});
};


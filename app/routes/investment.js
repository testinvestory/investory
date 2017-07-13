/* 
* Modules *
*/
const express = require('express');
const router = express.Router();
const async = require('async');

const crypto = require('crypto');
/* common functions */
const functions = require('./functions');
//DB connection
var client = require('../../config/database');

var currentPage;

exports.getInvestment = (req, res) =>  {
	currentPage = req.session.activePage = "/Investment";
    
    console.log("INSIDE investment")
	loginStatus = functions.checkLoginStatus(req);
	var today = new Date();
	var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
	mobile = req.useragent["isMobile"];
	if (mobile)
		pageName = "myInvoicesMobile";
	else
		pageName = "yourStory";
	console.log("investment", req.session.user.userid);
	var query = client.query("select to_char(a.userinvestmentorderdate,'dd-Mon-yyyy') as investdate, b.name, a.amount,NULLIF(a.units,0) as units from userinvestmentorders a, schemesmaster b where a.schemeid = b.schemeid and a.amount > 0 and a.userid=$1 order by 1 desc", [req.session.user.userid], function (err, result) {
		if (err) {
			console.log("Cant get portfolio details in goal selection");
		}
        
        if (result.rows.length > 0) {
			console.log("statements");
			var len = result.rows.length;
			res.render(pageName, {
				user: req.user,
				stmtt: result.rows,
				length: len,
				selectorDisplay: "show",
				loggedIn: loginStatus,
				path: 'accountData',
				smessage: req.flash('signupMessage'),
				lmessage: req.flash('loginMessage'),
				path1: 'accountInvestmentData',
				footerDisplay: "hide",
				footerData1: "Blog",
				footerData2: "FAQs",
				date: date,
				currentPage: currentPage
			});
		}
        else{ 
			console.log("statements");
			
			res.render(pageName, {
				user: req.user,
				stmtt: false,
				selectorDisplay: "show",
				loggedIn: loginStatus,
				path: 'accountData',
				smessage: req.flash('signupMessage'),
				lmessage: req.flash('loginMessage'),
				path1: 'accountInvestmentData',
				footerDisplay: "hide",
				footerData1: "Blog",
				footerData2: "FAQs",
				date: date,
				currentPage: currentPage
			});
        }
	});
};


exports.postSetData = (req, res) => {

	req.session.offlinegoalName = req.body.goalName;
	req.session.offlineriskProfile = req.body.riskProfile;
	req.session.offlinemasterAmount = req.body.masterAmount;
	req.session.offlinetotalYears = req.body.totalYears;
	req.session.offlinesip = req.body.sip;
	req.session.offlineequityAmount = req.body.equityAmount;
	req.session.offlinehybridAmount = req.body.hybridAmount;
	req.session.offlinedebtAmount = req.body.debtAmount;
	req.session.offlineequityPercentage = req.body.equityPercentage;
	req.session.offlinehybridPercentage = req.body.hybridPercentage;
	req.session.offlinedebtPercentage = req.body.debtPercentage;


	req.session.save();
	console.log("offline = " + req.session.offlinegoalName);
	console.log("offline = " + req.session.offlineriskProfile);

};


exports.postScheme = (req, res) => {

	req.session.showscheme = req.body.showScheme;

	console.log("scheme pa = " + req.session.showscheme);

	res.send(true);
	//res.redirect('/GoalSelection');

};





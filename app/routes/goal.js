const express = require('express')
const async = require('async')

const crypto = require('crypto')
const functions = require('./functions')

//DB connection
var client = require('../../config/database');

var currentPage

exports.goalSelection = (req, res) => {
  currentPage = req.session.activePage = "/GoalSelection";
		loginStatus = functions.checkLoginStatus(req);
		mobile = req.useragent["isMobile"];
		if (mobile)
			pageName = "mobileMood";
		else
			pageName = "mood";
		if (req.session.bseStatus) {
			panMsg = req.session.bseStatus;
		} else {
			panMsg = "";
		}
		async.waterfall([
            function (callback) {
				//get the assets from the db
				var clientData;
                var userid=req.session.user.userid;
				var query = client.query("select * from bseformdetail as t1 join nachformdetail as t2 on t1.userid=t2.userid where t1.userid="+userid, function (err, result) {
					if (err){
						console.log("Cant get Aeets values");
                        clientData='false';
                    }
                    else{
					clientData = result.rows;
                        //console.log("clientData",clientData);
                    }
                   // console.log(assets)
					callback(null, clientData)
				});

			},function (clientData,callback) {
				//get the assets from the db
				var assets;

				var query = client.query("select to_json(row) as asset from (select * from categoryallocationmatrix order by camid) row ", function (err, result) {
					if (err)
						console.log("Cant get Aeets values");

					assets = result.rows;
                   // console.log(assets)
					callback(null, assets,clientData)
				});

			},function (assets,clientData,callback) {
				//get the pandetails from the db
				var panstatus;

				var query = client.query("select * from pandetails where userid="+req.session.user.userid, function (err, result) {
					if (err)
						console.log("Cant get pan status from db");
                    else if(result.rows.length>0){
					var panstatus = result.rows;
                    }else {
                        var panstatus='false';
                    }
                 //   console.log("Pan details------",panstatus)
					callback(null, panstatus,assets,clientData)
				});

			}, function (panstatus,assets,clientData,callback) {

				if (loginStatus) {
					var paid = false;
					var query = client.query(" select * from usersubscriptions where userid=" + req.session.user.userid + " and current_date <= planrenewaldate", function (err, result) {
						if (err)
							console.log("Cant get portfolio details in goal selection");

						//console.log("Lenght" + result.rows.length);
						if (result.rows.length > 0) {
							paid = true;
							req.session.paid = true;
							callback(null, paid,panstatus, assets,clientData)
						} else {
							paid = false;
							req.session.paid = false;
							callback(null, paid,panstatus,assets,clientData)
						}
					});
				} else {
					//render the get started page for get request
					//console.log("else not log in");
					res.render(pageName, {
						data: assets,
						user: req.user,
                        clientData:clientData,
                        panstatus:panstatus,
						selectorDisplay: "show",
						loggedIn: loginStatus,
						firslist: false,
						smessage: req.flash('signupMessage'),
						lmessage: req.flash('loginMessage'),
						footerDisplay: "hide",
						panMessage: "",
						footerData1: "Blog",
						footerData2: "FAQs",
						scheme: false,
						paid: false,
						abcd: false,
						assetFromDb: false,
						showPage5: "hide",
						hideAll: "show"
					});
					//callback(true);
					callback(true, 'ok')
				}

			},
			function (paid, panstatus,assets,clientData,callback) {
				//console.log("payment" + paid)
				if (paid) {
					async.waterfall([function (callback) {
						//Fetch Header
						//store the data in a json
						var query = client.query("SELECT * FROM savedplansheader where userid=$1 ORDER BY created DESC LIMIT 1 ", [req.session.user.userid], function (err, result) {
							if (err)
								console.log("Cant get assets values");
							//console.log("details header" + result.rows.length);
							asetData = result.rows[0];
							if (result.rows.length > 0) {
								req.session.savedplanheader = asetData;
							//	console.log("saved plan header" + req.session.savedplanheader.sip);
							//	console.log("saved plan header" + req.session.savedplanheader.goalid);
                            //    console.log("saved plan header" + req.session.savedplanheader.riskprofile);
							//	console.log("saved plan header" + req.session.savedplanheader.masteramount);
							//	console.log("saved plan header" + req.session.savedplanheader.totalyears);
							//	console.log("saved plan header" + req.session.savedplanheader.userid);

								callback(null, asetData)
							} else {

								res.render(pageName, {
									data: assets,
									user: req.user,
                                    clientData:clientData,
                                    panstatus:panstatus,
									selectorDisplay: "show",
									loggedIn: loginStatus,
									firslist: false,
									smessage: req.flash('signupMessage'),
									lmessage: req.flash('loginMessage'),
									footerDisplay: "hide",
									panMessage: "",
									footerData1: "Blog",
									footerData2: "FAQs",
									scheme: false,
									paid: paid,
									abcd: false,
									assetFromDb: false,
									showPage5: "hide",
									hideAll: "show"
								});
							}
						})
					}, function (headerData, callback) {
						//console.log(headerData)
						var query = client.query("SELECT * FROM savedplansdetail where savedplanid=$1 and allocationtype=$2 order by allocationcategory,allocationdescription desc", [headerData.savedplanid, 'scheme'],
							function (err, result) {
								if (err)
									console.log("Cant get assets values");
								//console.log("scheme pa in goal = " + req.session.showscheme);
								if (req.session.showscheme) {
									scheme = true;
								} else {
									scheme = false;
								}
								req.session.showscheme = false;
								asetDataDetail = result.rows;
								req.session.savedplandetail = asetDataDetail;
								//console.log("scheme pa in goal = " + req.session.showscheme);
								//console.log("test" + req.session.bseStatus + "scheme" + scheme);
								res.render(pageName, {
									data: assets,
									user: req.user,
                                    panstatus:panstatus,
                                    clientData:clientData,
									schemeData: asetDataDetail,
									smessage: req.flash('signupMessage'),
									lmessage: req.flash('loginMessage'),
									selectorDisplay: "show",
									loggedIn: loginStatus,
									footerDisplay: "hide",
									footerData1: "Blog",
									footerData2: "FAQs",
									scheme: scheme,
									panMessage: panMsg,
									abcd: false,
									paid: true,
									assetFromDb: headerData,
									showPage5: "show"
								});
								//callback(null,headerData,asetDataDetail)
							})
					}], function (err, result) {
					})
				} else {
					if (req.session.showAssetAfterLogin) {

						showAsset = true;
						console.log("Offline check for bool status" + showAsset)
						//req.session.showAssetAfterLogin =false;
					}
					else {

						showAsset = false;
						console.log("Offline check for bool status" + showAsset)
					}


					res.render(pageName, {
						data: assets,
						user: req.user,
						selectorDisplay: "show",
                        clientData:clientData,
						loggedIn: loginStatus,
						firslist: false,
						smessage: req.flash('signupMessage'),
						lmessage: req.flash('loginMessage'),
						footerDisplay: "hide",
						panMessage: "",
						footerData1: "Blog",
						footerData2: "FAQs",
						scheme: showAsset,
						paid: false,
						abcd: false,
						assetFromDb: false,
						showPage5: "hide",
						hideAll: "show"
					});
				}

			}], function (err, result) {

				if (err = 'ok')
					return;



			})


}

exports.goalInvest = (req, res) => {
  currentPage = req.session.activePage = '/GoalInvest'
  loginStatus = functions.checkLoginStatus(req)
  mobile = req.useragent['isMobile']
  if (mobile) {
    pageName = 'mobileMood'
  } else
		// pageName = "scheme";
		{
    pageName = 'mood'
  }
  if (req.session.bseStatus) {
    panMsg = req.session.bseStatus
  } else {
    panMsg = ''
  }

  async.waterfall([
    function (callback) {
			// get the assets from the db
      var assets
      var query = client.query('select to_json(row) as asset from (select * from categoryallocationmatrix) row', function (err, result) {
        if (err) {
          console.log('Cant get Aeets values')
        }
        assets = result.rows
        callback(null, assets)
      })
    }, function (assets, callback) {
      if (loginStatus) {
				// check for user payment status
				//
        var paid = false
        var query = client.query(' select * from usersubscriptions where userid=' + req.session.user.userid + ' and current_date <= planrenewaldate', function (err, result) {
          if (err) {
            console.log('Cant get portfolio details in goal selection')
          }
          //console.log('Lenght' + result.rows.length)
          if (result.rows.length > 0) {
            paid = true
            req.session.paid = true
            callback(null, paid, assets)
          } else {
            paid = false
            req.session.paid = false
            callback(null, paid, assets)
          }
        })
      } else {
				// render the get started page for get request
        //console.log('else not log in')
        res.render(pageName, {
          data: assets,
          user: req.user,
          selectorDisplay: 'show',
          loggedIn: loginStatus,
          firslist: false,
          smessage: req.flash('signupMessage'),
          lmessage: req.flash('loginMessage'),
          footerDisplay: 'hide',
          panMessage: '',
          footerData1: 'Blog',
          footerData2: 'FAQs',
          scheme: false,
          paid: false,
          abcd: false,
          assetFromDb: false,
          showPage5: 'hide',
          hideAll: 'show'
        })
				// callback(true);
        callback(true, 'ok')
      }
    },
    function (paid, assets, callback) {
     // console.log('payment' + paid)

      if (paid) {
        async.waterfall([function (callback) {
					// Fetch Header
					// store the data in a json
          var query = client.query('SELECT * FROM savedplansheader where userid=$1 ORDER BY created DESC LIMIT 1 ', [req.session.user.userid],
						function (err, result) {
  if (err) {
    console.log('Cant get assets values')
  }

 // console.log('details header' + result.rows.length)
  asetData = result.rows[0]
  if (result.rows.length > 0) {
    req.session.savedplanheader = asetData

   // console.log('saved plan header' + req.session.savedplanheader.sip)
    //console.log('saved plan header' + req.session.savedplanheader.goalid)
    //console.log('saved plan header' + req.session.savedplanheader.riskprofile)
    //console.log('saved plan header' + req.session.savedplanheader.masteramount)
    //console.log('saved plan header' + req.session.savedplanheader.totalyears)
    //console.log('saved plan header' + req.session.savedplanheader.userid)

    callback(null, asetData)
  } else {
    res.render(pageName, {
      data: assets,
      user: req.user,
      selectorDisplay: 'show',
      loggedIn: loginStatus,
      firslist: false,
      smessage: req.flash('signupMessage'),
      lmessage: req.flash('loginMessage'),
      footerDisplay: 'hide',
      panMessage: '',
      footerData1: 'Blog',
      footerData2: 'FAQs',
      scheme: false,
      paid: paid,
      abcd: false,
      assetFromDb: false,
      showPage5: 'hide',
      hideAll: 'show'
    })
  }
})
        },
          function (headerData, callback) {
					// console.log(headerData)

            var query = client.query('SELECT * FROM savedplansdetail where savedplanid=$1 and allocationtype=$2', [headerData.savedplanid, 'scheme'],
						function (err, result) {
  if (err) {
    console.log('Cant get assets values')
  }

  asetDataDetail = result.rows
 // console.log(asetDataDetail)
  req.session.savedplandetail = asetDataDetail

 // console.log('test' + req.session.bseStatus)

  res.render(pageName, {
    data: assets,
    user: req.user,
    schemeData: asetDataDetail,
    smessage: req.flash('signupMessage'),
    lmessage: req.flash('loginMessage'),
    selectorDisplay: 'show',
    loggedIn: loginStatus,
    footerDisplay: 'hide',
    footerData1: 'Blog',
    footerData2: 'FAQs',
    scheme: true,
    panMessage: panMsg,
    abcd: false,
    paid: true,
    assetFromDb: headerData,
    showPage5: 'show'
  })
							// callback(null,headerData,asetDataDetail)
})
          }], function (err, result) {

        })

				// console.log("ssds"+engineData);
				// set rendering values
				// callback(null,schemeData)
      } else {
        res.render(pageName, {
          data: assets,
          user: req.user,
          selectorDisplay: 'show',
          loggedIn: loginStatus,
          firslist: false,
          smessage: req.flash('signupMessage'),
          lmessage: req.flash('loginMessage'),
          footerDisplay: 'hide',
          panMessage: '',
          footerData1: 'Blog',
          footerData2: 'FAQs',
          scheme: false,
          paid: false,
          abcd: false,
          assetFromDb: false,
          showPage5: 'hide',
          hideAll: 'show'
        })
      }
    }], function (err, result) {
    if (err = 'ok') { return }
  })
}

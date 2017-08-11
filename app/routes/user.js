
const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;

var bcrypt = require('bcrypt-nodejs');
const express = require('express')
const router = express.Router()
const async = require('async')
const crypto = require('crypto')
var passport = require('passport')
const functions = require('./functions')
//DB connection
var client = require('../../config/database');

exports.getToCurrent = (req, res) => {
  console.log(req.session.activePage)
  res.redirect(req.session.activePage)
}

exports.postAdminLogin = (req, res) => {
  
  passport.authenticate('local-admin', {
    successRedirect: 'admin/index', // redirect to the secure profile section
    failureRedirect: '/admin', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
 	})(req, res)
}

exports.postSignup = (req, res) => {
  passport.authenticate('local-signup', {
	  successRedirect: '/saveAssetOffline', // redirect to the secure profile section
	  failureRedirect: '/tocurrent', // redirect back to the signup page if there is an error
	  failureFlash: true // allow flash messages
  })(req, res)
}

/*
* logout
*/

exports.getLogout = (req, res) => {
  req.session.destroy()
  req.logout()
  res.redirect('/')
}

exports.getAdminLogout = (req, res) => {
  req.session.destroy()
  req.logout()
  res.redirect('/admin')
}

/*
* login
*/

exports.postLogin = (req, res) => {
	 passport.authenticate('local-login', {
   successRedirect: '/saveAssetOffline', // redirect to the secure profile section
   failureRedirect: '/tocurrent', // redirect back to the signup page if there is an error
   failureFlash: true // allow flash messages
 })(req, res)
}

exports.postNewsletter =(req ,res) =>{
    email=req.body.email;
    var query = client.query("insert into newsletter(userid,email) values($1,$2)", [req.session.user.userid,email], function (err, result) {
		if (err){
            console.log("user subscribe news letter" + err);
            data = {
				    "subcribe": "Sorry,Currently unable to subscribing our news letter."
				}
                                    
            				var subJSON = JSON.stringify(data);
            res.send(subJSON);
        }
			
        
		else{ 
            console.log("news letter subscribe success");
                 data = {
				    "subcribe": "Thanks for subscribing our news letter."
				}
                                    
            				var subJSON = JSON.stringify(data);
            res.send(subJSON);
        }
    
});
}

/*
* reset password
*/

exports.getReset = (req, res) => {
    
     currentPage = req.session.activePage = "/reset/:token";

			

			mobile = req.useragent["isMobile"];
			if (mobile)
				pageName = "resetMobile";
			else
				pageName = "reset";
    
    
    var timestamp=Date.now(); 
    var tokenCompare=req.params.token;
   tokenCompare= tokenCompare.replace(/:/g, "");
    req.session.tokenIn=tokenCompare;
    console.log("Token",tokenCompare);
    console.log("Time now to comapre",timestamp)
     var query = client.query("select * from users where resetpasswordtoken=$1 and tokenexpires>$2",[tokenCompare,timestamp],function (err, result) {
   if(err){
       req.flash('error', 'Something went wrong. Please Try again later')
       console.log("Something went wrong. Please Try again later",err)
     res.render(pageName,{
         message:req.flash("error")
     })
   }
    
         
         
    if(result.rows.length==0) {
       console.log("Password reset token is invalid or has expired.")
      req.flash('error', 'Password reset token is invalid or has expired.')
      return res.render('pageName',{message:req.flash('error')})
    }
    if (result.rows.length>0){
       /* console.log("DATA",result.rows[0])*/
        console.log("Password reset token working.")
    res.render(pageName, {
      user: result.rows,
      message:false
    })
    }
  })
}


exports.postReset = (req, res, done) => {
      currentPage = req.session.activePage = "/reset/token";

			

			mobile = req.useragent["isMobile"];
			if (mobile)
				pageName = "resetMobile";
			else
				pageName = "reset";
    
    
    
    
    console.log("Session :",req.session.tokenIn);
    var tokenCompare=req.session.tokenIn;  
     console.log("Token",tokenCompare)
  async.waterfall([
    function (done) {
    var email=req.body.email;
    var password1=req.body.password;
    var password2=req.body.retypepassword;
    
 
 if(password1==password2){
         var timestamp=Date.now(); 
     
        var query = client.query("select * from users where resetpasswordtoken=$1 and tokenexpires>$2 and email=$3",[tokenCompare,timestamp,email],function (err, result) {
     /* User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {*/
         if(err){
                req.flash('error', 'Something went wrong. Please Try again later')
                console.log("Something went wrong. Please Try again later",err)
                return res.render(pageName,{message:req.flash("error")})
        }
        if(result.rows.length==0) {
                 console.log("Password reset token is invalid or has expired.")
                 req.flash('error', 'Password reset token is invalid or has expired.')
                 res.render(pageName,{message:req.flash("error")})
        }
        if (result.rows.length>0){
     
             
              var tokenempty='null';
              var tokenexpiresempty='null';
              
               let password=bcrypt.hashSync(password1, bcrypt.genSaltSync(8), null);
              console.log("Encrypted password",password);
               var query=client.query("update users set password=$1,tokenexpires=$2,resetpasswordtoken=$3 where email=$4",[password,tokenexpiresempty,tokenempty,email],function(err, result1) {
                    if(err)
                        console.log("update password to user",err);
                        
                    else{
                        
                         console.log("update password success");
                        req.flash('Password Changed', 'Password changed succesfully, Login with new password.')
                        res.render('reset',{message:req.flash("Password Changed")})       
                        var user=result.rows[0];
                         console.log("DATA",user)
                         console.log("DATA email",user.email)
                         done(err, user)
                      
                        
                    }
               
                   
            
             
            });
              
   }
        });
        }
        else{
            req.flash('Passwords not matched', 'Password and Confirm Password not matched.')
            res.render(pageName,{message:req.flash("Passwords not matched")})
            var user=false;
             done(user)
            
        }
       
       /* user.save(function (err) {
          req.logIn(user, function (err) {
            done(err, user)
          })
        })*/
      },function (user, done) {
          
          if(user){
           var nodemailer = require('nodemailer')
          console.log("Email :",user.email)     
          var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'nishant143n@gmail.com',
          pass: 'nishant2892'
        }
      }

      var transporter = nodemailer.createTransport(smtpConfig)

      var mailOptions = {
        from: 'nishant143n@gmail.com',
        to: user.email,
        subject: 'Your Investory login password has been changed.',
        html: 'This is a confirmation that the password for your Investory account ' + user.email + ' has just been changed.\n'
      }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error)
        }
     
        //req.flash("success","Password reset is successful")
          
    });
    }else{
        console.log("email not sent");
    }
          
      }
  ], function (err) {
    res.render(pageName,{message:req.flash("success")})
      console.log('end of token route')
  })
  
}

/*
* forgot password
*/
exports.getForgotform =(req,res) =>{
        currentPage = req.session.activePage = "/forgot";

			loginStatus = functions.checkLoginStatus(req);

			mobile = req.useragent["isMobile"];
			if (mobile)
				pageName = "forgotMobile";
			else
				pageName = "forgot";

    
            console.log("page name",pageName)
            res.render(pageName, {
				user: req.user,
				selectorDisplay: "show",
				message: false,
				loggedIn: loginStatus,
				footerDisplay: "show",
				footerData1: "Blog",
				footerData2: "FAQs"


			});
}

exports.postForgot = (req, res, next) => {
  
    currentPage = req.session.activePage = "/forgot";

			loginStatus = functions.checkLoginStatus(req);

			mobile = req.useragent["isMobile"];
			if (mobile)
				pageName = "forgotMobile";
			else
				pageName = "forgot";
    async.waterfall([
     
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex')
        
        console.log("TOKEN",token)
        done(err, token)
      })
    },
    function (token, done) {
        var email=req.body.email;
          var query = client.query("select * from users where email=$1",[email], function (err, result) {

//      User.findOne({ 'user.local.email': req.body.email }, function (err, user) {
        if(err){
            console.log("Error in finding email",err);
        }      
        else if (result.rows.length==0) {
          req.flash('error', 'No account with that email address exists.')
          
          return res.render(pageName,{message:req.flash("error")
                                      })
        }
        
         
      else if(result.rows.length>0){
				// console.log(user.local.email);
       var newUser={};

         newUser.resetPasswordToken = token
        newUser.resetPasswordExpires = Date.now() + 3600000 // 1 hour

              
              console.log("Token and time and userid",newUser.resetPasswordToken,newUser.resetPasswordExpires,email)
               var query=client.query("update users set resetpasswordtoken=$1,tokenexpires=$2 where email=$3",[newUser.resetPasswordToken,newUser.resetPasswordExpires,email],function(err, result) {
                    if(err)
                        console.log("update tokens to user",err);
                        
                    else{
                        
                         console.log("update tokens success");
                       
                    }
      })
               
               
               
                        done(err, token, newUser)
               }
         });          
    },
    function (token, user, done) {
      var nodemailer = require('nodemailer')

      var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'nishant143n@gmail.com',
          pass: 'nishant2892'
        }
      }

      var transporter = nodemailer.createTransport(smtpConfig)

      var mailOptions = {
        from: 'nishant143n@gmail.com',
        to: req.body.email,
        subject: 'Investory Password Reset',
        html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' + req.headers.host + '/reset/:' + token + '\n\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error)
        }
           
 console.log('Message sent: ' + info.response)
         
      })
        
      req.flash('Email sent', 'An email sent to '+req.body.email+' with further instructions.')
                      res.render(pageName,{message:req.flash("Email sent")
                                      })  
      
    }
  ], function (err) {
    if (err) return next(err)

   else {
         
        
        }
  })
}

/*
* user Data
*/
exports.getUserData = (req, res) => {
  console.log(req.session)
  loginStatus = functions.checkLoginStatus(req)
  console.log(functions.checkLoginStatus(req))
  res.setHeader('Content-Type', 'application/json')
  res.send(req.session)
}

/*
* social login
*/

exports.getFacebookLogin = (req, res) => { passport.authenticate('facebook', { scope: ['email'] })(req, res) }

exports.getFacebookCallback = (req, res) => {
//    console.log("Hi in fb---");
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/',
    scope: ['email']
  })(req, res)
}
/*
exports.getAuthGoogle = (req, res) =>	{
  passport.authenticate('google', { scope: ['profile', 'email'] })
  passport.get('/auth/google/callback',
	passport.authenticate('google', {
  successRedirect: '/tocurrent',
  failureRedirect: '/'
}))(req, res)
}*/


exports.getAuthGoogleLogin = (req, res) =>	{ passport.authenticate('google', { scope: ['profile', 'email'] })(req, res)  }
  
exports.getAuthGoogleCallback = (req, res) => {
 
	passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/'
})(req, res)
}

// module.exports = router;


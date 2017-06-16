var express = require('express');
var router = express.Router();
var async = require('async');
var path=require('path');
var pg = require('pg');
var conString = process.env.DATABASE_URL ||  "postgres://postgres:postgres@localhost:5432/investory";
//var conString = process.env.DATABASE_URL ||  "postgres://postgres:123@localhost:5432/investory";
/*var conString = {
  user: 'user1', //env var: PGUSER
  database: 'investory', //env var: PGDATABASE
  password: '12345', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: -1, // max number of clients in the pool
  idleTimeoutMillis: 5000, // how long a client is allowed to remain idle before being closed
};*/


var client = new pg.Client(conString);
client.connect();
var dbOperations = require("../dbOperations.js");

var multer  =   require('multer');

var fs = require('node-fs');



var storage =   multer.diskStorage({    
destination: function (req, file, callback) 
{
    if(pan)
      {
        var name = '/home/ubuntu/panuploads/'+pan; //location for directory to store documents 
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
          callback(null, name);
        });
      }
},
filename : function (req, file, callback) 
{
   if(file.originalname=='address_proof'+ path.extname(file.originalname))
   {
     console.log("addressproof");
     var val1='addressproof';
     var val2="uploaded";
     updatedoc(id,val1,val2);
     callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
    } 
    if(file.originalname=='id_proof'+ path.extname(file.originalname))
    {
      console.log("idproof");
      var val1="idproof";
      var val2="uploaded"
      updatedoc(id,val1,val2);   
      callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
     }
    if(file.originalname=='signature_proof'+ path.extname(file.originalname))
    {
      console.log("signatureproof");
      var val1="signatureproof";
      var val2="uploaded"
      updatedoc(id,val1,val2);     
      callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
       }
  if(file.originalname=='kyc_video'+ path.extname(file.originalname))
    {
      console.log("kycvideo");    
      var val1="kycvideo";
      var val2="uploaded"
      updatedoc(id,val1,val2);
      callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
     } 
    if(file.originalname=='bse_application'+ path.extname(file.originalname))
    {
      console.log("bseapplication");    
      var val1="bsestarapplication";
      var val2="uploaded"
      updatedoc(id,val1,val2);
      callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
     }
    
     if(file.originalname=='statutory_form'+ path.extname(file.originalname))
    {
      console.log("statutory_form");    
      var val1="statutoryform";
      var val2="uploaded"
      updatedoc(id,val1,val2);
      callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
     } 
      if(file.originalname=='nach_form'+ path.extname(file.originalname))
    {
      console.log("nach_form");    
      var val1="nachform";
      var val2="uploaded"
      updatedoc(id,val1,val2);
      callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
     } 
  }
});
//upload documents function
var upload = multer({ storage : storage}).array('doc',7);


//upload csv
//kyc documents upload router
router.post('/api/doc',function(req,res)
{   
   //console.log("pan ",+pan); 
   upload(req,res,function(err) 
   {
     if(err) 
       {
          console.log(err);
          console.log("Error uploading file.");
        }
      console.log("File is uploaded");
    });
   res.render("Admin/tables");
});
/* GET home page. */
router.get('/', function(req, res, next)
{
    res.render('Admin/login', { title: 'Express' });
});
router.get('/login', function(req, res, next)
{
    res.render('Admin/login', { title: 'Express' });
});

// dispalys user details kyc pending from user and pan_details tables
router.get('/tables',function(req,res,next)
{    
    console.log("Hi..");
   res.render("Admin/tables");
});
router.get('/index',function(req,res,next)
{    
    
   res.render("Admin/index",{
       users : req.user
   });
});


//gets kyc pending records 
router.get('/tables/get',function(req,res)
{
     
console.log("kyc");
  dbOperations.getRecords(req,res);      
    
});

//updates the kyc status as selected and saves changes
router.get('/saveChanges',function(req,res,next)
{
    
              dbOperations.updateRecord(req,res);
             
            res.redirect('Admin/tables');
    
});

//get id of row and makes it as global to all routers
var pan,id;
router.get('/saveId',function(req,res,next)
{
    console.log("pan ",+req.query.pan);
    pan=req.query.pan;
    id=req.query.id;
    console.log("id ",+req.query.id);
});


/*
router.get('/tables/changeStatus',function(req,res,next)
{
    dbOperations.insertinto();
              
           res.redirect('/tables');
    
});*/

//reconcile page to render page 
router.get('/reconcile',function(req,res){
   
    res.render("Admin/reconcile");
});

//get reconcile records 
router.get('/reconcile/get',function(req,res)
{
    dbOperations.insertinto();
    console.log("reconcile");
    dbOperations.getReconcileRecords(req,res);
    
   
});
router.get('/failedorders',function(req,res)
{
    
     res.render("Admin/failedOrders");
   
});
router.get('/failedorders/get',function(req,res)
{
    
    console.log("failedorders");
    dbOperations.failedOrders(req,res);
    
   
});

//update nav,txnreference,units into userinvestmentorders table from dumplog
router.get('/getDumpUpdates',function(req,res)
{
    var ids=req.query.id;
    dbOperations.getReconciledDumpUpdates(req,res,ids);
    res.redirect("Admin/reconcile"); 
});


//sets status as in userinvestmentorders table
router.get('/setReconcileAsStatus',function(req,res)
{
    console.log("Hi update reconcile");
    var ids=req.query.id;
    dbOperations.updateStatusAsReconcile(req,res,ids);
    res.redirect("Admin/reconcile"); 
});


router.get('/blank-page',function(req,res,next)
{
    res.render('Admin/blank-page');
});

router.get('/bootstrap-grid',function(req,res,next)
{
    res.render('Admin/bootstrap-grid');
});

router.get('/reports',function(req,res,next)
{
    res.render('Admin/reports');
});

router.get('/index-rtl',function(req,res,next)
{
    res.render('Admin/index-rtl');
});

router.get('/uploadcsv',function(req,res,next)
{
res.render('Admin/uploadcsv');
});

router.get('/assetsUpload',function(req,res,next)
{
    
    var query = client.query(" select * from categoryallocationmatrix order by riskprofile", function (err, result) {
						if (err)
							console.log("Cant get portfolio details in goal selection");
						if (result.rows.length > 0) {
                            var assetsdata=result.rows;
                            console.log("assetsDat...!",assetsdata);
                         res.render('Admin/assetsUpload',{assetsData:assetsdata});
                        }
    });
});

router.post('/assetsValueUpdate',function(req,res,next)
{
   var riskprofile=req.body.riskprofileval;
    var category=req.body.categoryval;
    var value=req.body.valueval;
    var val=parseInt(value);
   
    var query = client.query(" update categoryallocationmatrix set value=$3  where riskprofile=$1 and category=$2",[riskprofile,category,value], function (err, result) {
						if (err)
							console.log("Cant get portfolio details in goal selection");
						else {
                       alert("Updated Asset value.")     
                    res.redirect("/admin/assetsUpload")        
                    
                        }
    });
});

router.get('/funds',function(req,res)
{    
    console.log("Hi..");
  
   res.render("Admin/uploadSchemes");
   });


//Assets able
router.get('/allocation',function(req,res,next)
{    
    console.log("Hi..");
   var assets;
   var query = client.query("select to_json(row) as asset from (select * from categoryallocationmatrix) row", function (err, result) {
     if (err)
	    console.log("Cant get Aeets values");

    	assets = result.rows;
   res.render("Admin/allocation",{data:assets});
   });
});

router.get('/uploadInvestory',function(req,res,next)
{    
    console.log("Hi..");
  
   res.render("Admin/uploadInvestory");
   
});


router.post('/sch',function(req,res)
{    
      var schemecamntde=0,schemecamnteq=0,schemecamnthy=0;
  var schememamntde=0,schememamnteq=0,schememamnthy=0;
  var schemeagamnthy=0,schemeagamnteq=0,schemeagamnteq=0;
    
var amtce1=req.body.amtc1;
    var amtch2=req.body.amtc2;
    var amtcd3=req.body.amtc3;

    var amtme1=req.body.amtm1;
    var amtmh2=req.body.amtm2;
    var amtmd3=req.body.amtm3;

        var amtae1=req.body.amta1;
    var amtah2=req.body.amta2;
    var amtad3=req.body.amta3;
    var AmountM1=req.body.AmountM1

                 var time=req.body.time;
                    console.log(req.body.time);
                var sip = req.body.invest;
    console.log("sip",req.body.invest);


var query = client.query("select * from schemesmaster where $1 between sipfrom and sipto and $2 between yearfrom and yearto",[sip, time],function (err, result) {
     //console.log("schemes",docs); 
    
	if (err)
	console.log("Cant get assets values");
    
  else{
    

  var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;


  var schemecamntde=0,schemecamnteq=0,schemecamnteq1=0,schemecamnteq2=0,schemecamnthy=0;

      docs=result.rows;
  
 for (i = 0; i < docs.length; i++) {
//Conservative
       if((docs[i].riskprofile)=="Conservative"){

    if((docs[i].category)=="Equity"){
    j=j+1;

      }
      if((docs[i].category)=="Hybrid"){
  k=k+1;
  }
  if((docs[i].category)=="Debt"){
    l=l+1;
  }

  }
  //Moderate
      if((docs[i].riskprofile)=="Moderate"){
      if((docs[i].category)=="Equity"){
      m=m+1;
        }
        if((docs[i].category)=="Hybrid"){
    n=n+1;
    }
    if((docs[i].category)=="Debt"){
      o=o+1;
    }
    }
//Aggressive
    if((docs[i].riskprofile)=="Aggressive"){
    if((docs[i].category)=="Equity"){
    p=p+1;
      }
      if((docs[i].category)=="Hybrid"){
  q=q+1;
  }
  if((docs[i].category)=="Debt"){
    r=r+1;
  }
  }
}

for (i = 0; i < docs.length; i++) {
  if((docs[i].riskprofile)=="Conservative"){

if(j==0 || j==1){
    schemecamnteq=amtce1;
}
else{
      schemecamnteq=amtce1/2;
     }
  if(k==0 || k==1){
   schemecamnthy=amtch2;
  }
  else{
    schemecamnthy=amtch2/2;
    }
    if(l==0 || l==1){
          schemecamntde=amtcd3;
      }else{
        schemecamntde=amtcd3/2;
    }
        }


 if((docs[i].riskprofile)=="Moderate"){
 if(m==0 || m==1){
schememamnteq=amtme1;

}
else{
schememamnteq=amtme1/m;

}
if(n==0 || n==1){

  schememamnthy=amtmh2;

}
else{
schememamnthy=amtmh2/n;

}
if(o==0 || o==1){
      schememamntde=amtmd3;
  }else{
schememamntde=amtmd3/o;

}
    }


if((docs[i].riskprofile)=="Aggressive"){

  if(p==0 || p==1){
                schemeagamnteq=amtae1;

                }

                 else{
                   schemeagamnteq=amtae1/p;
                  }
    if(q==0 || q==1){
                    schemeagamnthy=amtah2;
                  }
                  else{
                 schemeagamnthy=amtah2/q;
               }
        if(r==0 || r==1){

                        schemeagamntde=amtad3;
                    }else{
                  schemeagamntde=amtad3/r;
                  
                  }

                      }



}
    console.log(schemecamnteq,schemecamnthy,schemecamntde);

    res.render('Admin/schemes', {
                firslist :  docs,
        amtce1:schemecamnteq,
        amtch2:schemecamnthy,
        amtcd3:schemecamntde,
         amtme3:schememamnteq,
        amtmh2:schememamnthy,
        amtmd3:schememamntde,
        amtae1:schemeagamnteq,
        amtah2:schemeagamnthy,
        amtad3:schemeagamntde,
        sip:sip
            });
 }

});
    
    
   });



//upload files to dumplog
var store =   multer.diskStorage({    
                destination: function (req, file, callback) 
                    {

        				callback(null,'/home/ubuntu/dbfiles');
                       // callback(null, 'C:/Users/Nishant/Desktop/dbfiles');
                       // callback(null,'E:/dbfiles');
      
                     },
                 filename : function (req, file, callback) 
                    {
                        
                        callback(null, file.originalname/*feildname originalname+ '-' + Date.now()*/);
                    }

                    });
                var uploaddb = multer({ storage : store}).single('doc');

            
router.post('/uploadInvestoryFile',function(req,res,next)
{
    console.log("upload csv to Db");
    var tbl="investoryupload";
     var file_name;
    async.waterfall([
      function(callback)
        {
            uploaddb(req,res,function(err) 
                {
                    if(err) 
                    {
                     console.log(err);
                     console.log("Error uploading file.");
                    }
                  console.log("File is uploaded");
                
                    file_name=req.file.originalname;

                   console.log("in upload ",file_name);
               //  var paths="E:/dbfiles/"+file_name;
                //var paths="C:/Users/Nishant/Desktop/dbfiles/"+file_name;
				 var paths="/home/ubuntu/dbfiles/"+file_name;
                callback(null,paths)
                });
            
            
        },
       function(paths,callback)
         {
             updateuploaddumplog(tbl,paths);
             updatedumplogfrominvestoryupload();
            callback(null)
             
             
         }
        ], function (err, result) 
          {
            if (err)
              {
                console.log(err);   
              }
        res.render('Admin/uploadInvestory');
      });   
});

router.post('/uploadcamsfile',function(req,res,next)
{
    console.log("upload csv to Db");
    var tbl="camstrxnlog";
     var file_name;
    async.waterfall([
      function(callback)
        {
            uploaddb(req,res,function(err) 
                {
                    if(err) 
                    {
                     console.log(err);
                     console.log("Error uploading file.");
                    }
                  console.log("File is uploaded");
                
                    file_name=req.file.originalname;

                   console.log("in upload ",file_name);
                
                //var paths="../dbfiles/"+file_name;
				 var paths="/home/ubuntu/dbfiles/"+file_name;
                callback(null,paths)
                });
            
            
        },
       function(paths,callback)
         {
             updateuploaddumplog(tbl,paths);
             updatedumplogfromcams();
            callback(null)
             
             
         }
        ], function (err, result) 
          {
            if (err)
              {
                console.log(err);   
              }
        res.render('Admin/uploadcsv');
      });   
});

router.post('/uploadkarvysfile',function(req,res,next)
{
    console.log("upload csv to Db karvys");
    var tbl="karvystrxnlog";
     var file_name;
    async.waterfall([
      function(callback)
        {
            uploaddb(req,res,function(err) 
                {
                    if(err) 
                    {
                     console.log(err);
                     console.log("Error uploading file.");
                    }
                  console.log("File is uploaded");
                
                    file_name=req.file.originalname;

                   console.log("in upload ",file_name);
                var paths="/home/ubuntu/dbfiles/"+file_name;
              //  var paths="../dbfiles/"+file_name;
                callback(null,paths)
                });
            
            
        },
       function(paths,callback)
         {
          updateuploaddumplog(tbl,paths); 
           updatedumplogfromkarvy();
             callback(null)
             
             
         }
        ], function (err, result) 
          {
            if (err)
              {
                console.log(err);   
              }
        res.render('Admin/uploadcsv');
      });   
});

router.post('/uploadftfile',function(req,res,next)
{
    console.log("upload csv to Db karvys");
    var tbl="fttrxnlog";
     var file_name;
    async.waterfall([
      function(callback)
        {
            uploaddb(req,res,function(err) 
                {
                    if(err) 
                    {
                     console.log(err);
                     console.log("Error uploading file.");
                    }
                  console.log("File is uploaded");
                
                    file_name=req.file.originalname;

                   console.log("in upload ",file_name);
                var paths="/home/ubuntu/dbfiles/"+file_name;
               // var paths="../dbfiles/"+file_name;
                callback(null,paths)
                });
            
            
        },
       function(paths,callback)
         {
           updateuploaddumplog(tbl,paths); 
            updatedumplogfromft();
             callback(null)
             
             
         }
        ], function (err, result) 
          {
            if (err)
              {
                console.log(err);   
              }
        res.render('Admin/uploadcsv');
      });   
});


//Upload file assets
router.post('/updateSchemes',function(req,res,next)
{
    console.log("upload Schemes");
    var tbl="schemesmaster";
     var file_name;
    async.waterfall([
      function(callback)
        {
            uploaddb(req,res,function(err) 
                {
                    if(err) 
                    {
                     console.log(err);
                     console.log("Error uploading file.");
                    }
                  console.log("File is uploaded");
                
                    file_name=req.file.originalname;

                   console.log("in upload ",file_name);
                
               // var paths="C:/Users/Nishant/Desktop/dbfiles/"+file_name;
               
				 var paths="/home/ubuntu/dbfiles/"+file_name;
                callback(null,paths)
                });
            
            
        },
       function(paths,callback)
         {
             updateAssetsValues(tbl,paths);
            callback(null)
             
             
         }
        ], function (err, result) 
          {
            if (err)
              {
                console.log(err);   
              }
        res.render('Admin/uploadSchemes');
      });   
});

router.get('/createuser',function(req,res){
    
    res.render('Admin/createUser',{
        message:req.flash()
    });
});


router.post('/createusr',function(req,res){
    var name=req.body.uname;
    var password= req.body.upassword;
     var cpassword= req.body.cpassword;
    var roletype=req.body.roletype;
     let date=new Date();
    
    if(password==cpassword){
            var query = client.query("insert into adminusers(uname,password,role,modified,created) values($1,$2,$3,$4,$5)", [name,password,roletype,date,date], function (err, result) {
						if (err)
							console.log("error",err);
						else {
                            console.log("user created");
                        }
                });
        req.flash('SuccessMessage', 'Success user created ');
            res.render('Admin/createUser',{
                      message:req.flash('SuccessMessage')
                });
        }
    else{
       req.flash('NotMatched','Passwords not matched');
         res.render('Admin/createUser',{
                      message:req.flash('NotMatched')
                });
        }
});
//rows insert from Uploaded file  
function updateAssetsValues(tbl,path){
    
    pg.connect(conString,function(err,client,done)
    {      
        if(err)
         {
              return console.error('Could not connect to postgres' , err);
         }
        
      
        
         var qury="'"+path+"'";
        console.log(qury);
      
       var query = client.query("COPY "+tbl+" FROM " +qury+" DELIMITER ',' CSV HEADER",function(err, result)
            {
                if (err) 
                  
                    console.log("error",err)
                else
                {
                  
                    console.log("insert to "+tbl+" table Success...!");
        
                }
            });
        done();
     });
    
}
router.get('/schemelist',function(req,res){
     var query = client.query(" select * from schemesmaster", function (err, result) {
						if (err)
							console.log("Cant get portfolio details in goal selection");
						if (result.rows.length > 0) {
                            var schemesData=result.rows;
                            console.log("assetsDat...!",schemesData);
                        
                            res.render('Admin/schemesList',{schemesData});
                        }
    });
    
});

router.get('/Manage_users',function(req,res){
        
    var query = client.query(" select * from adminusers", function (err, result) {
						if (err)
							console.log("Cant get portfolio details in goal selection");
						if (result.rows.length > 0) {
                            var usersData=result.rows;
                            console.log("assetsDat...!",usersData);
                            
                            res.render('Admin/ManageUsers',{usersData});
                        }
                        else{
                            var usersData=0;
                            res.render('Admin/ManageUsers',{usersData});
                        }
    });
});



 router.get('/Manage/:id',function(req,res){   
    var id = req.params.id;
      
       console.log("id",id);
     
     var query = client.query('SELECT * FROM adminusers WHERE adminuserid = $1',[id],function(err,result)
                            {
                                if(err)
                                    console.log("Error Selecting : %s ",err );
            
                               
                           if (result.rows.length > 0) {
                            var data=result.rows;
                            console.log("assetsDat...!",data);
                            res.render('Admin/editUsers',{data});
       
                           }
     });
        
});

router.post('/Managedelete',function(req,res){   
    var id = req.body.id;
     console.log("id",id);
     
     var query = client.query('delete from adminusers WHERE adminuserid = $1',[id],function(err,result)
                            {
                                if(err)
                                    console.log("Error Selecting : %s ",err );
            
                               
                           else {
                            
                            console.log("delete success...!");
                           res.send({redirect: '/admin/Manage_Users'});
       
                           }
     });
        
   
});


    
     router.post('/Userupdate',function(req,res){ 
        
         console.log("update");
    var id = req.body.uid;
    var password=req.body.password;
    var role=req.body.roletype;
         
     console.log("id",id,password,role);
     
     var query = client.query('update adminusers set role=$2 , password=$3  WHERE adminuserid=$1',[id,role,password],function(err,result)
                            {
                                if(err)
                                    console.log("Error Selecting : %s ",err );
            
                               
                                else{
                                    console.log("Update success");
                                    res.redirect("/admin/Manage_Users")
                                }
                             
                           }
     );
        
   
});
//rows insert from Uploaded file  

function updateuploaddumplog(tbl,path){
    
    pg.connect(conString,function(err,client,done)
    {      
        if(err)
         {
              return console.error('Could not connect to postgres' , err);
         }
         
         var qury="'"+path+"'";
        console.log(qury);
        
       var query = client.query("COPY "+tbl+" FROM " +qury+" DELIMITER ',' CSV HEADER",function(err, result)
            {
                if (err) 
        
                    console.log("error",err)
                else
                {
                    
                    console.log("insert to "+tbl+" table Success...!");
        
                }
            });
        done();
     });
    
}

//Insert rows to dumplog from camstrxnlog table
function updatedumplogfromcams()
{
    
    console.log("dumplog update");
    pg.connect(conString,function(err,client,done){
        if(err){
            return console.log("Could not connect to postgres",err);
        }
        var query=client.query("INSERT INTO dumplog(foliono,pan,scheme,amount,transaction_type,transaction_id,transaction_ref,transaction_status,remarks,nav,nav_date,units,usrtrxno,trade_date,post_date,trxn_nature,scheme_type,scanref_no,seq_no) SELECT folio_no,pan,SCHEME,AMOUNT,TRXN_TYPE_,TRXNNO,TRXNNO,TRXNSTAT,REMARKS,PURPRICE,REP_DATE,UNITS,USRTRXNO,TRADDATE,POSTDATE,TRXN_NATUR,SCHEME_TYPE,SCANREFNO,SEQ_NO from camstrxnlog",function(err,result){
            
            if(err)
                console.log("Cant insert to dumplog from camstrxnlog",err);
            else
                console.log("Dumplog Insert success..!");
            
        });
        done();
    });
}
function updatedumplogfrominvestoryupload()
{
    
    console.log("dumplog update");
    pg.connect(conString,function(err,client,done){
        if(err){
            return console.log("Could not connect to postgres",err);
        }
        var query=client.query("INSERT INTO dumplog(foliono,pan,schemecode,amount,transaction_type,transaction_id,transaction_ref,transaction_status,remarks,nav,units,transaction_date,orderid) SELECT foliono,pan,schemecode,amount,transaction_type,transaction_ref,transaction_ref,transaction_status,remarks,nav,units,transaction_date,order_id from investoryupload",function(err,result){
            
            if(err)
                console.log("Cant insert to dumplog from camstrxnlog",err);
            else
                console.log("Dumplog from investory Insert success..!");
            
        });
        done();
    });
}

//Insert rows to dumplog from karvystrxnlog table
function updatedumplogfromkarvy()
{
    
    console.log("dumplog update");
  //  client.connect();
    pg.connect(conString,function(err,client,done){
        if(err){
            return console.log("Could not connect to postgres",err);
        }
        var query=client.query("INSERT INTO dumplog(pan,scheme,schemecode,amount,transaction_type,transaction_id,transaction_ref,transaction_status,transaction_mode,transaction_head,transaction_date,remarks,nav,units,nav_date,trade_date,newunqno,rejtrnoorgno,invester_status,trflag) SELECT pan1,fund_dscp,scheme_code,AMOUNT,trxn_type,trxnid,trxnno,trxnstatus,trxnmode,trxn_head,trxn_date,Remarks,nav,units,nav_date,purchase_date,newunqno,rejtrnoorgno,status,trxn_flag from karvystrxnlog",function(err,result){
            
            if(err)
                console.log("Cant insert to dumplog from karvytrxnlog",err);
            else
                console.log("Dumplog Insert success..!");
            
        });
        done();
    });
   // client.end();
}
//Insert rows to dumplog from fttrxnlog table
function updatedumplogfromft()
{
    
    console.log("dumplog update");
  //  client.connect();
    pg.connect(conString,function(err,client,done){
        if(err){
            return console.log("Could not connect to postgres",err);
        }
        var query=client.query("INSERT INTO dumplog(foliono,scheme,schemecode,amount,transaction_type,transaction_id,transaction_ref,transaction_status,transaction_mode,transaction_date,remarks,nav,units,trade_date,post_date,kyc_id,pan) SELECT folio_no,SCHEME_NA,SCHEME_CO0,AMOUNT,TRXN_TYPE,TRXN_ID,TRXN_NO,TRXN_STAT,TRXN_MODE,TRXN_DATE,remarks,NAV,UNITS,CREA_DATE,POSTDT_DA3,KYC_ID,it_pan_no1 from fttrxnlog",function(err,result){
            
            if(err)
                console.log("Cant insert to dumplog from fttrxnlog",err);
            else
                console.log("Dumplog Insert success..!");
            
        });
        done();
    });
   // client.end();
}


router.get('/forms',function(req,res,next)
{
    res.render('Admin/forms');
});
    

// function joins the two tables tbl1, tbl2 on user_id returns joined result

function getAllRecordsJoin(tbl,tbl2, callback)
{ 
    var pg = require('pg');
   // client.connect();
    
    pg.connect(conString,function(err,client,done)
    {      
        if(err)
         {
              return console.error('Could not connect to postgres' , err);
         }
       
       var query = client.query("SELECT * FROM "+tbl+" INNER JOIN "+tbl2+" ON "+tbl+".user_id="+tbl2+".user_id", function(err, result)
            {
                if (err) 
                    callback(err,null); 
                else
                {
                    callback(null,result.rows);
        
                }
            });
        done();
     });
    
     //client.end();
}
function updatedoc(id,val1,val2)
{ 
  //  var pg = require('pg');
  //  client.connect();
    pg.connect(conString,function(err,client,done)
    {      
        
        console.log(id);
        if(err)
         {
              return console.error('Could not connect to postgres' , err);
         }
       var query = client.query("update pandetails set "+val1+"=$2 where userid=$1",[id,val2],function(err, result)
            {
                if (err) 
                   console.log("doc update error "+err);
                else
                {
                    console.log("doc update sucess");
        
                }
            });
        done();
     });
    
    //client.end();
}



module.exports = router;
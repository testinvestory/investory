var pg = require('pg');
var conString = process.env.DATABASE_URL ||  "postgres://postgres:123@localhost:5432/investory";
//const conString = "postgres://postgres:postgres@localhost:5432/investory";
var client = new pg.Client(conString)
client.connect(function(err){
     if (err){ 
        console.log("Database connection error",err);
     }
});

module.exports = client;
const mysql = require("mysql");
const express = require("express");

const app = express();

const con = mysql.createConnection({
    host : "local",
    user : "root",
    password : "passwordfor128",
    database : "loginDB"
});

// connect to the database
con.connect(function(err){
    if (err) throw err;
    console.log("Connected to the database successfully!")
})


app.get("/", function(req, res){
    res.sendFile(__dirname + "../../public/html/login.html")
})


//set app port
app.listen(4500);

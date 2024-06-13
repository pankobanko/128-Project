var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password"

});

con.connect(function (err){
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE DATABASE loginDB";
    con.query(sql, function(err, result){
        if (err) throw err;
        console.log("Database Created!");
    });

});
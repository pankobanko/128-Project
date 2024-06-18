const mysql = require('mysql');


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
});


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");

    var sql = "CREATE DATABASE loginDB";
    con.query(sql, function(err, result){
        if (err) throw err;
        console.log("Database Created!");
    });

    const sql = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstname VARCHAR(50) NOT NULL,
        lastname VARCHAR(50) NOT NULL
    )`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table 'users' created or already exists!");
        con.end();
    });
});
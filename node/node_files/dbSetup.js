const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");

    con.query("CREATE DATABASE IF NOT EXISTS loginDB", function(err, result){
        if (err) throw err;
        console.log("Database Created!");

        con.changeUser({ database: "loginDB" }, function (err) {
            if (err) throw err;
            console.log("Connected to loginDB.");

            const createTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                firstname VARCHAR(50),
                lastname VARCHAR(50)
            )`;

            con.query(createTable, function (err, result) {
                if (err) throw err;
                console.log("Users already exists.");
                con.end();
            });
        });
    });
});

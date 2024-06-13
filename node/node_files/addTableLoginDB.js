var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "loginDB"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    var sql = `
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstname VARCHAR(50),
        lastname VARCHAR(50)
    );`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table Created!");
    });
});

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

            const createTableUsers = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                firstname VARCHAR(50),
                lastname VARCHAR(50)
            )`;

            con.query(createTableUsers, function (err, result) {
                if (err) throw err;
                console.log("Users table created.");

                const createTableRecipes = `
                CREATE TABLE IF NOT EXISTS recipes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255),
                    description VARCHAR(5000),
                    category VARCHAR(255),
                    duration VARCHAR(255),
                    ing VARCHAR(5000),
                    inst VARCHAR(5000),
                    image VARCHAR(255)
                )`;

                con.query(createTableRecipes, function (err, result) {
                    if (err) throw err;
                    console.log("Recipes table created.");
                    con.end();
                });
            });
        });
    });
});

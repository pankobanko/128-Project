const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "passwordfor128",
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");

    con.query("CREATE DATABASE IF NOT EXISTS recipeDB", function(err, result){
        if (err) throw err;
        console.log("Database Created!");

        con.changeUser({ database: "recipeDB" }, function (err) {
            if (err) throw err;
            console.log("Connected to recipeDB.");

            const createTable = `
            CREATE TABLE IF NOT EXISTS recipes (
                id int PRIMARY KEY auto_increment;
                name varchar(255),
                description varchar(5000),
                numIngredients int,
                count varchar(50)
            )`;

            con.query(createTable, function (err, result) {
                if (err) throw err;
                console.log("Users already exists.");
                con.end();
            });
        });
    });
});
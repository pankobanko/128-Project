const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const encoder = bodyParser.urlencoded();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "passwordfor128",
    database: "loginDB"
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected to DB");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/login.html'));
});

app.post("/login", function(req, res){
    var username = res.body.username;
    var password = res.body.password;
    const login = `SELECT * FROM users WHERE username = ? and password = ?`;
    con.query(login, [username, password], function(err, results, fields){
        if (results.length > 0) {
            res.redirect("/");
        } else {
            res.redirect("/login")
        }
        res.end();
    })
})

app.post('/register', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    const register = `INSERT INTO users (username, email, password, firstname, lastname) VALUES (?, ?, ?, ?, ?)`;
    con.query(register, [username, email, password, firstname, lastname], (err, result) => {
        if (err) throw err;

        console.log("Registration complete!");
        res.sendFile(path.join(__dirname, '../../public/html/admin_home.html'));
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`It be running! ===> ${PORT}`);
});

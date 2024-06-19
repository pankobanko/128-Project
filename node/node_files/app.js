const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const encoder = bodyParser.urlencoded();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));

app.use(session({
    secret: 'verybigsecret',
    resave: false,
    saveUninitialized: true,
}));

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

app.get('/admin_home', (req, res) => {
    if (req.session.loggedin){
        res.sendFile(path.join(__dirname, '../../public/html/admin_home.html'));
    } else {
        res.redirect('/login')
    }
});

app.post("/login", function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    const login = `SELECT * FROM users WHERE username = ? and password = ?`;
    con.query(login, [username, password], function(err, results, fields){
        if (results.length > 0) {
            req.session.loggedin = true; // Set session loggedin to true
            req.session.username = username; // Store username in session
            console.log('Login successful:', req.session); // Log session data
            res.redirect("/admin_home");
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
        req.session.loggedin = true; // Set session loggedin to true
        req.session.username = username; // Store username in session
        console.log('Registration successful:', req.session); 
        res.redirect('/admin_home');
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/admin_home');
        }
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`It be running! ===> ${PORT}`);
});

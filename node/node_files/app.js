const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "loginDB"
});


con.connect((err) => {
    if (err) throw err;
    console.log("Connected to DB");
});


app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '..', '..', 'login.html'));
});


app.post('/register', (req, res) => {

    res.send('Registration done.');
});

r
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`It be running! ===> ${PORT}`);
});

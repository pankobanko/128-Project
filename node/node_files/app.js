const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const multer = require('multer');
const app = express();
var fm = require("./function");


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
    password: "password", // Change password
    database: "loginDB"
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected to DB");
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/login.html'));
});

app.get('/about_us', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/About_Us.html'));
});


app.get('/admin_home', (req, res) => {
    if (req.session.loggedin){
        res.sendFile(path.join(__dirname, '../../public/html/admin_home.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/add-recipe', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/add.html'));
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
            res.redirect("/login");
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


app.post('/add-recipe', upload.single('recipe-image'), (req, res) => {
    var name = req.body['recipe-title'];
    var description = req.body['recipe-description'];
    var category = req.body['recipe-category'];
    var ing = req.body['ing'];
    var inst = req.body['inst'];
    var image = req.file ? req.file.filename : null;

    const insertRecipe = `
    INSERT INTO recipes (name, description, category, ing, inst, image) 
    VALUES (?, ?, ?, ?, ?, ?)`;
    con.query(insertRecipe, [name, description, category, ing, inst, image], (err, result) => {
        if (err) {
            console.error('There has been an error with uploading the recipe:', err);
            res.status(500).send(''); 
        } else {
            const newRecipeID = result.insertId; 
            fm.addRecipe(newRecipeID);
            res.redirect('/admin_home');
        }
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



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`It be running! ===> ${PORT}`);
});

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const multer = require('multer');
const app = express();
var fm = require("./function");
const fs = require('fs');


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
    password: "passwordfor128", // Change password
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

app.get('/edit-recipe', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/edit.html'));
});

app.get('/del-recipe', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/delete.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/Contact.html'));
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
    var duration = req.body['recipe-details'];
    var ing = req.body['ing'];
    var inst = req.body['inst'];
    var image = req.file ? req.file.filename : null;

    const insertRecipe = `
    INSERT INTO recipes (name, description, category, duration, ing, inst, image) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    con.query(insertRecipe, [name, description, category, duration, ing, inst, image], (err, result) => {
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

app.get('/get-recipes', (req, res) => {
    const getRecipes = 'SELECT id, name FROM recipes';
    con.query(getRecipes, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/api/recipes', (req, res) => {                             //To display recipes to home page
    const fetchRecipes = `SELECT * FROM recipes`;
    con.query(fetchRecipes, (err, results) => {
        if (err) {
            console.error('Error fetching recipes:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});


app.get('/api/searchresults', (req, res) => {
    const fetchResults = `SELECT * FROM recipes WHERE name LIKE ? OR category LIKE ?`;
    const keyword = `%${req.query.q}%`;
    con.query(fetchResults, [keyword, keyword], (err, results) => {
        if (err) {
            console.error('Error fetching results: ', err);
            res.status(500).json({ error: 'Error fetching results' });
        } else {
            res.json(results);
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

app.get('/get-recipe', (req, res) => {
    const recipeId = req.query.id;
    const getRecipe = 'SELECT * FROM recipes WHERE id = ?';
    con.query(getRecipe, [recipeId], (err, result) => {
        if (err) {
            console.error('Error in attempt of fetching the recipe:', err);
            res.status(500).send('');
        } else {
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).send('Recipe does not exist.');
            }
        }
    });
});

app.post('/edit-recipe', upload.single('recipe-image'), (req, res) => {
    const id = req.body.recipeId;
    const name = req.body['recipe-title'];
    const description = req.body['recipe-description'];
    const category = req.body['recipe-category'];
    const duration = req.body['recipe-details'];
    const ing = req.body['ing'];
    const inst = req.body['inst'];

    const deleteRecipeHTML = (recipeId) => {
        const filename = `rec${String(parseInt(recipeId))}.html`; 
        const filePath = path.join(__dirname, '../../public/recipes', filename);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error in attempt to delete:', err);
            } else {
                console.log('Recipe deleted!');

                fm.addRecipe(id);
            }
        });
    };
    
    const updateRecipeQuery = `
        UPDATE recipes
        SET name = ?, description = ?, category = ?, duration = ?, ing = ?, inst = ?
        WHERE id = ?
    `;
    con.query(updateRecipeQuery, [name, description, category, duration, ing, inst, id], (err, result) => {
        if (err) {
            console.error('Error updating recipe:', err);
            res.status(500).send('Error updating recipe.');
        } else {
            console.log('Recipe updated successfully.');
            deleteRecipeHTML(id);
            res.redirect('/admin_home');
        }
    });
});

app.delete('/delete-recipe', (req, res) => {
    const recipeId = req.query.id;
    const deleteRecipe = 'DELETE FROM recipes WHERE id = ?';
    con.query(deleteRecipe, [recipeId], (err, result) => {
        if (err) {
            console.error('Error in attempt of deleting the recipe:', err);
            res.status(500).send('Failed to delete the recipe.');
        } else {
            const filePath = path.join(__dirname, '../../public/recipes', `rec${recipeId}.html`);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error, cannot delete recipe HTML:', err);
                    res.status(500).send('');
                } else {
                    res.status(200).send('Recipe deleted.');
                }
            });
        }
    });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`It be running! ===> ${PORT}`);
});

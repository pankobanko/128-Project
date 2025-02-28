const fs = require("fs");
const filename = "rec";
const path = require("path");
var counter = 3;
const mysql = require("mysql");
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "passwordfor128", // CHANGE PASSWORD
    database: "loginDB"
});

con.connect((err) => {
    if (err) throw err;
});


exports.addRecipe = function(id) { 
    const selectRecipe = `SELECT * FROM recipes WHERE id = ?`;
    con.query(selectRecipe, [id], (err, result) => {
        if (result.length > 0) {
            const { name, description, category, duration, ing, inst, image } = result[0];
            const code = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${name}</title>
                <link rel="stylesheet" href="rec.css">
            </head>
            <body>
                <div class="entire">    
                    <div class="navbar">
                        <nav>    
                            <ul>
                                <li><a href="/admin_home">Admin</a></li>
                                <li><a href="/">Home</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </nav>
                        <img src="../assets/logo2.png"/>
                    </div>
                </div>
                <div class="page">
                    <div class="recipe-info">
                        <h1 id="recipe-title">${name}</h1> <!--  food name/type -->
                        <p id="recipe-description">${description}</p> <!-- description -->
                        <br><br>
                        <h2>Category:</h2> <!-- i.e cooking time, prep time  -->
                        <p id="category">${category}</p>
                        <h2>Duration:</h2>
                        <p id="recipe-duration">${duration}</p> <!-- details to be entered here -->
                    </div>
                    <div class="ing">  <!-- ingredients list, i.e 200g cheese -->
                        <h2 id="sub1">Ingredients:</h2>
                        <p id="ing">${ing}</p>
                    </div>
                    <div class="instructs"> <!--  cooking instructions, i.e oven under 80c for 20 minutes / chop carrots until ... -->
                        <h2 id="sub2">Preparations and Instructions:</h2>
                        <p id="inst">${inst}</p>
                    </div>
                    
                </div>

            </body>
            </html>
            `;
            const pathing = path.join(__dirname, '../../public/recipes', filename + id + '.html');
            fs.appendFile(pathing, code, function (err) {
                if (err) throw err;
                console.log("new file successfully created with boilerplate attached.");
            });
        } else {
            console.log('This recipe doesn\'t exist because yes.');
        }
    });
}

const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "passwordfor128"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");

    con.query("CREATE DATABASE IF NOT EXISTS loginDB", function (err, result) {
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
                    
                    const checkRecipeExists = `
                        SELECT id FROM recipes WHERE name = 'Baked Tacos' LIMIT 1`;

                    con.query(checkRecipeExists, function (err, result) {
                        if (err) throw err;
                        
                        if (result.length > 0) {
                            console.log("Recipe already exists.");
                            con.end();
                        // } else {

                        //     const insertRecipe = `
                        //         INSERT INTO recipes (name, description, category, duration, ing, inst, image)
                        //         VALUES ('Baked Tacos',
                        //                 'Crispy oven-baked Tacos — Made with crunchy hard taco shells filled with perfectly seasoned ground beef and a blend of taco seasoning. Topped with a generous layer of melted cheese, fresh pico de gallo, a dollop of creamy sour cream, and slices of ripe avocado. These tacos offer a delightful combination of textures and flavors that will elevate your taco night to a whole new level. Enjoy a satisfying and delicious meal that''s easy to prepare and guaranteed to impress your family and friends.',
                        //                 'Pasta',
                        //                 '10 Minutes',
                        //                 '1 lb ground beef\\n1 packet taco seasoning\\n1/2 cup water\\n12 hard taco shells\\n1 cup shredded cheddar cheese\\nToppings: lettuce, tomato, sour cream, salsa, etc.',
                        //                 'Preheat your oven to 375°F (190°C).\\nBrown the ground beef in a pan over medium heat. Drain any excess fat.\\nStir in taco seasoning and water. Simmer for 5 minutes until thickened.\\nArrange taco shells in a baking dish. Spoon the beef mixture into each shell.\\nSprinkle cheese over the beef-filled shells.\\nBake for 10-12 minutes until cheese is melted and shells are crispy.\\nAdd your favorite toppings and serve hot.',
                        //                 'image for later')`;

                        //     con.query(insertRecipe, function (err, result) {
                        //         if (err) throw err;
                        //         console.log("Recipe inserted.");
                        //         con.end();
                        //     });
                        }
                    });
                });
            });
        });
    });
});

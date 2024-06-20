const fs = require("fs");

const filename = "rec";
var counter = 3;

const code = ` // boilerplate
<!DOCTYPE html>   
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recipe Viewing</title>
    <link rel="stylesheet" href="rec.css">
</head>
<body>
    <div class="navbar">
        <nav>    
            <ul>
                <li><a href="../home.html">Home</a></li>
                <li><a href="../login.html">Log In</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    </div>
    <div class="page">
        <div class="recipe-info">
            <h1 id="recipe-title"></h1> <!--  food name/type -->
            <p id="recipe-description"></p> <!-- description -->
            <br><br>
            <h2 id="information">Preparation details</h2> <!-- i.e cooking time, prep time  -->
            <p id="recipe-details"></p> <!-- details to be entered here -->
        </div>
        <div class="ing">  <!-- ingredients list, i.e 200g cheese -->
            <h2 id="sub1"></h2>
            <p id="ing"></p>

        </div>
        <div class="instructs"> <!--  cooking instructions, i.e oven under 80c for 20 minutes / chop carrots until ... -->
            <h2 id="sub2">Preparations and Instructions</h2>
            <p id="inst"></p>
        </div>
        <img id="img"> ///// 
    </div>
    
</body>
</html>
`
exports.addRecipe = function(){                                                                   ///////////////////////////////////////////////////////////////////////////////////
    recipeappend();
}

function recipeappend(){
    fs.appendFile("rec" + (++counter) + ".html", code, function (err){
        if (err) throw err;
        console.log("new file successfully created with boilerplate attached.");
    });
}

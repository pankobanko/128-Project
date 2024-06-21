const express = require('express');
const router = express.Router();
const con = require('./dbSetup'); // Import your MySQL connection

router.post('/update-recipe', (req, res) => {
    const { id, name, description, category, duration, ing, inst, image } = req.body;

    const updateRecipe = `
        UPDATE recipes 
        SET name=?, description=?, category=?, duration=?, ing=?, inst=?, image=? 
        WHERE id=?
    `;
    con.query(updateRecipe, [name, description, category, duration, ing, inst, image, id], (err, result) => {
        if (err) {
            console.error('Error updating recipe: ', err);
            res.status(500).json({ error: 'Error updating recipe' });
        } else {
            console.log('Recipe updated successfully');
            res.json({ message: 'Recipe updated successfully' });
        }
    });
});

module.exports = router;

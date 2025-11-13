const express = require('express');
const router = express.Router();
// Assuming pool is defined in a separate database.js and exported
const pool = require('../database.js'); 

router.get('/:id', async (req, res) => {
    try {
        const photoId = req.params.id;
        const [rows] = await pool.query('SELECT AVG(rating) AS average_rating, COUNT(*) AS total_ratings FROM CommentRate WHERE photo_id = ?', [photoId]);
        res.json({
            average_rating: rows[0].average_rating,
            total_ratings: rows[0].total_ratings
        });
    }
    catch (error) {
        console.error('Error fetching calculation info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
});

module.exports = router;
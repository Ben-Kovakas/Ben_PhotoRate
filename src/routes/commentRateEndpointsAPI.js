const express = require('express');
const router = express.Router();
// Assuming pool is defined in a separate database.js and exported
const pool = require('../database.js'); 

// POST /api/comments - Post new comment and rating
router.post('/', async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        const { photo_id, comment, rating } = req.body; // This line was missing
        const query = 'INSERT INTO CommentRate (photo_id, comment, rating) VALUES (?, ?, ?)';
        await pool.query(query, [photo_id, comment, rating]);

        res.status(201).json({ message: 'Comment and rating added successfully' });

    } catch (error) {
        console.error('Error adding comment and rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
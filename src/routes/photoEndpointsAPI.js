const express = require('express');
const router = express.Router();
// Assuming pool is defined in a separate database.js and exported
const pool = require('../database.js'); 

// GET /api/photos/count - Get total number of photos
router.get('/count', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT COUNT(photo_id) AS total_photos FROM Photos');
        res.json({ total_photos: rows[0].total_photos });
    } catch (error) {
        console.error('Error fetching photo count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/photos/:id - Get a single photo by ID
router.get('/:id', async (req, res) => {
    try {
        // The base path /api/photos/ is already handled in server.js, so we only use :id
        const photoId = req.params.id;
        const [rows] = await pool.query('SELECT * FROM Photos WHERE photo_id = ?', [photoId]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Photo not found' });
        }
    } catch (error) {
        console.error('Error fetching photo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
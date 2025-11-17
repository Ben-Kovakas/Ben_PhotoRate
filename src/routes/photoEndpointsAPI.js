const express = require('express');
const pool = require('../database'); // Assuming this is CommonJS
// Require the analyzer function from the CommonJS module
const { analyzeComments } = require('../../gemini/gemini_test.js');

const router = express.Router();

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

// GET /api/photos/:id/comments - Get all comments for a specific photo AND analyze them
router.get('/:id/comments', async (req, res) => {
    try {
        const photoId = req.params.id;
        // CHECKPOINT 1: Log the photoId being used for the query.
        console.log(`[Checkpoint 1] Fetching comments for photoId: ${photoId}`);

        const [rows] = await pool.query('SELECT comment FROM CommentRate WHERE photo_id = ? ORDER BY created_at ASC', [photoId]);
        
        // CHECKPOINT 2 (Bonus): Log the raw result from the database. This is crucial.
        console.log('[Checkpoint 2] Raw database query result (rows):', rows);

        if (rows.length === 0) {
            return res.json({ summary: "No comments found for this photo." });
        }

        // Call the separate AI analyzer function
        const summaryText = await analyzeComments(rows);

        // CHECKPOINT 4 (Bonus): Log the final summary received from the AI.
        console.log('[Checkpoint 4] Final summary from AI:', summaryText);

        // Return the AI's summary
        res.json({ summary: summaryText });

    } catch (error) {
        console.error('Error fetching or analyzing comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router; // Use module.exports
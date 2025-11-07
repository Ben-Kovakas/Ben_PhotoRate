const express = require('express');
const pool = require('./database'); 

const app = express();


// Parse JSON request bodies
app.use(express.json());
// Serve static files from the "public" directory
app.use(express.static('public'));
app.use('/media', express.static('media'));

//API Endpoints

// Get total number of photos
app.get('/api/photos/count', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT COUNT(photo_id) AS total_photos FROM Photos');
        res.json({ total_photos: rows[0].total_photos });
    } catch (error) {
        console.error('Error fetching photo count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/photos/:id', async (req, res) => {
    try {
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


//Post new comment and rating
app.post('/api/comments', async (req, res) => {
    try {
        const { photo_id, comment, rating } = req.body;
        const query = 'INSERT INTO CommentRate (photo_id, comment, rating) VALUES (?, ?, ?)';
        await pool.query(query, [photo_id, comment, rating]);

        res.status(201).json({ message: 'Comment and rating added successfully' });

    } catch (error) {
        console.error('Error adding comment and rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
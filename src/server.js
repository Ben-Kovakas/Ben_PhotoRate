const express = require('express');
const photoRoutes = require('./routes/photoEndpointsAPI');
const commentRoutes = require('./routes/commentRateEndpointsAPI');
const calcInfoRoutes = require('./routes/calcInfoAPI');
const pool = require('./database'); 

const app = express();
const PORT = 8080;

// Middleware Setup
app.use(express.json());
app.use(express.static('public'));
app.use('/media', express.static('media'));

// --- Route Handlers ---
// Use the separate route files, prefixing them with their API path.
app.use('/api/photos', photoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/calcinfo', calcInfoRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
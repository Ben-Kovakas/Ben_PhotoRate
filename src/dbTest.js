// Simple DB connectivity test script
// Usage: node src/dbTest.js

const pool = require('./database');

(async () => {
    console.log('Testing DB connection...');
    try {
        // If the module exposes testConnection, use it for clearer errors
        if (typeof pool.testConnection === 'function') {
            const result = await pool.testConnection();
            console.log('DB test query result:', result.rows && result.rows[0]);
        } else {
            const [rows] = await pool.query('SELECT 1 AS ok');
            console.log('DB test query result:', rows[0]);
        }
        console.log('✅ Database connection successful');
        process.exit(0);
    } catch (err) {
        console.error('❌ Database connection failed');
        if (err && err.diag) {
            console.error('Diagnostic:', err.diag);
        }
        console.error(err && err.message ? err.message : err);
        process.exit(1);
    }
})();

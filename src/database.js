// Environment-aware MySQL pool with optional SSL and diagnostics suitable for MySQL 8
require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2');

// Build connection options from environment variables with safe defaults.
const connectionOptions = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'photoratedb',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
    queueLimit: 0,
    connectTimeout: process.env.DB_CONNECT_TIMEOUT ? parseInt(process.env.DB_CONNECT_TIMEOUT, 10) : 10000,
};

// Optional SSL support for MySQL 8 connections. Set DB_SSL=true to enable.
if ((process.env.DB_SSL || '').toLowerCase() === 'true') {
    if (process.env.DB_CA_PATH) {
        try {
            connectionOptions.ssl = { ca: fs.readFileSync(process.env.DB_CA_PATH, 'utf8') };
        } catch (err) {
            console.error('Failed to read DB_CA_PATH:', process.env.DB_CA_PATH, err.message);
            // fall back to permissive SSL option
            connectionOptions.ssl = { rejectUnauthorized: false };
        }
    } else {
        // Allow self-signed for development; for production provide CA
        connectionOptions.ssl = { rejectUnauthorized: false };
    }
}

// Create a promise-based pool
const pool = mysql.createPool(connectionOptions).promise();

// Helper: quick connectivity test that user code can call
async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 AS ok');
        return { ok: true, rows };
    } catch (err) {
        const message = err && err.message ? err.message : String(err);
        const diag = { message, code: err.code, errno: err.errno, sqlState: err.sqlState };
        const e = new Error('DB connection failed: ' + message);
        e.diag = diag;
        throw e;
    }
}

module.exports = pool;
module.exports.testConnection = testConnection;

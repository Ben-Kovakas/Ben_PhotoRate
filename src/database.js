const mysql = require('mysql2');

// The pool allows for a collection of connections that can be reused
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '$Benjamin$7',
    database: 'photoratedb'
}).promise();

// async function getPhotoList() {
//     const [rows] = await pool.query('SELECT * FROM Photos');
//     return rows; // The first element contains the rows
// }

// (async () => {
//     try {
//         const rows = await getPhotoList();
//     console.log(rows);
//     } catch (error) {
//         console.error('Error fetching photo list:', error);
//     }
// })();


module.exports = pool;

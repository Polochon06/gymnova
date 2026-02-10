const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gymnova_bdd',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Test de connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
    return;
  }
  console.log('Connecté à la base de données MySQL');
  connection.release();
});

module.exports = pool.promise();
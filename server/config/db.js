const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'digitalflake'
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed");
    throw err;
  }
  console.log("✅ MySQL Connected Successfully");
});

module.exports = db;
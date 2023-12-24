const mysql = require('mysql2/promise')
require('dotenv').config()

const connection = mysql.createPool({
  user: process.env.USER,
  database: process.env.DATA_BASE,
  password: process.env.DB_PASSWORD,
  host: process.env.HOST,
}); 

module.exports = { connection }
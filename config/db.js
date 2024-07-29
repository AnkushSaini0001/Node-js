const mysql = require("mysql2/promise");
const mysqlPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Root@1234",
  database: "students_db",
});

module.exports = mysqlPool;

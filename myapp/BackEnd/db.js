const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "petfood",

  password: "Ngocquynguyen1",
});

db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối MySQL:", err);
  } else {
    console.log("Kết nối MySQL thành công");
  }
});

module.exports = db;

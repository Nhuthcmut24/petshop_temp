// const express = require('express');
// const mysql = require('mysql');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const port = 3001;

// app.use(cors());

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'bkbook',
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Lỗi kết nối MySQL:', err);
//   } else {
//     console.log('Kết nối MySQL thành công');
//   }
// });

// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.post('/api/signup', (req, res) => {
  
//   const { username, password, confirmPassword, phoneNumber } = req.body;

//   // Kiểm tra mật khẩu và xác nhận mật khẩu
//   if (password !== confirmPassword) {
//     return res.status(400).json({ message: 'Mật khẩu không khớp' });
//   }

//   const sql = 'INSERT INTO khachhang (TenDangNhap, MatKhau, SoDienThoai) VALUES (?, ?, ?)';
//   db.query(sql, [username, password, phoneNumber], (error, results) => {
//     if (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Đã có lỗi xảy ra' });
//     } else {
//       res.status(201).json({ message: 'Đăng ký thành công' });
//     }
//   });
// });

// app.post('/api/login', (req, res) => {
//   const { username, password } = req.body;
//   const sql = 'SELECT * FROM khachhang WHERE TenDangNhap = ? AND MatKhau = ?';
//   db.query(sql, [username, password], (error, results) => {
//     if (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Đã có lỗi xảy ra' });
//     } else {
//       if (results.length > 0) {
//         // Xác thực thành công
//         res.status(200).json({ message: 'Đăng nhập thành công' });
//       } else {
//         // Xác thực thất bại
//         res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
//       }
//     }
//   });
// });

// app.get('/api/cart/:username', (req, res) => {
//   const username = req.params.username;
//   const query = 
//   'SELECT Anh, Ten, TacGia, NXB, Gia, SoLuong FROM khachhang, khachthemsach, sach WHERE TenDangNhap=? AND khachhang.SoDienThoai=khachthemsach.SoDienThoai AND khachthemsach.IDSach=sach.ID';
//   db.query(query, [username], (error, results) => {
//     if (error) throw error;
    
//     res.json(results);
//   });
// });

// app.get('/api/getBooksForHomePage', (req, res) => {
//   const query = 'SELECT * FROM sach LIMIT 8';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       res.status(500).send('Internal Server Error');
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get('/api/search', (req, res) => {
//   const searchTerm = req.query.q;

//   const query =
//     'SELECT * FROM sach WHERE LOWER(Ten) LIKE LOWER(?) OR LOWER(TacGia) LIKE LOWER(?)';
//   const params = [`%${searchTerm}%`, `%${searchTerm}%`];

//   db.query(query, params, (error, results) => {
//     if (error) throw error;
//     res.json(results);
//   });
// });

// app.listen(port, () => {
//   console.log(`Server đang lắng nghe tại http://localhost:${port}`);
// });

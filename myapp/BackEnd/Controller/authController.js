const db = require('../db');

exports.signup = (req, res) => {
  const { username, password, confirmPassword, phoneNumber } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Mật khẩu không khớp' });
  }

  const sql = 'INSERT INTO khachhang (TenDangNhap, MatKhau, SoDienThoai) VALUES (?, ?, ?)';
  db.query(sql, [username, password, phoneNumber], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã có lỗi xảy ra' });
    } else {
      res.status(201).json({ message: 'Đăng ký thành công' });
    }
  });
};


exports.login = (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM khachhang WHERE TenDangNhap = ? AND MatKhau = ?';
  
  db.query(sql, [username, password], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã có lỗi xảy ra' });
    } else {
      if (results.length > 0) {
        // Xác thực thành công
        res.status(200).json({ message: 'Đăng nhập thành công' });
      } else {
        // Xác thực thất bại
        res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
      }
    }
  });
};

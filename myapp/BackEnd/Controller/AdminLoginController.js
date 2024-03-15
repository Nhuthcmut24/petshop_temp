const db = require('../db');
// exports.AdminLogin = async(req, res) => {
//     try {
//         const { username, password } = req.body;
//         const results = await query('SELECT * FROM nhanvien WHERE TenDangNhap = ?', [username]);
//         if (results.length > 0 && results[0].MatKhau == password) {
//         res.status(200).json({ message: 'Đăng nhập thành công' });
//         } else {
//         res.status(401).json({ message: 'Đăng nhập thất bại' });
//         }
//     } catch (error) {
//         next(error);
//     }
// }
exports.AdminLogin = (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM nhanvien WHERE TenDangNhap = ? AND MatKhau = ?';
    
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
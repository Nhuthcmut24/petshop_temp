const db = require('../db');

// app.get('/api/cart/:username', (req, res) => {
//     const username = req.params.username;
//     const query = 
//     'SELECT Anh, Ten, TacGia, NXB, Gia, SoLuong FROM khachhang, khachthemsach, sach WHERE TenDangNhap=? AND khachhang.SoDienThoai=khachthemsach.SoDienThoai AND khachthemsach.IDSach=sach.ID';
//     db.query(query, [username], (error, results) => {
//       if (error) throw error;
      
//       res.json(results);
//     });
//   });

exports.getCart = (req, res) => {
  const username = req.params.username;
  const query = 
  'SELECT IDSach, Anh, Ten, TacGia, NXB, Gia, SoLuong, MucGiamGia FROM khachhang, khachthemsach, sach WHERE TenDangNhap=? AND khachhang.SoDienThoai=khachthemsach.SoDienThoai AND khachthemsach.IDSach=sach.ID';
  db.query(query, [username], (error, results) => {
    if (error) throw error;
    
    res.json(results);
  });
}

exports.addToCart = (req, res) => {
  const { bookId, count, username } = req.body;
  const query = 'SELECT * FROM khachhang WHERE TenDangNhap=?';
  db.query(query, [username], (error, results) => {
    if (error) throw error;
    if (results.length === 0) {
      res.json({ error: 'User not found' });
      return;
    }
    const phoneNumber = results[0].SoDienThoai;
    const query2 = 'CALL ThemSachVaoGioHang(?, ?, ?)';
    db.query(query2, [phoneNumber, bookId, count], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });
};

exports.deleteFromCart = (req, res) => {
  const { bookId, username } = req.body;
  const query = 'SELECT * FROM khachhang WHERE TenDangNhap=?';
  db.query(query, [username], (error, results) => {
    if (error) throw error;
    if (results.length === 0) {
      res.json({ error: 'User not found' });
      return;
    }
    const phoneNumber = results[0].SoDienThoai;
    const query2 = 'DELETE FROM khachthemsach WHERE SoDienThoai=? AND IDSach=?';
    db.query(query2, [phoneNumber, bookId], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });
}

exports.intoOrder = (req, res) => {
  const { username, totalPrice } = req.body;
  const query = 'SELECT * FROM khachhang WHERE TenDangNhap=?';
  db.query(query, [username], (error, results) => {
    if (error) throw error;
    if (results.length === 0) {
      res.json({ error: 'User not found' });
      return;
    }
    const phoneNumber = results[0].SoDienThoai;
    const query2 = 'CALL TaoDonHangTuGioHang(?, ?)';
    db.query(query2, [phoneNumber, totalPrice], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });
}

exports.updateQuantityInCart = (req, res) => {
  const { bookId, username, quantity } = req.body;
  const query = 'SELECT * FROM khachhang WHERE TenDangNhap=?';
  db.query(query, [username], (error, results) => {
    if (error) throw error;
    if (results.length === 0) {
      res.json({ error: 'User not found' });
      return;
    }
    const phoneNumber = results[0].SoDienThoai;
    const query2 = 'UPDATE khachthemsach SET SoLuong=? WHERE SoDienThoai=? AND IDSach=?';
    db.query(query2, [quantity, phoneNumber, bookId], (error, results) => {
      if (error) throw error;
      res.json(results);
      console.log(results);
    });
  });
}
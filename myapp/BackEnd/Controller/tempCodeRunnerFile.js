const db = require('../db');

exports.AddBook = async (req, res, next) => {
  const { name, image, price, author, publisher, discount, soldQuantity} = req.body;
  console.log(req.body);
  const query = `INSERT INTO sach(Ten, Anh, Gia, MucGiamGia, TacGia, NXB, SoLuongDaBan) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [name, image, price, discount, author, publisher, soldQuantity];
  db.query(query, params, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã có lỗi xảy ra' });
    } else {
      res.json(results);
    }
  });
}
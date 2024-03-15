const db = require("../db");

exports.GetAdmin = async (req, res, next) => {
    try {
      const query1 = `select * from nhanvien WHERE ID = ? `;
      const { employee_ID } = req.params;
      const value1= [employee_ID];
      const results = await query(query1,value1);
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }

exports.GetOrder = async (req, res) => {
  const query=`SELECT * FROM donhang, khachhang WHERE donhang.SoDienThoai = khachhang.SoDienThoai`;
  
  db.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  }
  );
}

exports.SearchOrder = async (req, res) => {
  const { searchTerm } = req.query;
  console.log(searchTerm);
  const query = `SELECT * FROM donhang JOIN khachhang ON donhang.SoDienThoai = khachhang.SoDienThoai WHERE LOWER(khachhang.SoDienThoai) LIKE LOWER(?) OR LOWER(HoTen) LIKE LOWER(?)`;
  const params = [`%${searchTerm}%`, `%${searchTerm}%`];
  db.query(query, params, (error, results) => {
    if (error) throw error;
    res.json(results);
    console.log(results);
  });
}

exports.GetOrderConfirm = async (req, res, next) => {
try {
  const query1 =`SELECT * 
                FROM donhang
                WHERE XacNhan = 'N'
                `;
  const results = await query(query1);
  res.status(200).json(results);
} catch (error) {
  next(error);
}
}

exports.GetListBook = async (req, res, next) => {
try {
  const query1 =`SELECT * FROM sach`;
  const results = await query(query1);
  res.status(200).json(results)
  } catch (error) {
    next(error);
  }
}

exports.GetBook = async (req, res, next) => {
try {
  const query1 =`SELECT * FROM sach WHERE ID = ?`;
  const { book_ID } = req.params;
  const value1 = [book_ID];
  const results = await query(query1,value1);
  res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}

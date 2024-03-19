const db = require("../db");

exports.getBooksForHomePage = (req, res) => {
  const query = "SELECT * FROM Food";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(results);
    }
  });
};
exports.getBooksDogForHomePage = (req, res) => {
  const query =
    "SELECT  food.ID ,food.Ten , food.Anh ,food.MoTa ,food.Gia ,food.MucGiamGia ,food.SoLuongDaBan ,food.NhaCungCap ,food.NhaSanXuat ,food.DiemTrungBinh  FROM food,foodthuocdanhmuc,danhmuc WHERE food.ID=foodthuocdanhmuc.IDFood and foodthuocdanhmuc.IDdanhmuc=danhmuc.ID and danhmuc.ten= 'Thức ăn cho chó' ;";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(results);
    }
  });
};

exports.getBooksCatForHomePage = (req, res) => {
  const query =
    "SELECT  food.ID ,food.Ten , food.Anh ,food.MoTa ,food.Gia ,food.MucGiamGia ,food.SoLuongDaBan ,food.NhaCungCap ,food.NhaSanXuat ,food.DiemTrungBinh  FROM food,foodthuocdanhmuc,danhmuc WHERE food.ID=foodthuocdanhmuc.IDFood and foodthuocdanhmuc.IDdanhmuc=danhmuc.ID and danhmuc.ten= 'Thức ăn cho mèo' ;";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(results);
    }
  });
};

exports.getBooksOtherForHomePage = (req, res) => {
  const query =
    "SELECT  food.ID ,food.Ten , food.Anh ,food.MoTa ,food.Gia ,food.MucGiamGia ,food.SoLuongDaBan ,food.NhaCungCap ,food.NhaSanXuat ,food.DiemTrungBinh  FROM food,foodthuocdanhmuc,danhmuc WHERE food.ID=foodthuocdanhmuc.IDFood and foodthuocdanhmuc.IDdanhmuc=danhmuc.ID and danhmuc.ten <> 'Thức ăn cho mèo' and danhmuc.ten <> 'Thức ăn cho chó' ;";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(results);
    }
  });
};

exports.search = (req, res) => {
  const searchTerm = req.query.q;

  const query =
    "SELECT * FROM Food WHERE LOWER(Ten) LIKE LOWER(?) OR LOWER(NhaSanXuat) LIKE LOWER(?)";
  const params = [`%${searchTerm}%`, `%${searchTerm}%`];

  db.query(query, params, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
};

exports.getProductDetails = (req, res) => {
  const foodId = req.params.bookId;

  const query = "SELECT * FROM Food WHERE ID = ?";
  const params = [foodId];

  db.query(query, params, (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
};

exports.getProductReviews = (req, res) => {
  const bookId = req.params.bookId;

  const query =
    "SELECT danhgia.*, HoTen FROM danhgia, khachhang WHERE IDFood = ? AND danhgia.SoDienThoai = khachhang.SoDienThoai";
  db.query(query, [bookId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Đã có lỗi xảy ra" });
    } else {
      res.json(results);
    }
  });
};

exports.rating = (req, res) => {
  const bookId = req.params.bookId;
  const { username, rating, comment } = req.body;
  console.log(req.body);
  console.log(bookId);

  const query = "SELECT SoDienThoai FROM khachhang WHERE TenDangNhap = ?";
  const params = [username];

  db.query(query, params, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Đã có lỗi xảy ra" });
    } else {
      const query = "INSERT INTO danhgia VALUES (?, ?, ?, ?)";
      const params = [results[0].SoDienThoai, bookId, rating, comment];

      db.query(query, params, (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: "Đã có lỗi xảy ra" });
        } else {
          res.json({ message: "Đánh giá thành công" });
        }
      });
    }
  });
};

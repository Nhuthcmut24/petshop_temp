exports.UpdateBook = async (req, res, next) => {
  try {
    const query1 = `
      UPDATE Food
      SET Ten = ?, Anh = ?, MoTa = ?, Gia = ?, MucGiamGia = ?, SoLuongDaBan = ?, NXB = ?, TacGia = ?, DiemTrungBinh = ?
      WHERE ID = ?
    `;

    const {
      Ten,
      Anh,
      MoTa,
      Gia,
      MucGiamGia,
      SoLuongDaBan,
      NXB,
      TacGia,
      DiemTrungBinh,
    } = req.body;
    const value = [
      Ten,
      Anh,
      MoTa,
      Gia,
      MucGiamGia,
      SoLuongDaBan,
      NXB,
      TacGia,
      DiemTrungBinh,
    ];
    const result = await query(query1, value);
    res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

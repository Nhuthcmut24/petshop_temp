exports.Confirm = async (req, res, next) => {
    try {
      const query1 =`
      UPDATE donhang
      SET XacNhan = ?,
      WHERE ID = ?
    `;
    
    const {confirm} = req.body;
    const value = [confirm];
    const result = await query(query1,value);
    res.status(200).json({message:"Thành công"})
    } catch (error) {
      next(error);
    }
  }
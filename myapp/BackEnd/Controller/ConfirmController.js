const db = require("../db");

exports.Confirm = async (req, res) => {
  const query1 = `
      UPDATE donhang
      SET XacNhan = 'Xác nhận đơn hàng'
      WHERE ID = ?
    `;
  const orderID = req.body.orderID; // Corrected typo: oderID -> orderID
  db.query(query1, [orderID], (error, results) => {
    if (error) throw error;
    res.json(results);
    console.log(results);
  });
};

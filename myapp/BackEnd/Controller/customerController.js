const db = require('../db');

exports.getInfo = (req, res) => {
    const username = req.params.username;
    const query = 'SELECT * FROM khachhang WHERE TenDangNhap=?';
    console.log(username);
    db.query(query, [username], (error, results) => {
        if (error) throw error;
        res.json(results);
        console.log(results);
    });
}

exports.updateEmail = (req, res) => {
    const username = req.params.username;
    const email = req.body.email;
    const query = 'UPDATE khachhang SET Email=? WHERE TenDangNhap=?';
    db.query(query, [email, username], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
}

exports.updateAddress = (req, res) => {
    const username = req.params.username;
    const address = req.body.address;
    const query = 'UPDATE khachhang SET Diachi=? WHERE TenDangNhap=?';
    db.query(query, [address, username], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
}

exports.updatePassword = (req, res) => {
    const username = req.params.username;
    const password = req.body.password;
    const query = 'UPDATE khachhang SET MatKhau=? WHERE TenDangNhap=?';
    db.query(query, [password, username], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
}


exports.getOrderList = (req, res) => {
    const username = req.params.username;
    const query = 'SELECT SoDienThoai FROM khachhang WHERE TenDangNhap=?';
    db.query(query, [username], (error, results) => {
        if (error) throw error;
        const phone = results[0].SoDienThoai;
        const query2 = 'SELECT * FROM donhang WHERE SoDienThoai=?';
        db.query(query2, [phone], (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    });
}

exports.getOrderProduct = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT donhangcosach.*, sach.Ten, sach.Anh, donhang.XacNhan FROM donhangcosach, sach, donhang WHERE IDDonHang=? AND donhangcosach.IDSach=sach.ID AND donhang.ID=donhangcosach.IDDonHang';
    db.query(query, [id], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
}

exports.updateOrderState = (req, res) => {
    const id = req.params.id;
    const state = req.body.state;
    const query = 'UPDATE donhang SET XacNhan=? WHERE ID=?';
    db.query(query, [state, id], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
}

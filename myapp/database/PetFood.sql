DROP DATABASE PETFOOD;
CREATE DATABASE PETFOOD;
USE PETFOOD;

CREATE TABLE KhachHang (
    TenDangNhap VARCHAR(20) UNIQUE NOT NULL,
    SoDienThoai CHAR(10) NOT NULL,
    MatKhau VARCHAR(20) NOT NULL,
    HoTen VARCHAR(255) NOT NULL DEFAULT 'Anonymous',
    NgaySinh DATE,
    GioiTinh CHAR(1),
    Email VARCHAR(255) UNIQUE,
    Diachi VARCHAR(1000),
    NgayTao DATETIME,
    NgayCapNhat DATETIME,
    PRIMARY KEY (SoDienThoai)
);

CREATE TABLE DanhMuc (
    ID INT AUTO_INCREMENT,
    Ten VARCHAR(255) NOT NULL,
    MoTa VARCHAR(255),
    PRIMARY KEY (ID)
);

CREATE TABLE Food (
    ID INT AUTO_INCREMENT,
    Ten VARCHAR(255) NOT NULL,
    Anh VARCHAR(255) NOT NULL,
    MoTa TEXT(65535) NOT NULL,
    Gia INT NOT NULL,
    MucGiamGia INT,
    SoLuongDaBan INT,
    NXB VARCHAR(255) DEFAULT 'PETFOOD',
    TacGia VARCHAR(255) DEFAULT 'Anonymous',
    DiemTrungBinh FLOAT NOT NULL DEFAULT 0,
    PRIMARY KEY (ID)
);

CREATE TABLE FoodThuocDanhMuc(
    IDDanhMuc INT NOT NULL,
    IDFood INT NOT NULL,
    PRIMARY KEY (IDDanhMuc, IDFood)
);
ALTER TABLE FoodThuocDanhMuc
ADD CONSTRAINT FK__FoodThuocDanhMuc_DanhMuc FOREIGN KEY (IDDanhMuc) REFERENCES DanhMuc(ID),
ADD CONSTRAINT FK__FoodThuocDanhMuc_Food FOREIGN KEY (IDFood) REFERENCES Food(ID);

CREATE TABLE KhachThemFood (
    SoDienThoai CHAR(10) NOT NULL,
    IDFood INT NOT NULL,
    SoLuong INT NOT NULL,
    PRIMARY KEY(SoDienThoai, IDFood)
);
ALTER TABLE KhachThemFood
ADD CONSTRAINT FK__ThemFood_SDT FOREIGN KEY (SoDienThoai) REFERENCES KhachHang(SoDienThoai),
ADD CONSTRAINT FK__ThemFood_ID FOREIGN KEY (IDFood) REFERENCES Food(ID);

CREATE TABLE DonHang (
    ID INT AUTO_INCREMENT,
    SoDienThoai CHAR(10) NOT NULL,
    TongTien INT,
    NgayTao DATETIME,
    XacNhan CHAR(1),
    DiaChi TEXT(65535) NOT NULL,
    PRIMARY KEY(ID)
);
ALTER TABLE DonHang
ADD CONSTRAINT FK__DonHang__SDT FOREIGN KEY (SoDienThoai) REFERENCES KhachHang(SoDienThoai);

CREATE TABLE DonHangCoFood(
    IDDonHang INT NOT NULL,
    IDFood INT NOT NULL,
    SoLuong INT,
    TongTien INT,
    PRIMARY KEY (IDDonHang, IDFood)
);
ALTER TABLE DonHangCoFood
ADD CONSTRAINT FK__DHCS__IDDonHang FOREIGN KEY (IDDonHang) REFERENCES DonHang(ID),
ADD CONSTRAINT FK__DHCS__IDFood FOREIGN KEY (IDFood) REFERENCES Food(ID);

CREATE TABLE NhanVien (
    ID CHAR(10) NOT NULL,
    TenDangNhap VARCHAR(20) NOT NULL,
    MatKhau VARCHAR(20) NOT NULL,
    HoTen VARCHAR(255) NOT NULL,
    SoDienThoai CHAR(10) NOT NULL,
    GioiTinh CHAR(1),
    PRIMARY KEY (ID)
);

CREATE TABLE DanhGia (
    SoDienThoai CHAR(10) NOT NULL,
    IDFood INT NOT NULL,
    SoSao INT,
    MoTa TEXT(65535),
    PRIMARY KEY(SoDienThoai, IDFood)
);
ALTER TABLE DanhGia
ADD CONSTRAINT FK__DanhGia_SDT FOREIGN KEY (SoDienThoai) REFERENCES KhachHang(SoDienThoai),
ADD CONSTRAINT FK__DanhGia_IDFood FOREIGN KEY (IDFood) REFERENCES Food(ID);

INSERT INTO KhachHang VALUE ('nguyenvana', '0903181625', '123456', 'Nguyễn Văn A', '2000/05/06', 'M', 'nguyenvana@gmail.com', 'TPHCM', NOW(), NOW());
INSERT INTO KhachHang VALUE ('tranbinh', '0908452317', '12345678', 'Trần Văn Bình', '1993/08/12', 'M', 'tranvbinh@gmail.com', 'TPHCM', NOW(), NOW());

INSERT INTO DanhMuc VALUE (1, 'Truyện Ngắn', NULL);
INSERT INTO DanhMuc VALUE (2, 'Truyện Dài', NULL);
INSERT INTO DanhMuc VALUE (3, 'Tiểu Thuyết', NULL);
INSERT INTO DanhMuc VALUE (4, 'Truyện Tranh', NULL);
INSERT INTO DanhMuc VALUE (5, 'Kinh Dị', NULL);
INSERT INTO DanhMuc VALUE (6, 'Trinh Thám', NULL);
INSERT INTO DanhMuc VALUE (7, 'Ngôn Tình', NULL);
INSERT INTO DanhMuc VALUE (8, 'Sách Tham Khảo', NULL);
INSERT INTO DanhMuc VALUE (9, 'Sách Ngoại Ngữ', NULL);
INSERT INTO DanhMuc VALUE (10, 'Sách Giáo Khoa', NULL);

insert into Food(Ten, Anh, MoTa, Gia) value ('Essential Grammar in Use', 'grammar.webp', '_', 155000);
insert into Food(Ten, Anh, MoTa, Gia) value ('Kế toán vỉa hè', 'ktvh.png', '_', 99000);
insert into Food(Ten, Anh, MoTa, Gia) value ('Điều kỳ diệu ở tiệm tạp hóa Namiya', 'namiya.jpg', '_', 78000);
insert into Food(Ten, Anh, MoTa, Gia) value ('Ỷ thiên đồ long ký', 'yThien.jpg', '_', 62000);
insert into Food(Ten, Anh, MoTa, Gia) value ('Về nơi có nhiều cánh đồng', 'vncncd.jpg', '_', 150000);
insert into Food(Ten, Anh, MoTa, Gia) value ('Ngày xưa có một chuyện tình', 'nxc1ct.jpg', '_', 98000);
insert into Food(Ten, Anh, MoTa, Gia) value ('Toán cao cấp tập 1', 'toancc.webp', '_', 112000);
insert into Food(Ten, Anh, MoTa, Gia) value ('Osho - Tự tôn', 'osho-tu-ton.jpg', '_', 135000);

INSERT INTO KhachThemFood VALUE ('0903181625', 1, 2);
INSERT INTO KhachThemFood VALUE ('0903181625', 2, 3);
INSERT INTO KhachThemFood VALUE ('0908452317', 3, 1);
INSERT INTO KhachThemFood VALUE ('0908452317', 4, 2);

INSERT INTO NhanVien VALUE ('EMP0001', 'admin', '123456789', 'Nguyễn Văn A', '0908246578', 'M');

insert into DanhGia value ('0903181625', 1, 4, 'Sách rất mới, đóng gói kĩ.')
insert into DanhGia value ('0908452317', 1, 5, 'Chất lượng giấy tốt, nội dung rất hay.')

DELIMITER //

CREATE FUNCTION TongTien(SDT CHAR(10))
RETURNS INT
BEGIN
    DECLARE total INT;

    SELECT SUM(S.Gia * KTS.SoLuong) INTO total
    FROM KhachThemFood KTS
    INNER JOIN Food S ON KTS.IDFood = S.ID
    WHERE KTS.SoDienThoai = SDT;

    IF total IS NULL THEN
        SET total = 0;
    END IF;

    RETURN total;
END //

CREATE TRIGGER TinhRatingTB AFTER INSERT ON DanhGia
FOR EACH ROW
BEGIN
DECLARE TongDiem INT;
DECLARE SoDanhGia INT;

SELECT SUM(SoSao),COUNT(*) INTO TongDiem,SoDanhGia
FROM DanhGia 
WHERE IDFood = NEW.IDFood;

IF SoDanhGia > 0 THEN
    UPDATE Food SET DiemTrungBinh = TongDiem / SoDanhGia WHERE ID = NEW.IDFood;
END IF;
END //

CREATE PROCEDURE CapNhatSoLuongFoodTrongGioHang(
    p_SoDienThoai CHAR(10),
    p_IDFood INT,
    p_SoLuong INT
)
BEGIN
    DECLARE existingQuantity INT;
    DECLARE newQuantity INT;

    SET existingQuantity = (SELECT SoLuong FROM KhachThemFood WHERE SoDienThoai = p_SoDienThoai AND IDFood = p_IDFood);
    SET newQuantity = (existingQuantity + p_SoLuong); 
    UPDATE KhachThemFood SET SoLuong = newQuantity WHERE SoDienThoai = p_SoDienThoai AND IDFood = p_IDFood;

END //

CREATE PROCEDURE ThemFoodVaoGioHang(
    p_SoDienThoai CHAR(10),
    p_IDFood INT,
    p_SoLuong INT
)
BEGIN
    -- Nếu sách chưa có trong giỏ hàng, thêm mới vào
    IF p_IDFood NOT IN (SELECT IDFood FROM KhachThemFood WHERE SoDienThoai = p_SoDienThoai) THEN
        -- Thêm sách vào giỏ hàng
        INSERT INTO KhachThemFood(p_SoDienThoai, p_IDFood, p_SoLuong) VALUE (p_IDFood, p_SoLuong);

    ELSE
        -- Nếu sách đã có trong giỏ hàng, gọi thủ tục cập nhật số lượng
        CALL CapNhatSoLuongFoodTrongGioHang(p_SoDienThoai, p_IDFood, p_SoLuong);
    END IF;
END //

CREATE PROCEDURE TaoDonHangTuGioHang(
    p_SoDienThoai CHAR(10)
)
BEGIN
    DECLARE p_TongTien INT;
    DECLARE p_XacNhan CHAR(1);
    DECLARE p_DiaChi VARCHAR(1000);
    DECLARE IDDonHang INT;

    SELECT SUM(S.Gia * KTS.SoLuong) INTO p_TongTien
    FROM KhachThemFood KTS
    JOIN Food S ON KTS.IDFood = S.ID
    WHERE KTS.SoDienThoai = p_SoDienThoai;

    SET p_XacNhan = 'N';
    SET p_DiaChi = (SELECT DiaChi FROM KhachHang WHERE SoDienThoai = p_SoDienThoai);
    
    INSERT INTO DonHang (SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) VALUE (p_SoDienThoai, p_TongTien, NOW(), p_XacNhan, p_DiaChi);
    
    SET IDDonHang = LAST_INSERT_ID();
    
    INSERT INTO DonHangCoFood (IDDonHang, IDFood, SoLuong, TongTien)
    SELECT IDDonHang, IDFood, SoLuong, Gia * SoLuong
    FROM KhachThemFood KTS
    JOIN Food S ON KTS.IDFood = S.ID
    WHERE KTS.SoDienThoai = p_SoDienThoai;
    
    DELETE FROM KhachThemFood WHERE SoDienThoai = p_SoDienThoai;
    
END //

DELIMITER ;
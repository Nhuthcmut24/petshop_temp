
DROP DATABASE PetFood;
CREATE DATABASE PetFood;
USE PetFood;
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
    MucGiamGia INT DEFAULT 0,
    SoLuongDaBan INT,
    NhaCungCap VARCHAR(255) DEFAULT 'Mars petcare',
    NhaSanXuat VARCHAR(255) DEFAULT 'Cty gia dinh Mappet',
    DiemTrungBinh FLOAT,
    HoTroTraHang VARCHAR(255) DEFAULT 'Không',
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
    XacNhan CHAR(20),
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
    Email VARCHAR(255),
    DiaChi VARCHAR(1000),
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

DELIMITER //

CREATE FUNCTION TongTien(SDT CHAR(10)) RETURNS INT READS SQL DATA
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
END;
 //

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

select * from donhang;
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
        INSERT INTO KhachThemFood(SoDienThoai, IDFood, SoLuong) VALUE (p_SoDienThoai, p_IDFood, p_SoLuong);

    ELSE
        -- Nếu sách đã có trong giỏ hàng, gọi thủ tục cập nhật số lượng
        CALL CapNhatSoLuongFoodTrongGioHang(p_SoDienThoai, p_IDFood, p_SoLuong);
    END IF;
END //

CREATE PROCEDURE TaoDonHangTuGioHang(
    p_SoDienThoai CHAR(10),
    p_TongTien INT
)
BEGIN
    DECLARE p_XacNhan CHAR(20);
    DECLARE p_DiaChi VARCHAR(1000);
    DECLARE IDDonHang INT;

    SET p_XacNhan = 'Đang xử lý';
    SET p_DiaChi = (SELECT DiaChi FROM KhachHang WHERE SoDienThoai = p_SoDienThoai);
    
    INSERT INTO DonHang (SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) VALUE (p_SoDienThoai, p_TongTien, NOW(), p_XacNhan, p_DiaChi);
    
    SET IDDonHang = LAST_INSERT_ID();
    
    INSERT INTO DonHangCoFood (IDDonHang, IDFood, SoLuong, TongTien)
    SELECT IDDonHang, IDFood, SoLuong, (Gia * (100 - MucGiamGia) / 100) * SoLuong
    FROM KhachThemFood KTS
    JOIN Food S ON KTS.IDFood = S.ID
    WHERE KTS.SoDienThoai = p_SoDienThoai;
    
    DELETE FROM KhachThemFood WHERE SoDienThoai = p_SoDienThoai;
    
END //


CREATE PROCEDURE XacNhanDonHang(
    p_SoDienThoai CHAR(10)
)
BEGIN
    DECLARE p_XacNhan CHAR(20);
    DECLARE p_DiaChi VARCHAR(1000);
    DECLARE IDDonHang INT;

    SET p_XacNhan = 'Đang xử lý';
    SET p_DiaChi = (SELECT DiaChi FROM KhachHang WHERE SoDienThoai = p_SoDienThoai);
    
    INSERT INTO DonHang (SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) VALUE (p_SoDienThoai, p_TongTien, NOW(), p_XacNhan, p_DiaChi);
    
    SET IDDonHang = LAST_INSERT_ID();
    
    INSERT INTO DonHangCoFood (IDDonHang, IDFood, SoLuong, TongTien)
    SELECT IDDonHang, IDFood, SoLuong, (Gia * (100 - MucGiamGia) / 100) * SoLuong
    FROM KhachThemFood KTS
    JOIN Food S ON KTS.IDFood = S.ID
    WHERE KTS.SoDienThoai = p_SoDienThoai;
    
    DELETE FROM KhachThemFood WHERE SoDienThoai = p_SoDienThoai;
    
END //

DELIMITER ;

INSERT INTO KhachHang VALUE ('tienhuynh', '0903127256', '12345678', 'Huỳnh Văn Tiến', '2000/05/06', 'M', 'huynhvtien@gmail.com', '64 Nguyễn Đình Chính, P15, Q.Phú Nhuận, TP.HCM', NOW(), NOW());
INSERT INTO KhachHang VALUE ('huyentran', '0913080299', '12345678', 'Trần Thị Huyền', '1993/08/12', 'F', 'huyentran@gmail.com', '356/11 Bạch Đằng, P14, Q.Bình Thạnh, TP.HCM', NOW(), NOW());
INSERT INTO KhachHang VALUE ('phamvbinh', '0909991573', '12345678', 'Phạm Văn Bình', '1998/02/03', 'M', 'binhphamvan@gmail.com', '36 Bùi Văn Thêm, P9, Q.Phú Nhuận, TP.HCM', NOW(), NOW());
INSERT INTO KhachHang VALUE ('quynh2507', '0902764213', '12345678', 'Nguyễn Ngọc Quỳnh', '1995/07/25', 'F', 'nguyenquynh@gmail.com', '313 Phạm Văn Chiêu, P14, Q.Gò Vấp, TP.HCM', NOW(), NOW());
INSERT INTO KhachHang VALUE ('dat2203', '0913020447', '12345678', 'Trương Thành Đạt', '2001/03/22', 'M', 'truongtdat@gmail.com', '242 Lý Thường Kiệt, P14, Q.10, TP.HCM', NOW(), NOW());

INSERT INTO DanhMuc VALUE (1, 'Thức ăn cho chó', NULL);
INSERT INTO DanhMuc VALUE (2, 'Thức ăn cho mèo', NULL);
INSERT INTO DanhMuc VALUE (3, 'Thức ăn cho cá', NULL);
-- INSERT INTO DanhMuc VALUE (4, 'Truyện Tranh', NULL);
-- INSERT INTO DanhMuc VALUE (5, 'Kinh Dị', NULL);
-- INSERT INTO DanhMuc VALUE (6, 'Trinh Thám', NULL);
-- INSERT INTO DanhMuc VALUE (7, 'Ngôn Tình', NULL);
-- INSERT INTO DanhMuc VALUE (8, 'Sách Tham Khảo', NULL);
-- INSERT INTO DanhMuc VALUE (9, 'Sách Ngoại Ngữ', NULL);
-- INSERT INTO DanhMuc VALUE (10, 'Sách Giáo Khoa', NULL);

insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, MucGiamGia, NhaSanXuat, NhaCungCap) value ('Có',15,'Cám thái INVE NRD 35 , 58 cho cá 7 màu,guppy,betta,cá thuỷ sinh', 'camthai.jpg', 'Cám thái INVE NRD 35 và 58 là loại thức ăn được thiết kế đặc biệt để cung cấp dinh dưỡng cần thiết cho cá 7 màu, guppy, betta và các loại cá khác trong hồ cá của bạn. Thức ăn này được chế biến từ các thành phần tự nhiên và giàu protein, vitamin và khoáng chất, giúp cá phát triển khỏe mạnh và tăng cường sức đề kháng.', 155000, 5, 'Royal Canin', 'Earth petcare');
insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, MucGiamGia, NhaSanXuat, NhaCungCap) value ('Có',111,'Cám cá koi Kibakoi 2 trong 1', 'Cám cá koi Kibakoi 2 trong 1.jpg', 'Cám cá Kibakoi 2 trong 1 là một loại thức ăn chất lượng cao được thiết kế đặc biệt để cung cấp đầy đủ dinh dưỡng cho cá koi trong hồ ao của bạn. Đặc điểm nổi bật của cám này là tính đa dạng trong cung cấp dinh dưỡng, từ việc cung cấp nguồn protein cần thiết cho sự phát triển và tăng trưởng của cá, đến việc cung cấp các khoáng chất và vitamin giúp tăng cường sức khỏe và sắc đẹp cho cá koi..', 99000, 15, 'Kibakoi ', 'Việt petcare');
insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, MucGiamGia, NhaSanXuat, NhaCungCap) value ('Có',26,'(Date Xa) Combo 100 thanh súp thưởng cho mèo Shizuka thanh 15g', '(Date Xa) Combo 100 thanh súp thưởng cho mèo Shizuka thanh 15g.jpg', 'Thuộc dòng sản phẩm thức ăn hạt mềm cao cấp cho thú cưng. Thức ăn hạt mềm chó con Zenith Puppy được chế biến từ thịt cừu tươi, thịt nạc gà rút xương, khoai tây, gạo lứt, yến mạch và dầu cá hồi. Với các thành phần tươi sạch, giàu dinh dưỡng, Zenith Puppy hạt mềm, cung cấp độ ẩm cao và lượng muối thấp, thơm ngon, dễ nhai, dễ tiêu hóa và tốt cho sức khỏe chó con.',110000, 5,'PetVie','PetVie');
insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, MucGiamGia, NhaSanXuat, NhaCungCap) value ('Có',20,'Thức ăn cho mèo hạt Catsrang 1kg', 'Thức ăn cho mèo hạt Catsrang 1kg.jpg', 'Thức ăn dinh dưỡng dành riêng cho giống chó Poodle với hình dáng hạt được thiết kế đặc biệt dành riêng cho dòng chó này. Nhờ vào trình độ chuyên môn khoa học từ ROYAL CANIN và kinh nghiệm của các nhà nhân giống trên toàn thế giới, ROYAL CANIN POODLE được ra đời nhằm mang lại sự khác biệt:', 62000, 20, 'Royal Canin', 'Royal Canin');
insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, MucGiamGia, NhaSanXuat, NhaCungCap) value ('Có',31,'WHISKAS Thức Ăn Cho Mèo Trưởng Thành Dạng Hạt vị Cá Biển - 3kg', 'WHISKAS Thức Ăn Cho Mèo Trưởng Thành Dạng Hạt vị Cá Biển - 3kg.jpg', 'ưChó Mèo là động vật Ăn Thịt 🍖 
Thịt Xay Rau Củ Tươi Cho Chó Mèo - Raw Pet Food 🤩
Một chế độ bữa ăn RAW hoàn chỉnh cho chó mèo.', 150000, 5, 'Công ty TNHH FUSION GROUP', 'PetVie');
insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, NhaSanXuat, NhaCungCap) value ('Có',66,'mèo trưởng thành - mèo triệt sản - pate vị cá hồi', 'mèo trưởng thành - mèo triệt sản - pate vị cá hồi.png', 'Đối với chó yêu sữa đóng một vai trò rất quan trọng sau khi chào đời và trong cả quá trình phát triển sau này, sữa có thể cung cấp những dưỡng chất đặc biệt mà các thực phẩm khác không có.', 98000, 'Paddy pet shop', 'PURINA');
insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, NhaSanXuat, NhaCungCap) value ('Có',553,'mèo trưởng thành - mèo triệt sản - pate vị cá ngừ', 'mèo trưởng thành - mèo triệt sản - pate vị cá ngừ.png', 'Không có mô tả', 112000, 'Công ty TNHH FUSION GROUP','Công ty TNHH FUSION GROUP');
insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, NhaSanXuat, NhaCungCap) value ('Có',12,'mèo trưởng thành - sốt viên vị cá hồi & cá tuyết', 'mèo trưởng thành - sốt viên vị cá hồi & cá tuyết.png', '[Thức ăn đông lạnh] - Là một dạng thực phẩm được làm khô bằng cách đông lạnh ở nhiệt độ -36 độ C. Cung cấp dinh dưỡng phong phú cho mèo của bạn, bạn không cần phải lo lắng nữa về việc làm thịt khô cho mèo của bạn. Bite of Wild đã phát triển một sản phẩm đông lạnh bằng thịt tươi sạch, có giá trị dinh dưỡng rất cao, bạn có thể cho mèo ăn trực tiếp, tiện lợi và tiết kiệm thời gian của bạn..', 135000, 'PET SHOP UYTINPRO', 'Manchester');
insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, NhaCungCap, NhaSanXuat) value ('Có',1,'mèo trưởng thành - sốt viên vị cá hồi & tôm', 'mèo trưởng thành - sốt viên vị cá hồi & tôm.png', 'Thức ăn cho chó Ganador đáp ứng các yêu cầu dinh dưỡng của Hiệp hội các cơ quan quản lý thức ăn chăn nuôi Hoa Kỳ (AAFCO) và Liên đoàn công nghiệp thức ăn cho thú cưng của Châu Âu (FEDIAF)
Sản phẩm thức ăn cho thú cưng của Ganador được sản xuất theo các nguyên tắc về an toàn quốc tế HACCP (Phân tích mối nguy và điểm kiểm soát tới hạn) và tiêu chuẩn quốc tế ISO 9001:2015.', 87000, 'PET SHOP UYTINPRO', 'Nutricens');
insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, NhaCungCap, NhaSanXuat) value ('Có',6,'chó trưởng thành - pate vị bò', 'chó trưởng thành - pate vị bò.png', 'Hạt thức ăn cún cưng Captain được trộn theo công thức vàng 8-1 (8 phần hạt, đậu, rau củ: 1 phần thịt cá và phô mai) để cân bằng dinh dưỡng cho cún. Ngoài hạt ra, thành phần này có thể xem như là bánh thưởng kết hợp cho bé khi dùng bữa ăn chính.', 129000, 'PET SHOP UYTINPRO', 'Mars petcare');
insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, NhaCungCap, NhaSanXuat) value ('Có',100,'chó trưởng thành - pate vị gà', 'chó trưởng thành - pate vị gà.png', 'Lợi ích sức khỏe và dinh dưỡng:
- Giàu năng lượng & xương khớp chắc khỏe
- Sức khỏe tim mạch
- Hỗ trợ đường tiết niệu (urinary)
- Tiêu hóa tốt, dễ hấp thu dinh dưỡng
- Tăng cường hệ miễn dịch với công nghệ natural shield', 138000, 'Raw Pet Food', 'Nhà Sen - Thực Phẩm Thú Cưng');
insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, NhaCungCap, NhaSanXuat) value ('Có',200,'chó trưởng thành - pate vị gà tây', 'chó trưởng thành - pate vị gà tây.png', 'Những câu chuyện nhỏ xảy ra ở một ngôi làng nhỏ: chuyện người, chuyện cóc, chuyện ma, chuyện công chúa và hoàng tử , rồi chuyện đói ăn, cháy nhà, lụt lội,... Bối cảnh là trường học, nhà trong xóm, bãi tha ma. Dẫn chuyện là cậu bé 15 tuổi tên Thiều. Thiều có chú ruột là chú Đàn, có bạn thân là cô bé Mận. Nhưng nhân vật đáng yêu nhất lại là Tường, em trai Thiều, một cậu bé học không giỏi. Thiều, Tường và những đứa trẻ sống trong cùng một làng, học cùng một trường, có biết bao chuyện chung. Chúng nô đùa, cãi cọ rồi yêu thương nhau, cùng lớn lên theo năm tháng, trải qua bao sự kiện biến cố của cuộc đời.', 118000, 'Mars petcare', 'Pedigree');
insert into Food(HoTroTraHang,SoLuongDaBan,Ten, Anh, MoTa, Gia, NhaCungCap, NhaSanXuat) value ('Có',300,'chó trưởng thành - sốt viên vị bò', 'chó trưởng thành - sốt viên vị bò.png', '_', 87000, 'vietpet', 'ZENITH');
insert into Food(Ten, Anh, MoTa, Gia, NhaCungCap, NhaSanXuat) value ('Chó trưởng thành - sốt viên vị gà', 'Chó trưởng thành - sốt viên vị gà.png', '_', 129000, 'Pet Garden', 'Royal Canin');
insert into Food(Ten, Anh, MoTa, Gia, NhaCungCap, NhaSanXuat) value ('mèo con - sốt viên vị gà', 'mèo con - sốt viên vị gà.png', '_', 138000, 'Mars petcare', 'Pedigree');
insert into Food(Ten, Anh, MoTa, Gia, NhaCungCap, NhaSanXuat) value ('Chó con - pate vị gà', 'Chó con - pate vị gà.png', '_', 118000, '3F store', 'Me-o');
insert into Food(Ten, Anh, MoTa, Gia, MucGiamGia, NhaCungCap, NhaSanXuat) value ('Chó con - sốt viên vị gà', 'Chó con - sốt viên vị gà.png', '"THÀNH PHẦN: Corn, Poultry meal, Wheat, Soybean meal, Wheat bran, Poultry fat (source of Omega 6), Fish meal (source of Omega 3), Taurine, Minerals (Iron, Copper, Manganese, Zinc, Iodine, Selenium), Vitamins (A, D3, C, K3, B1, B2, B6, B12, PP, E (Tocopherol), Calcium D-Pantothenate, Biotin, Folic Acid, Choline), Sodium Disulfate, Monocalcium Phosphate, Calcium Carbonate, Sodium Chloride, Preservatives, Antioxidant, Palatants, Yucca schidigera extract.', 299000, 30, '3F store', 'Nutrience');
insert into Food(Ten, Anh, MoTa, Gia, MucGiamGia, NhaCungCap, NhaSanXuat) value ('[2kg] Hạt Royal Canin Mini Puppy Cho Chó Con Giống Nhỏ', '[2kg] Hạt Royal Canin Mini Puppy Cho Chó Con Giống Nhỏ.jpg', 'THÀNH PHẦN: Corn, Poultry meal, Wheat, Soybean meal, Wheat bran, Poultry fat (source of Omega 6), Fish meal (source of Omega 3), Taurine, Minerals (Iron, Copper, Manganese, Zinc, Iodine, Selenium), Vitamins (A, D3, C, K3, B1, B2, B6, B12, PP, E (Tocopherol), Calcium D-Pantothenate, Biotin, Folic Acid, Choline), Sodium Disulfate, Monocalcium Phosphate, Calcium Carbonate, Sodium Chloride, Preservatives, Antioxidant, Palatants, Yucca schidigera extract.', 84000, 5, '3F store', 'Nutrience');
insert into Food(Ten, Anh, MoTa, Gia, MucGiamGia, NhaCungCap, NhaSanXuat) value ('Thức ăn Hạt cho Chó CAPTAIN cho chó kén ăn, trộn Bò - Cá Hồi, Phô mai', 'Thức ăn Hạt cho Chó CAPTAIN cho chó kén ăn, trộn Bò - Cá Hồi, Phô mai.jpg', 'Thức Ăn Thú Cưng Keos được chế biến bằng công nghệ natural shield phát triển từ thảo dược thiên nhiên, tăng khả năng chống oxy hóa cho cơ thể thú cưng. Chiết xuất thực vật họ cam chanh chứa chất giảm oxy hóa ammonia, cân bằng hệ vi sinh vật đường ruột & tăng khả năng tiêu hóa. Cùng với đó là pectic-oligosscoharice - chất prebotic tự nhiên khi được vi sinh vật trong ruột phân hủy sẽ tạo ra axit béo chuỗi ngắn làm giảm cholesterol trong máu.', 86000, 12, 'Muchinshop', 'Minio');
insert into Food(Ten, Anh, MoTa, Gia, MucGiamGia, NhaCungCap, NhaSanXuat) value ('THỨC ĂN HẠT MỀM CHÓ TRƯỞNG THÀNH ZENITH ADULT', 'THỨC ĂN HẠT MỀM CHÓ TRƯỞNG THÀNH ZENITH ADULT.jpg', 'Lợi ích sức khỏe và dinh dưỡng:
- Giàu năng lượng & xương khớp chắc khỏe
- Sức khỏe tim mạch
- Hỗ trợ đường tiết niệu (urinary)
- Tiêu hóa tốt, dễ hấp thu dinh dưỡng
- Tăng cường hệ miễn dịch với công nghệ natural shield”.', 395000, 0, 'NNQ', 'Pro Pet');
insert into Food(Ten, Anh, MoTa, Gia, MucGiamGia, NhaCungCap, NhaSanXuat) value ('Hạt Mềm Cho Chó con Zenith Puppy', 'Hạt Mềm Cho Chó con Zenith Puppy.jpg', 'sử dụng những thành phần có chất lượng tốt nhất, có bổ sung Sữa, Dầu cá hồi, gìau DHA vàAxit béo Omega-3,Lecithin, giàu Colin, giúp tăng cường sự phát triển trí não và hệ thần kinh, tăng cường sức khỏe tim mạch.', 89000, 5, 'Bite of Wild', 'Bite of Wild');
select  food.ID ,
    food.Ten ,
    food.Anh ,
    food.MoTa ,
    food.Gia ,
    food.MucGiamGia ,
    food.SoLuongDaBan ,
    food.NhaCungCap ,
    food.NhaSanXuat ,
    food.DiemTrungBinh  from food,foodthuocdanhmuc,danhmuc where food.ID=foodthuocdanhmuc.IDFood and foodthuocdanhmuc.IDdanhmuc=danhmuc.ID and danhmuc.ten <> 'Thức ăn cho chó' ;
select* from food;
INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (3, 1);
INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (3, 2);

INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (2, 3);

INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (2, 4);

INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (2, 5);
INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (2, 6);

INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (2, 7);
INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (2, 8);

INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (2, 9);

INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (1, 10);

INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (1, 11);
INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (1, 12);

INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (1, 13);
INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (1, 14);

INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (2, 15);
INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (1, 16);
INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (1, 17);
INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (1, 18);
INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (1, 19);
INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (1, 20);
-- INSERT INTO FoodThuocDanhMuc (IDDanhMuc, IDFood) VALUES (1, 21);
-- select* from food
INSERT INTO KhachThemFood VALUE ('0903127256', 1, 2);
INSERT INTO KhachThemFood VALUE ('0903127256', 2, 3);
INSERT INTO KhachThemFood VALUE ('0913020447', 3, 1);
INSERT INTO KhachThemFood VALUE ('0913020447', 4, 2);

INSERT INTO NhanVien VALUE ('EMP0001', 'admin', '123456789', 'Nguyễn Văn A', '0908246578', 'nguyenvana@gmail.com', '5 Đinh Tiên Hoàng, phường Đa Kao, quận 1, TP.HCM', 'M');

insert into DanhGia value ('0903127256', 1, 4, 'Cún và mèo nhà m rất thích ăn loại này, okk ạ. Gói hàng đẹp giao nhanh');
insert into DanhGia value ('0913020447', 1, 3, 'Đóng gói chuẩn,giao hàng nhanh.Chất lượng sản phẩm thì ổn,giá cả cũng ổn hơn mấy chỗ khác.Nói chung là tạm hài lòng.Còn mốt có j thì quay lại sửa đánh giá sau vậy');
insert into DanhGia value ('0902764213' , 2, 5, 'giao hàng nhanh đống gối cẩn thận chất lượng cao và đúng trọng lượng hạt thơm bé bơ rất thích sẽ ủng hộ shop tiếp !');
insert into DanhGia value ('0909991573', 2, 2, 'Bao bì đẹp sản phẩm nhìn bắt mắt. Chó mẹ chó con chó cha đều rất thích. Chó rất thích ăn nên tốn tiền quá. Tranh thủ săn sale để mua được giá tốt cho 4 em nhà có thức ăn buổi sáng. Chó rất thích ăn nên ăn rất hao luôn');
insert into DanhGia value ('0903127256', 2, 3, 'Sản phẩm của shop cái nào cũng chất lượng cả, loại này thơm hơn loại chó lớn, chắc sẽ mua loại này cho bé ăn luôn vì vừa nhiều mà có vẻ bé thích hơn 👍');
insert into DanhGia value ('0913080299', 3, 5, 'Từng mua 1 lần rồi và lần này giảm giá nên mua tiếp, thức ăn chó con rất thích Mọi người nên mua thử');
insert into DanhGia value ('0909991573', 3, 3, 'Shop đóng gói kĩ lắm.
Hàng đúng chất lượng
Ủng hộ shop nhiều lần rồi.
Các bé lúc nhỏ ăn cho tới lúc lớn nhưng vẫn chỉ thích ăn loại này.');
insert into DanhGia value ('0913020447', 4, 4, 'Chất lượng giấy tốt, đóng gói kĩ càng.');
insert into DanhGia value ('0909991573', 5, 5, 'Chất lượng thì khỏi phải bàn rồi canh sale mua giá lại rẻ nữa lần nào mình cũng mua 2 đến 3 bịch về nên mn cứ yên tâm nha
');
insert into DanhGia value ('0913080299', 5, 5, 'Giao đủ hàng kèm quà tặng, hạt mình chưa cho ăn nên k biết các bạn nhà mình có ưng ăn k, nhưng bánh thưởng thì ăn hết');
insert into DanhGia value ('0913020447', 6, 5, 'Mua về mấy e mèo nhà mình rất thích,đổ ra bao nhiêu ăn hết bấy nhiêu,mà lại rẻ hơn mấy loại ở gần nhà , nên mua nhé ae....
');
insert into DanhGia value ('0909991573', 6, 5, 'Mình đã nhận được hàng , đóng gói cẩn thận ✌️, gh nhanh nữa . Đồ ăn cho mèo lại ok , mèo nhà m thích lắm
');
insert into DanhGia value ('0909991573', 7, 2, 'Giao hàng siêu nhanh
Đóng gói quá cẩn thận ,chắc chắn
Sẽ ủng hộ shop lâu dà');
insert into DanhGia value ('0902764213', 7, 3, ' Hạt nhỏ hơi mềm và có mùi thơm nhẹ của thức ăn hỗn hợp , mong là bé sẽ thích');
insert into DanhGia value ('0903127256', 8, 4, 'Hàng giao rất nhanh và đóng gói cẩn thận, shop phục vụ nhiệt tình, mình thấy chó nhà mình ăn lúc ít lúc nhiều nên mình cũng không biết nó thích hay không');
insert into DanhGia value ('0913020447', 8, 5, 'Mua lại lần 2 của shop. Giá vẫn đang ok nhé. Giao hàng nhanh. Vẫn cứ đóng gói cẩn thận. Video cún nhà mình ăn đấy. Hạt mềm nhỏ dễ ăn');

insert into DonHang(SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) value ('0903127256', 98000, '2021-12-01 00:00:00', 'Chờ thanh toán', 'TPHCM');
insert into DonHang(SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) value ('0903127256', 98000, '2021-12-02 00:00:00', 'Đang xử lý', 'TPHCM');
insert into DonHang(SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) value ('0903127256', 98000, '2021-12-03 00:00:00', 'Đã hủy', 'TPHCM');
insert into DonHang(SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) value ('0903127256', 98000, '2021-12-04 00:00:00', 'Đang giao', 'TPHCM');
insert into DonHang(SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) value ('0903127256', 98000, '2021-12-05 00:00:00', 'Đã giao', 'TPHCM');

insert into DonHangCoFood(IDDonHang, IDFood, SoLuong, TongTien) value (1, 6, 1, 98000);
insert into DonHangCoFood(IDDonHang, IDFood, SoLuong, TongTien) value (2, 6, 1, 98000);
insert into DonHangCoFood(IDDonHang, IDFood, SoLuong, TongTien) value (3, 6, 1, 98000);
insert into DonHangCoFood(IDDonHang, IDFood, SoLuong, TongTien) value (4, 6, 1, 98000);
insert into DonHangCoFood(IDDonHang, IDFood, SoLuong, TongTien) value (5, 6, 1, 98000);
-- select * from khachhang
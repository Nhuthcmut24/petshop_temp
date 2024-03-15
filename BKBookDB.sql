
DROP DATABASE BKBOOK;
CREATE DATABASE BKBOOK;
USE BKBOOK;
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

CREATE TABLE Sach (
    ID INT AUTO_INCREMENT,
    Ten VARCHAR(255) NOT NULL,
    Anh VARCHAR(255) NOT NULL,
    MoTa TEXT(65535) NOT NULL,
    Gia INT NOT NULL,
    MucGiamGia INT DEFAULT 0,
    SoLuongDaBan INT,
    NXB VARCHAR(255) DEFAULT 'BKBook',
    TacGia VARCHAR(255) DEFAULT 'Anonymous',
    DiemTrungBinh FLOAT,
    PRIMARY KEY (ID)
);

CREATE TABLE SachThuocDanhMuc(
    IDDanhMuc INT NOT NULL,
    IDSach INT NOT NULL,
    PRIMARY KEY (IDDanhMuc, IDSach)
);
ALTER TABLE SachThuocDanhMuc
ADD CONSTRAINT FK__SachThuocDanhMuc_DanhMuc FOREIGN KEY (IDDanhMuc) REFERENCES DanhMuc(ID),
ADD CONSTRAINT FK__SachThuocDanhMuc_Sach FOREIGN KEY (IDSach) REFERENCES Sach(ID);

CREATE TABLE KhachThemSach (
    SoDienThoai CHAR(10) NOT NULL,
    IDSach INT NOT NULL,
    SoLuong INT NOT NULL,
    PRIMARY KEY(SoDienThoai, IDSach)
);
ALTER TABLE KhachThemSach
ADD CONSTRAINT FK__ThemSach_SDT FOREIGN KEY (SoDienThoai) REFERENCES KhachHang(SoDienThoai),
ADD CONSTRAINT FK__ThemSach_ID FOREIGN KEY (IDSach) REFERENCES Sach(ID);

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

CREATE TABLE DonHangCoSach(
    IDDonHang INT NOT NULL,
    IDSach INT NOT NULL,
    SoLuong INT,
    TongTien INT,
    PRIMARY KEY (IDDonHang, IDSach)
);
ALTER TABLE DonHangCoSach
ADD CONSTRAINT FK__DHCS__IDDonHang FOREIGN KEY (IDDonHang) REFERENCES DonHang(ID),
ADD CONSTRAINT FK__DHCS__IDSach FOREIGN KEY (IDSach) REFERENCES Sach(ID);

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
    IDSach INT NOT NULL,
    SoSao INT,
    MoTa TEXT(65535),
    PRIMARY KEY(SoDienThoai, IDSach)
);
ALTER TABLE DanhGia
ADD CONSTRAINT FK__DanhGia_SDT FOREIGN KEY (SoDienThoai) REFERENCES KhachHang(SoDienThoai),
ADD CONSTRAINT FK__DanhGia_IDSach FOREIGN KEY (IDSach) REFERENCES Sach(ID);

DELIMITER //

CREATE FUNCTION TongTien(SDT CHAR(10)) RETURNS INT READS SQL DATA
BEGIN
    DECLARE total INT;
    SELECT SUM(S.Gia * KTS.SoLuong) INTO total
    FROM KhachThemSach KTS
    INNER JOIN Sach S ON KTS.IDSach = S.ID
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
WHERE IDSach = NEW.IDSach;

IF SoDanhGia > 0 THEN
    UPDATE SACH SET DiemTrungBinh = TongDiem / SoDanhGia WHERE ID = NEW.IDSach;
END IF;
END //


CREATE PROCEDURE CapNhatSoLuongSachTrongGioHang(
    p_SoDienThoai CHAR(10),
    p_IDSach INT,
    p_SoLuong INT
)
BEGIN
    DECLARE existingQuantity INT;
    DECLARE newQuantity INT;

    SET existingQuantity = (SELECT SoLuong FROM KhachThemSach WHERE SoDienThoai = p_SoDienThoai AND IDSach = p_IDSach);
    SET newQuantity = (existingQuantity + p_SoLuong); 
    UPDATE KhachThemSach SET SoLuong = newQuantity WHERE SoDienThoai = p_SoDienThoai AND IDSach = p_IDSach;

END //

CREATE PROCEDURE ThemSachVaoGioHang(
    p_SoDienThoai CHAR(10),
    p_IDSach INT,
    p_SoLuong INT
)
BEGIN
    -- Nếu sách chưa có trong giỏ hàng, thêm mới vào
    IF p_IDSach NOT IN (SELECT IDSach FROM KhachThemSach WHERE SoDienThoai = p_SoDienThoai) THEN
        -- Thêm sách vào giỏ hàng
        INSERT INTO KhachThemSach(SoDienThoai, IDSach, SoLuong) VALUE (p_SoDienThoai, p_IDSach, p_SoLuong);

    ELSE
        -- Nếu sách đã có trong giỏ hàng, gọi thủ tục cập nhật số lượng
        CALL CapNhatSoLuongSachTrongGioHang(p_SoDienThoai, p_IDSach, p_SoLuong);
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
    
    INSERT INTO DonHangCoSach (IDDonHang, IDSach, SoLuong, TongTien)
    SELECT IDDonHang, IDSach, SoLuong, (Gia * (100 - MucGiamGia) / 100) * SoLuong
    FROM KhachThemSach KTS
    JOIN Sach S ON KTS.IDSach = S.ID
    WHERE KTS.SoDienThoai = p_SoDienThoai;
    
    DELETE FROM KhachThemSach WHERE SoDienThoai = p_SoDienThoai;
    
END //

DELIMITER ;

INSERT INTO KhachHang VALUE ('tienhuynh', '0903127256', '12345678', 'Huỳnh Văn Tiến', '2000/05/06', 'M', 'huynhvtien@gmail.com', '64 Nguyễn Đình Chính, P15, Q.Phú Nhuận, TP.HCM', NOW(), NOW());
INSERT INTO KhachHang VALUE ('huyentran', '0913080299', '12345678', 'Trần Thị Huyền', '1993/08/12', 'F', 'huyentran@gmail.com', '356/11 Bạch Đằng, P14, Q.Bình Thạnh, TP.HCM', NOW(), NOW());
INSERT INTO KhachHang VALUE ('phamvbinh', '0909991573', '12345678', 'Phạm Văn Bình', '1998/02/03', 'M', 'binhphamvan@gmail.com', '36 Bùi Văn Thêm, P9, Q.Phú Nhuận, TP.HCM', NOW(), NOW());
INSERT INTO KhachHang VALUE ('quynh2507', '0902764213', '12345678', 'Nguyễn Ngọc Quỳnh', '1995/07/25', 'F', 'nguyenquynh@gmail.com', '313 Phạm Văn Chiêu, P14, Q.Gò Vấp, TP.HCM', NOW(), NOW());
INSERT INTO KhachHang VALUE ('dat2203', '0913020447', '12345678', 'Trương Thành Đạt', '2001/03/22', 'M', 'truongtdat@gmail.com', '242 Lý Thường Kiệt, P14, Q.10, TP.HCM', NOW(), NOW());

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

insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, TacGia, NXB) value ('Essential Grammar in Use', 'grammar.webp', 'Essential Grammar in Use is a self-study reference and practice book for elementary-level learners (A1-B1), used by millions of people around the world. With clear examples, easy-to-follow exercises and answer key, the Fourth edition is perfect for independent study, covering all the areas of grammar that you will need at this level. The book has an easy-to-use format of two-page units with clear explanations of grammar points on the left-hand page, and practice exercises on the right. It also includes plenty of additional exercises and a Study Guide to help you find the grammar units you need to study.', 155000, 5, 'Raymond Murphy', 'Cambridge University');
insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, TacGia, NXB) value ('Kế toán vỉa hè', 'ktvh.png', 'Kế toán và tài chính là nỗi đau chung của rất nhiều doanh nghiệp nhỏ. Ngôn ngữ tài chính dường như là điều bí ẩn nhất của thế giới. Vô số tính toán và ý đồ được cài cắm sau các con số, mà thậm chí người kinh doanh nhiều năm cũng không thể nào bóc tách nổi. Nếu bạn vẫn cảm thấy mù mờ với bảng báo cáo tài chính của mình thì thật là đáng tiếc. Tài chính được xem như là ngôn ngữ của kinh doanh.', 99000, 10, 'Darrell Mullis, Judith Orloff', 'Thế Giới');
insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, TacGia, NXB) value ('Điều kỳ diệu của tiệm tạp hóa Namiya', 'namiya.jpg', 'Một đêm vội vã lẩn trốn sau phi vụ khoắng đồ nhà người, Atsuya, Shota và Kouhei đã rẽ vào lánh tạm trong một căn nhà hoang bên con dốc vắng người qua lại. Căn nhà có vẻ khi xưa là một tiệm tạp hóa với biển hiệu cũ kỹ bám đầy bồ hóng, khiến người ta khó lòng đọc được trên đó viết gì. Định bụng nghỉ tạm một đêm rồi sáng hôm sau chuồn sớm, cả ba không ngờ chờ đợi cả bọn sẽ là một đêm không ngủ, với bao điều kỳ bí bắt đầu từ một phong thư bất ngờ gửi đến…', 78000, 15, 'Higashino Keigo','NXB Hội Nhà Văn');
insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, TacGia, NXB) value ('Ỷ thiên đồ long ký', 'yThien.jpg', 'Ẩn giấu pho võ công thượng đẳng Cửu Âm Chân Kinh và bộ Võ Mục Di Thư lừng lẫy, Ỷ Thiên kiếm và Đồ Long đao đã gây nên những cuộc tranh giành không hồi kết giữa các bang phái võ lâm. Người cần đao để trả thù, người lại muốn giưong danh với thế nhân, kẻ tham vọng hiệu triệu cả thiên hạ. Giữa lúc triều đình nhà Nguyên hủ bại đang ra sức bóc lột nhân dân và đàn áp các bang phái trong giang hồ, sứ mạng tái thiết trật tự được đặt vào tay những người thành tâm và hùng tâm mà Trương Vô Kỵ là nhân vật tiêu biểu. Vô Kỵ sẽ thống nhất các bang phái như thế nào để hiệp tâm đánh bại quân Mông Cổ? Bí quyết ẩn giấu trong hai báu vật sẽ giúp Vô Kỵ ra sao? Hãy khám phá bí mật trong 40 hồi Ỷ Thiên Đồ Long Ký.', 62000, 10, 'Kim Dung', 'NXB Văn Học');
insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, TacGia, NXB) value ('Về nơi có nhiều cánh đồng', 'vncncd.jpg', 'Về nơi có nhiều cánh đồng à cuốn du ký hoạ mới nhất của Lê Phan (Câu lạc bộ nghiên cứu bí ẩn, Xứ Mèo). Đây là tuyển tập ghi chép bằng tranh những câu chuyện thú vị trong hành trình di cư từ thành thị đến thung lũng Têu-y-pot trong lòng núi Ngọc Linh (Kon Tum) của Phan và các bạn trẻ thuộc INDIgo home.', 150000, 5, 'Phan', 'Thanh Niên');
insert into Sach(Ten, Anh, MoTa, Gia, TacGia, NXB) value ('Ngày xưa có một chuyện tình', 'nxc1ct.jpg', 'NGÀY XƯA CÓ MỘT CHUYỆN TÌNH là tác phẩm mới tinh thứ 2 trong năm 2016 của nhà văn Nguyễn Nhật Ánh dài hơn 300 trang, được coi là tập tiếp theo của tập truyện Mắt biếc. Có một tình yêu dữ dội, với em, của một người yêu em hơn chính bản thân mình - là anh.', 98000, 'Nguyễn Nhật Ánh', 'NXB Trẻ');
insert into Sach(Ten, Anh, MoTa, Gia, TacGia, NXB) value ('Toán cao cấp tập 1', 'toancc.webp', 'Không có mô tả', 112000, 'Nguyễn Đình Trí ( Chủ biên) - Tạ Văn Đĩnh - Nguyễn Hồ Quỳnh',' NXB Giáo Dục Việt Nam');
insert into Sach(Ten, Anh, MoTa, Gia, TacGia, NXB) value ('Osho - Tự tôn', 'osho-tu-ton.jpg', 'Tự tôn là cuốn sách dẫn đường giúp những linh hồn đang lạc lối tìm lại được điều quan trọng nhất: bản thể chân thật của chính mình. Khi học được cách tôn trọng bản thân đúng nghĩa, chúng ta sẽ thoát khỏi mọi gông cùm về tư tưởng để tự do tung cánh, được bộc lộ trọn vẹn tính cách và năng lượng cá nhân, cũng như sống hòa hợp với tập thể, thanh thản trước mọi thăng trầm của cuộc đời.', 135000, 'Osho', 'NXB Lao Động');
insert into Sach(Ten, Anh, MoTa, Gia, NXB, TacGia) value ('Bảy bước tới mùa hè', 'baybuoctoimuahe.jpg', 'Câu chuyện về một mùa hè ngọt ngào, những trò chơi nghịch ngợm và bâng khuâng tình cảm tuổi mới lớn. Chỉ vậy thôi nhưng chứng tỏ tác giả đúng là nhà kể chuyện hóm hỉnh, khiến đọc cuốn hút từ tựa đến trang cuối cùng, có lẽ chính vì giọng văn giản dị và trong trẻo của Nguyễn Nhật Ánh, và kết thúc thì có hậu đầy thuyết phục. Câu chuyện cho tuổi học trò, đọc xong là thấy ngập lên khao khát quay về một thời thơ bé, với tình thầy trò, bè bạn, tình xóm giềng, họ hàng, qua cách nhìn đời nhẹ nhõm, rộng lượng. Cuốn sách này nhà văn đề tặng “Những năm tháng ấu thơ”, tặng các bạn thời nhỏ, cũng là tặng bạn đọc thân thiết của mình.', 87000, 'Nhà xuất bản Trẻ', 'Nguyễn Nhật Ánh');
insert into Sach(Ten, Anh, MoTa, Gia, NXB, TacGia) value ('Bong bóng lên trời', 'bongbonglentroi.jpg', 'Thường - cậu bé bán kẹo kéo và Tài Khôn - cô bé bán bong bóng, hai đứa trẻ còn đang ở tuổi ăn học nhưng đã phải hàng ngày mưu sinh nơi góc chợ ồn ào. Giữa chốn náo nhiệt, tâm hồn đồng điệu của hai đứa trẻ đã giúp chúng an ủi nhau và nuôi dưỡng ước mơ về một tương lai tốt đẹp hơn. Hiện thực khắc nghiệt của cuộc sống trong truyện như làm nền cho hai tâm hồn đẹp và tràn đầy ước mơ của Thường và Tài Khôn hiện ra. Sự chững chạc của cậu bé Thường, sự trong trẻo, hồn nhiên cùng niềm lạc quan, yêu đời của cô bé Tài Khôn như dòng suối mát lành có thể làm mềm cả những trái tim gai góc nhất. Những khát vọng trong trẻo của hai đứa trẻ không bao giờ tắt, như chùm bong bóng đầy màu sắc vút bay lên trời cao.', 129000, 'Nhà xuất bản Trẻ', 'Nguyễn Nhật Ánh');
insert into Sach(Ten, Anh, MoTa, Gia, NXB, TacGia) value ('Mắt biếc 2019', 'matbiec2019.jpg', 'Mắt Biếc (Tái Bản 2019). Mắt biếc là một tác phẩm được nhiều người bình chọn là hay nhất của nhà văn Nguyễn Nhật Ánh. Tác phẩm này cũng đã được dịch giả Kato Sakae dịch sang tiếng Nhật để giới thiệu với độc giả Nhật Bản. “Tôi gửi tình yêu cho mùa hè, nhưng mùa hè không giữ nổi. Mùa hè chỉ biết ra hoa, phượng đỏ sân trường và tiếng ve nỉ non trong lá. Mùa hè ngây ngô, giống như tôi vậy. Nó chẳng làm được những điều tôi ký thác. Nó để Hà Lan đốt tôi, đốt rụi. Trái tim tôi cháy thành tro, rơi vãi trên đường về.”', 138000, 'Nhà xuất bản Trẻ', 'Nguyễn Nhật Ánh');
insert into Sach(Ten, Anh, MoTa, Gia, NXB, TacGia) value ('Tôi thấy hoa vàng trên cỏ xanh', 'toithayhoavangtrencoxanh.jpg', 'Những câu chuyện nhỏ xảy ra ở một ngôi làng nhỏ: chuyện người, chuyện cóc, chuyện ma, chuyện công chúa và hoàng tử , rồi chuyện đói ăn, cháy nhà, lụt lội,... Bối cảnh là trường học, nhà trong xóm, bãi tha ma. Dẫn chuyện là cậu bé 15 tuổi tên Thiều. Thiều có chú ruột là chú Đàn, có bạn thân là cô bé Mận. Nhưng nhân vật đáng yêu nhất lại là Tường, em trai Thiều, một cậu bé học không giỏi. Thiều, Tường và những đứa trẻ sống trong cùng một làng, học cùng một trường, có biết bao chuyện chung. Chúng nô đùa, cãi cọ rồi yêu thương nhau, cùng lớn lên theo năm tháng, trải qua bao sự kiện biến cố của cuộc đời.', 118000, 'Nhà xuất bản Trẻ', 'Nguyễn Nhật Ánh');
insert into Sach(Ten, Anh, MoTa, Gia, NXB, TacGia) value ('Hiệp khách hàng 1', 'hkht1.jpg', '_', 87000, 'Nhà xuất bản Kim Đồng', 'Kim Dung');
insert into Sach(Ten, Anh, MoTa, Gia, NXB, TacGia) value ('Lộc đỉnh ký tập 1', 'ldkt1_2.jpg', '_', 129000, 'Nhà xuất bản Kim Đồng', 'Kim Dung');
insert into Sach(Ten, Anh, MoTa, Gia, NXB, TacGia) value ('Lộc đỉnh ký 1', 'ldkt1.jpg', '_', 138000, 'Nhà xuất bản Kim Đồng', 'Kim Dung');
insert into Sach(Ten, Anh, MoTa, Gia, NXB, TacGia) value ('Thiên long bát bộ tập 1', 'tlbbt1.jpg', '_', 118000, 'Nhà xuất bản Kim Đồng', 'Kim Dung');
insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, NXB, TacGia) value ('Nguồn Cội', 'nguoncoi.jpg', '"Robert Langdon, giáo sư biểu tượng và biểu tượng tôn giáo đến từ trường đại học Harvard, đã tới Bảo tàng Guggenheim Bilbao để tham dự một sự kiện quan trọng - công bố một phát hiện "sẽ thay đổi bộ mặt khoa học mãi mãi".', 299000, 30, 'NXB Lao Động', 'Dan Brown');
insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, NXB, TacGia) value ('Nguyên lý của các hệ cơ sở dữ liệu', 'NguyenLyHCSDL.jpg', 'Giáo trình giới thiệu các kiến thức cơ bản về Hệ cơ sở dữ liệu dành cho sinh viên bậc Cao Đẳng - Đại học.', 84000, 5, 'NXB ĐHQG Hà Nội', 'Nguyễn Kim Anh');
insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, NXB, TacGia) value ('Chúng Ta Rồi Sẽ Hạnh Phúc, Theo Những Cách Khác Nhau', 'chungtaroisehp.jpg', 'CHÚNG TA RỒI SẼ HẠNH PHÚC, THEO NHỮNG CÁCH KHÁC NHAU là một lời nhắn nhủ của tác giả Thảo Thảo đến tất cả mọi người rằng mỗi chúng ta đều là một cá thể duy nhất trong vũ trụ bao la rộng lớn, đừng bao giờ cho người khác quyền mang lại niềm vui hay nỗi buồn cho bạn. Hãy sống với những gì bạn muốn, làm nhũng gì bạn cho là đúng, bởi nếu cứ sống vì người khác, bạn sẽ đánh mất những-gì-đặc-biệt-nhất của bản thân mình.', 86000, 12, 'NXB Văn học', 'Thanh Thảo');
insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, NXB, TacGia) value ('Chuyện Kể Rằng Có Nàng Và Tôi', 'nangvatoi.jpg', 'Đối với những người trẻ được sống như ý không phải lúc nào cũng dễ dàng, đặc biệt với những người đã phải trải qua một quãng thời gian khó khăn rồi mới có thể tìm được con người thật của mình, là chính mình. Những câu chuyện tình của họ có nhiều dang dở vì những mặc cảm, rào cản, khao khát được làm điều mình muốn, gắn bó với người mình yêu thương cả đời là các mong ước nhỏ trong lòng. Để rồi khi không thể giãi bày cùng ai, họ mang những điều thầm kín thổi vào những vần thơ nơi chỉ có những “câu chuyện về nàng và tôi”.', 72000, 10, 'NXB Phụ Nữ Việt Nam', 'Nhiều tác giả');
insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, NXB, TacGia) value ('Mẹ làm gì có ước mơ', 'melamgicouocmo.jpg', 'Bạn có bao giờ hỏi ước mơ của bố mẹ là gì? Hoặc dù có hỏi bố mẹ cũng chỉ trả lời qua loa như “Làm gì có…”. Nhưng bạn biết không, làm gì có ai trên thế giới này không có ước mơ cơ chứ, chỉ là ước mơ của bố mẹ chúng ta được cất giấu rất sâu trong tim và đánh đổi bằng nụ cười của những đứa con mà thôi. Tại sao mẹ lại chẳng có nổi một ước mơ cho riêng mình? Phải chăng gánh vai mẹ đã quá mỏi mệt với cơm áo gạo tiền, với những bữa ăn và học phí của con. À không, mẹ có ước mơ đấy chứ. Mẹ ước mơ có một người bố, rồi mẹ cho nó cả một gia đình. Mẹ ước mơ được tới trường, nên mẹ cho nó học con chữ. Mẹ ước mơ được một bữa no, nên dẫu có phải đi làm vất vả khổ cực đến đâu mẹ cũng cho nó được bữa cơm ngon. Chỉ khác một điều, ước mơ của mẹ là các con mất rồi.', 89000, 5, 'NXB Văn Học', 'Hạ Mer');
insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, NXB, TacGia) value ('Nhà giả kim (Tái bản 2020)', 'nhagiakim.jpg', 'Tiểu thuyết Nhà giả kim của Paulo Coelho như một câu chuyện cổ tích giản dị, nhân ái, giàu chất thơ, thấm đẫm những minh triết huyền bí của phương Đông. Trong lần xuất bản đầu tiên tại Brazil vào năm 1988, sách chỉ bán được 900 bản. Nhưng, với số phận đặc biệt của cuốn sách dành cho toàn nhân loại, vượt ra ngoài biên giới quốc gia, Nhà giả kim đã làm rung động hàng triệu tâm hồn, trở thành một trong những cuốn sách bán chạy nhất mọi thời đại, và có thể làm thay đổi cuộc đời người đọc.', 79000, 20, 'NXB Hội Nhà Văn', 'Paulo Coelho');
insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, NXB, TacGia) value ('Giáo Trình Chuẩn HSK 1 (Tái Bản 2022)', 'HSK1.jpg', 'Giáo Trình Chuẩn HSK 1 (Tái Bản 2022)', 198000, 25, 'NXB Tổng Hợp TPHCM', 'Khương Lệ Bình');
insert into Sach(Ten, Anh, MoTa, Gia, MucGiamGia, NXB, TacGia) value ('Cambridge IELTS 17 Academic With Answers (Savina)', 'ielts17.jpg', 'Với đầy đủ 4 kỹ năng listening, reading, writing, speaking cùng với answer keys, Cambridge IELTS 17 sẽ cung cấp những kiến thức đầy đủ từ cấu trúc bài thi, các modul cần thiết, bài mẫu hay các kĩ năng cần thiết giúp bạn có thể sẵn sàng bước vào kì thi IELTS với những trải nghiệm tốt nhất, sát với thực tế nhất.', 230000, 3, 'Cambridge University', 'Cambridge');

INSERT INTO SachThuocDanhMuc VALUE (8,1);
INSERT INTO SachThuocDanhMuc VALUE (9,1);
INSERT INTO SachThuocDanhMuc VALUE (8,2);
INSERT INTO SachThuocDanhMuc VALUE (3,3);
INSERT INTO SachThuocDanhMuc VALUE (3,4);
INSERT INTO SachThuocDanhMuc VALUE (4,4);
INSERT INTO SachThuocDanhMuc VALUE (3,5);
INSERT INTO SachThuocDanhMuc VALUE (2,6);
INSERT INTO SachThuocDanhMuc VALUE (8,7);
INSERT INTO SachThuocDanhMuc VALUE (10,7);
INSERT INTO SachThuocDanhMuc VALUE (8,8);
INSERT INTO SachThuocDanhMuc VALUE (2,9);
INSERT INTO SachThuocDanhMuc VALUE (2,10);
INSERT INTO SachThuocDanhMuc VALUE (2,11);
INSERT INTO SachThuocDanhMuc VALUE (3,11);
INSERT INTO SachThuocDanhMuc VALUE (3,12);
INSERT INTO SachThuocDanhMuc VALUE (1,13);
INSERT INTO SachThuocDanhMuc VALUE (3,13);
INSERT INTO SachThuocDanhMuc VALUE (1,14);
INSERT INTO SachThuocDanhMuc VALUE (3,14);
INSERT INTO SachThuocDanhMuc VALUE (1,15);
INSERT INTO SachThuocDanhMuc VALUE (3,15);
INSERT INTO SachThuocDanhMuc VALUE (1,16);
INSERT INTO SachThuocDanhMuc VALUE (3,16);
INSERT INTO SachThuocDanhMuc VALUE (3,17);
INSERT INTO SachThuocDanhMuc VALUE (8,18);
INSERT INTO SachThuocDanhMuc VALUE (10,18);
INSERT INTO SachThuocDanhMuc VALUE (1,19);
INSERT INTO SachThuocDanhMuc VALUE (1,20);
INSERT INTO SachThuocDanhMuc VALUE (1,21);
INSERT INTO SachThuocDanhMuc VALUE (3,22);
INSERT INTO SachThuocDanhMuc VALUE (8,23);
INSERT INTO SachThuocDanhMuc VALUE (9,23);
INSERT INTO SachThuocDanhMuc VALUE (8,24);
INSERT INTO SachThuocDanhMuc VALUE (9,24);

INSERT INTO KhachThemSach VALUE ('0903127256', 1, 2);
INSERT INTO KhachThemSach VALUE ('0903127256', 2, 3);
INSERT INTO KhachThemSach VALUE ('0913020447', 3, 1);
INSERT INTO KhachThemSach VALUE ('0913020447', 4, 2);

INSERT INTO NhanVien VALUE ('EMP0001', 'admin', '123456789', 'Nguyễn Văn A', '0908246578', 'nguyenvana@gmail.com', '5 Đinh Tiên Hoàng, phường Đa Kao, quận 1, TP.HCM', 'M');

insert into DanhGia value ('0903127256', 1, 4, 'Đóng gói đẹp, sách mới.');
insert into DanhGia value ('0913020447', 1, 3, 'Sách bị nhăn, đóng gói chưa tốt');
insert into DanhGia value ('0902764213' , 2, 5, 'Mình là đứa không thích những con số, và khi đọc xong sách này, đương nhiên mình vẫn chưa thích, nhưng ít ra đã giúp mình có cái nhìn tổng quan và chi tiết hơn những điều trước nay mình nghĩ rằng "rất khó"..');
insert into DanhGia value ('0909991573', 2, 2, 'Nội dung ko hay, ko hữu ích');
insert into DanhGia value ('0903127256', 2, 3, 'Sách cung cấp một khối lượng kiến thức cơ bản về kế toán. Đọc sách cũng rất thú vị. Đọc sách giống như đang học một môn học vậy');
insert into DanhGia value ('0913080299', 3, 5, 'Sách còn mới toanh, không bị quăn góc, giao hàng khá nhanh. Mình đã đọc khá nhiều cuốn của Bác Keigo và phải nói là bị mê bởi lối hành văn sâu sắc, súc tích và rất thu hút của bác. Đã đọc rồi là phải đọc cho bằng hết. Mình nghe danh cuốn này đã lâu, giờ quyết định mua đọc thử xem như thế nào! Mong là sẽ có một trải nghiệm đọc thật tốt như mình kì vọng! ');
insert into DanhGia value ('0909991573', 3, 3, 'bị móp sách rùi, ko có bookmark .');
insert into DanhGia value ('0913020447', 4, 4, 'Chất lượng giấy tốt, đóng gói kĩ càng.');
insert into DanhGia value ('0909991573', 5, 5, 'Giao hàng nhanh. Sách đẹp.');
insert into DanhGia value ('0913080299', 5, 5, 'Nội dung hay ý nghĩa.');
insert into DanhGia value ('0913020447', 6, 5, 'sách chất lượng có tặng kèm bookmark.');
insert into DanhGia value ('0909991573', 6, 5, 'Sách chữ rõ, bìa đẹp, giấy tốt. Đóng gói cẩn thận, giao hàng nhanh.');
insert into DanhGia value ('0909991573', 7, 2, 'Sách hơi cũ, cách tiếp cận các kiến thức khá khó hiểu.');
insert into DanhGia value ('0902764213', 7, 3, 'Chất lượng giấy kém, nội dung ổn.');
insert into DanhGia value ('0903127256', 8, 4, 'sách đóng gói cẩn thận và giao hàng nhanh, rất hài lòng .');
insert into DanhGia value ('0913020447', 8, 5, 'Tuyệt vời!');

insert into DonHang(SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) value ('0903127256', 98000, '2021-12-01 00:00:00', 'Chờ thanh toán', 'TPHCM');
insert into DonHang(SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) value ('0903127256', 98000, '2021-12-02 00:00:00', 'Đang xử lý', 'TPHCM');
insert into DonHang(SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) value ('0903127256', 98000, '2021-12-03 00:00:00', 'Đã hủy', 'TPHCM');
insert into DonHang(SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) value ('0903127256', 98000, '2021-12-04 00:00:00', 'Đang giao', 'TPHCM');
insert into DonHang(SoDienThoai, TongTien, NgayTao, XacNhan, DiaChi) value ('0903127256', 98000, '2021-12-05 00:00:00', 'Đã giao', 'TPHCM');

insert into DonHangCoSach(IDDonHang, IDSach, SoLuong, TongTien) value (1, 6, 1, 98000);
insert into DonHangCoSach(IDDonHang, IDSach, SoLuong, TongTien) value (2, 6, 1, 98000);
insert into DonHangCoSach(IDDonHang, IDSach, SoLuong, TongTien) value (3, 6, 1, 98000);
insert into DonHangCoSach(IDDonHang, IDSach, SoLuong, TongTien) value (4, 6, 1, 98000);
insert into DonHangCoSach(IDDonHang, IDSach, SoLuong, TongTien) value (5, 6, 1, 98000);

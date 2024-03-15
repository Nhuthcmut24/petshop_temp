import styles from '../Styles/Quanlisanpham.module.css';
import React , {useState} from 'react';
import Header from '../Component/logHeader.js';
import Footer from '../Component/Footer.js';
import Sidebar from '../Component/sideBarAdmin.js';
import Table from 'react-bootstrap/Table';
import namiya from '../images/namiya.jpg';
import nxc1ct from '../images/nxc1ct.jpg';
import vncncd from '../images/vncncd.jpg';
import yThien from '../images/yThien.jpg';
import osho from '../images/osho-tu-ton.jpg';
import toancc from '../images/toancc.webp';
import grammar from '../images/grammar.webp';
import ketoanviahe from '../images/ktvh.png';
import nonggian from '../images/nglbn.webp';
import tddn from '../images/tddn.jpg';
import tiengnguoitrongvan from '../images/tiengnguoitrongvan.jpg';
import voting from '../images/voting.png';
import {
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  Row,
  Col,
} from "react-bootstrap";
function Quanlisanpham(){
  const [products, setProducts] = useState([]);
  fetch('http://localhost:3001/api/getBooksForHomePage')
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error('Error fetching books:', error));
    // const data = [
    //     {TenSach: 'Kế Toán Vỉa Hè', Anh: ketoanviahe, NhaXuatBan: 'BKBook', GiaGoc: '99.000đ', TacGia: 'Anoymous',SoLuongDaBan:'20', SoLuongConLai:'30',MucGiamGia:'10%',DiemTrungBinh:'9.0' },
    //     {TenSach: 'Ỷ Thiên Đồ Long Ký', Anh: yThien, NhaXuatBan: 'BKBook', GiaGoc: '55.800đ', TacGia: 'KimDung',SoLuongDaBan:'18', SoLuongConLai:'32',MucGiamGia:'10%',DiemTrungBinh:'9.2'},
    //     {TenSach: 'Về nơi có nhiều cánh đồng', Anh: vncncd, NhaXuatBan: 'BKBook', GiaGoc: '142.500đ', TacGia: 'Anoymous',SoLuongDaBan:'20', SoLuongConLai:'30',MucGiamGia:'5%',DiemTrungBinh:'9.6' },
    //     {TenSach: 'Osho - Tự tôn', Anh: osho, NhaXuatBan: 'BKBook', GiaGoc: '135.000đ', TacGia: 'Anoymous',SoLuongDaBan:'7', SoLuongConLai:'43',MucGiamGia:'0%',DiemTrungBinh:'9.9' },
    //     {TenSach: 'Toán cao cấp tập 1', Anh: toancc, NhaXuatBan: 'BKBook', GiaGoc: '112.000đ', TacGia: 'Anoymous',SoLuongDaBan:'38', SoLuongConLai:'12',MucGiamGia:'0%',DiemTrungBinh:'9.5' },
    //   ];
      const [bookInfo, setBookInfo] = useState({
        name: "",
        image: null,
        price: "",
        author: "",
        publisher: "",
        soldQuantity: "",
        discount: "",
      });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookInfo({ ...bookInfo, [name]: value });
      };

      const handleImageChange = (e) => {
        const file = e.target.files[0];
        const imageName = file ? file.name : null;
        setBookInfo({ ...bookInfo, image: imageName });
      };
      

      const [validated, setValidated] = useState(false);
      const [showFeedback, setShowFeedback] = useState(false);
      const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
      
        if (form.checkValidity() === false) {
          event.stopPropagation();
          setValidated(true);
          setShowFeedback(true);
          return;
        } else {
          setValidated(false);
          setShowFeedback(false);
        }
      
        try {
          console.log(bookInfo);
      
          const response = await fetch('http://localhost:3001/api/addBook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookInfo),
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            alert("Thêm sách thành công");
          } else {
            alert("Lỗi khi thêm sách");
          }
        } catch (error) {
          console.error('Error:', error);
          alert("Lỗi khi thêm sách", error);
        }
      };
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const closeSuccessModal = () => {
      setIsSuccessModalVisible(false);
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

    const openModal = () => {
      setIsFormVisible(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setIsSecondModalOpen(false);
    };
    const AddProduct =
      <div className = {styles.setLayOut}>
        <button onClick={openModal}>Thêm sản phẩm</button>
        {isFormVisible && (
              <div className={styles.modalWindow}>
                <div className={styles.modalContent}>
                  <div className={styles.bookInput}>
                <Form
                  className={styles.bookForm}
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                >
                  <Row className={styles.row}>
                    <Col md={6} className={styles.col}>
                      <FormGroup>
                        <FormLabel>Tên sách</FormLabel>
                        <FormControl
                          type="text"
                          name="name"
                          value={bookInfo.name}
                          onChange={handleInputChange}
                          required
                        />
                        <Form.Control.Feedback
                          type="invalid"
                          className={showFeedback ? styles.feedbackValid : styles.feedbackInvalid}
                        >
                          Tên sách không được trống.
                        </Form.Control.Feedback>
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Ảnh</FormLabel>
                        <FormControl
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleImageChange}
                          required
                        />
                        <Form.Control.Feedback
                          type="invalid"
                          className={showFeedback ? styles.feedbackValid : styles.feedbackInvalid}
                        >
                          Vui lòng chọn ảnh.
                        </Form.Control.Feedback>
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>Giá</FormLabel>
                        <FormControl
                          type="text"
                          name="price"
                          value={bookInfo.price}
                          onChange={handleInputChange}
                          pattern="^\d+(\.\d{1,2})?$"
                          required
                        />
                        <Form.Control.Feedback
                          type="invalid"
                          className={showFeedback ? styles.feedbackValid : styles.feedbackInvalid}
                        >
                          Giá sách không hợp lệ.
                        </Form.Control.Feedback>
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>Tác giả</FormLabel>
                        <FormControl
                          type="text"
                          name="author"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6} className={styles.col}>
                      <FormGroup>
                        <FormLabel>Nhà xuất bản</FormLabel>
                        <FormControl
                          type="text"
                          name="publisher"
                          onChange={handleInputChange}
                        />
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>Số lượng đã bán</FormLabel>
                        <FormControl
                          type="text"
                          name="soldQuantity"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Mức giảm giá</FormLabel>
                        <FormControl
                          type="text"
                          name="discount"
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup className={styles.formActions}>
                    <Button type="submit" variant="primary"
                    onClick={handleSubmit}>
                      Xác nhận
                    </Button>
                  </FormGroup>
                </Form>
                  </div>
                </div>
              </div>
        )}
        {/* {isSuccessModalVisible && (
          <div className={styles.modalWindow}>
            <div className={styles.modalContent}>
              <h3>Thêm sản phẩm thành công!</h3>
              <div className={styles.modalButton}>
                <button className={styles.modalButton1} onClick={closeSuccessModal}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>

    const OrderTable =
    <Table className={styles.OrderTable}>
    <div className={styles.tableContainer}>
      <thead>
        <tr>
        <th scope="col" className ={styles.col1}>Tên sách</th>
        <th scope="col" className ={styles.col1}>Ảnh</th>
        <th scope="col" className ={styles.col2}>Nhà xuất bản</th>
        <th scope="col" className ={styles.col2}>Tác giả</th>
        <th scope="col" className ={styles.col3}>Số lượng đã bán</th>
        <th scope="col" className ={styles.col3}>Số lượng còn lại</th>
        <th scope="col" className ={styles.col3}>Giá gốc</th>
        <th scope="col" className ={styles.col3}>Mức giảm giá</th>
        <th scope="col" className ={styles.col3}>Điểm trung bình</th>
        </tr>
      </thead>
      <tbody>
        {products.map((item, index) => (
          <tr key={index} className = "tableColor">
            <td>{item.Ten}</td>
            <td><img src={`/images/${item.Anh}`} alt={item.TenSach} /></td>
            <td>{item.NXB}</td>
            <td>{item.TacGia}</td>
            {/* <td>{item.SoLuongDaBan}</td>
            <td>{item.SoLuongConLai}</td> */}
            <td>{item.Gia}</td>
            <td>{item.MucGiamGia}</td>
            <td>{item.DiemTrungBinh}</td>
          </tr>
        ))}
      </tbody>
    </div>
  </Table>
    return (
        <React.Fragment>
          <Header />
          <Sidebar />
          {/* <div>
            đừè
          </div> */}
          {AddProduct}
          {OrderTable}
          {/* <Footer /> */}
        </React.Fragment>
      );
}

export default Quanlisanpham
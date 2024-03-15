import React, { useState } from "react";
import {
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import styles from "../Styles/BookForm.module.css";

const BookForm = () => {
  const [bookInfo, setBookInfo] = useState({
    name: "",
    image: null,
    price: "",
    author: "",
    publisher: "",
    soldQuantity: "",
    discount: "",
    averageRating: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookInfo({ ...bookInfo, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBookInfo({ ...bookInfo, image: file });
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
      const formData = new FormData();
      formData.append("Ten", bookInfo.name);
      formData.append("Anh", bookInfo.image);
      formData.append("MoTa", bookInfo.description);
      formData.append("Gia", bookInfo.price);
      formData.append("MucGiamGia", bookInfo.discount);
      formData.append("SoLuongDaBan", bookInfo.soldQuantity);
      formData.append("NXB", bookInfo.publisher);
      formData.append("TacGia", bookInfo.author);
      formData.append("DiemTrungBinh", bookInfo.averageRating);

      const response = await fetch("http://localhost:3001/api/AddBook", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Thêm sách thành công");
      } else {
        alert("Lỗi khi thêm sách");
      }
    } catch (error) {
      alert("Lỗi khi thêm sách", error);
    }
  };

  return (
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
            <FormLabel>Mục giảm giá</FormLabel>
            <FormControl
              type="text"
              name="discount"
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Điểm trung bình</FormLabel>
            <FormControl
              type="text"
              name="averageRating"
              onChange={handleInputChange}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row className={styles.row}>
        <Col className={styles.col}>
          <FormGroup>
            <FormLabel>Mô tả</FormLabel>
            <FormControl
              as="textarea"
              name="description"
              className={styles.description}
              value={bookInfo.description}
              onChange={handleInputChange}
              required
            />
            <Form.Control.Feedback
              type="invalid"
              className={showFeedback ? styles.feedbackValid : styles.feedbackInvalid}
            >
              Mô tả không được trống.
            </Form.Control.Feedback>
          </FormGroup>
        </Col>
      </Row>

      <FormGroup className={styles.formActions}>
        <Button type="submit" variant="primary">
          Xác nhận
        </Button>
      </FormGroup>
    </Form>
    </div>
  );
};

export default BookForm;
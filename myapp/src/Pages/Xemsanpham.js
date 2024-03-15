import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Component/Header.js';
import Footer from '../Component/Footer.js';
import styles from '../Styles/Xemsanpham.module.css';
import { FaShoppingCart } from "react-icons/fa";
import { MdStar } from "react-icons/md";
import { MdStarHalf } from "react-icons/md";
import { useAuth } from '../AuthContext.js';
import Modal from 'react-modal';

function fetchProductDetails(bookId, setProductDetails) {
  fetch(`http://localhost:3001/api/getProductDetails/${bookId}`)
    .then(response => response.json())
    .then(data => setProductDetails(data))
    .catch(error => console.error('Error fetching product details:', error));
}

function fetchProductReviews(bookId, setReviewDetails) {
  fetch(`http://localhost:3001/api/getProductReviews/${bookId}`)
    .then(response => response.json())
    .then(data => setReviewDetails(data))
    .catch(error => console.error('Error fetching product details:', error));
}

const ViewProduct = () => {
  const { userInfo } = useAuth();
  const { bookId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [reviewDetails, setReviewDetails] = useState(null);
  const [count, setCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    fetchProductDetails(bookId, setProductDetails);
  }, [bookId]);
  useEffect(() => {
    fetchProductReviews(bookId, setReviewDetails);
  }, [bookId]);

  const handleIncrement = () => {
    setCount(count + 1);
  };
  const handleDecrement = () => {
    if (count > 0) setCount(count - 1);
  };
  const addToCart = () => {
    const data = {
      bookId: bookId,
      count: count,
      username: userInfo.username,
    };

    fetch('http://localhost:3001/api/addToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log('Added to cart:', result);
        setIsModalOpen(true);
        setModalContent('Thêm vào giỏ hàng thành công!');
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
        setIsModalOpen(true);
        setModalContent('Đã có lỗi xảy ra. Vui lòng thử lại!');
      });
  };
  if (!productDetails) return null;
  let pricePerProduct = 0;
  if (productDetails.MucGiamGia == null || productDetails.MucGiamGia === 0)
    pricePerProduct = productDetails.Gia;
  else
    pricePerProduct = productDetails.Gia * (1 - productDetails.MucGiamGia / 100);
  let totalPrice = pricePerProduct * count;
  totalPrice = totalPrice.toLocaleString('vi-VN');
  return (
    <div className={styles.con}>
      <div className={styles.view_product}>
        <div className={styles.view_product_top}>
          <div className={styles.column_1}>
            <>
              <img src={`/images/${productDetails.Anh}`} alt="" />
            </>
          </div>
          <div className={styles.column_2}>
            <h2>
              {productDetails.Ten}
            </h2>
            <div>
              <p>Tác giả: <span className={styles.author}>{productDetails.TacGia}</span></p>
              <p>Xuất xứ: <span className={styles.origin}>Việt Nam</span></p>
              <p className={styles.comment}><a href="#section1">
                <MdStar className={styles.colorStar} />
                <MdStar className={styles.colorStar} />
                <MdStar className={styles.colorStar} />
                <MdStar className={styles.colorStar} />
                <MdStarHalf className={styles.colorStar} />
                {
                  reviewDetails && reviewDetails.length > 0 ? (
                    <p>({reviewDetails.length} đánh giá)</p>
                  ) : (
                    <p>(0) đánh giá</p>
                  )
                }
              </a></p>
              {
                productDetails.MucGiamGia == null || productDetails.MucGiamGia === 0 ? (
                  <div className={styles.moneyContainer}>
                    <p className={styles.moneyText_1}>
                      {productDetails.Gia} đ
                    </p>
                  </div>
                ) : (
                  <div className={styles.moneyContainer}>
                    <p className={styles.moneyText_1}>
                      {(productDetails.Gia * (1 - productDetails.MucGiamGia / 100)).toLocaleString('vi-VN')} đ
                    </p>
                    <p className={styles.moneyText_2}>
                      <del>{productDetails.Gia.toLocaleString('vi-VN')} đ</del>
                    </p>
                    <p className={styles.moneyText_3}>
                      -{productDetails.MucGiamGia}%
                    </p>
                  </div>
                )
              }
              <div className={styles.infoContainer}>
                <div className={styles.info}>Thông tin chi tiết</div>
                <div>Loại bìa: Bìa mềm</div>
                <div>Nhà xuất bản: {productDetails.NXB}</div>
                <div>Hỗ trợ ebook: Không</div>
              </div>
              <div className={styles.infoContainer}>
                <div className={styles.info}>Số lượng</div>
                <button onClick={handleDecrement} className={styles.info_button_1}>-</button>
                <button className={styles.info_button_2}>{count}</button>
                <button onClick={handleIncrement} className={styles.info_button_1}>+</button>
              </div>
              <div className={styles.sumMoney}>
                Tạm tính: {totalPrice} <sup>đ</sup>
              </div>
              <>
                <button className={styles.view_button_1} onClick={() => addToCart(bookId, count, userInfo)} >
                  <FaShoppingCart /> Thêm vào giỏ hàng
                </button>
                {/* <button className={styles.view_button_2}>Mua ngay</button> */}
              </>
            </div>

          </div>
          <div className={styles.column_3}>
            <div>
              <h1>Mô tả sản phẩm</h1>
              <div className={styles.describeStory}>
                <p>{productDetails.MoTa}</p>
                <div>
                </div>
              </div>
              {/* <button className={styles.describe_button">
              Xem thêm
            </button> */}
            </div>
          </div>

        </div>
        <div id="section1" className={styles.view_product_bot}>
          <div>
            <div className={styles.commentTop}>
              <div>
                <h3>Đánh giá sản phẩm</h3>
                {reviewDetails && reviewDetails.length > 0 ? (
                  <>
                    <p>
                      <span className={styles.commentStar1}>{productDetails.DiemTrungBinh.toFixed(1)}</span>
                      <span className={styles.commentStar2}>/5</span>
                    </p>
                    <p>
                      <MdStar className={styles.colorStar} />
                      <MdStar className={styles.colorStar} />
                      <MdStar className={styles.colorStar} />
                      <MdStar className={styles.colorStar} />
                      <MdStarHalf className={styles.colorStar} />
                    </p>
                    <p>({reviewDetails.length} đánh giá)</p>
                    <hr className={styles.lineSeperate}></hr>
                    {reviewDetails.map((review, index) => (
                      <React.Fragment key={index}>
                        <div className={styles.setNameComment}>
                          {review.HoTen} {review.SoSao} <MdStar className={styles.colorStar} />
                        </div>
                        <div>{review.MoTa}</div>
                        <hr className={styles.lineSeperate}></hr>
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <p>Sản phẩm chưa có đánh giá nào.</p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
      <Modal
        className={styles.popup}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Added to Cart Modal"
      >
        <div className={styles.popupContent}>{modalContent}</div>
      </Modal>
    </div>

  )
}
function App() {
  return (
    <React.Fragment>
      <Header />
      <ViewProduct />
      <Footer />
    </React.Fragment>
  );
}
export default App;
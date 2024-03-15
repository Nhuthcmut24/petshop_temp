import React, { useEffect, useState } from 'react';
import Header from '../Component/Header.js';
import Footer from '../Component/Footer.js';
import { Product } from './Trangchu.js';
import { useAuth } from '../AuthContext.js';
import { Link } from 'react-router-dom';

import styles from '../Styles/Giohang.module.css';
import increase from '..//images/increase.svg';
import decrease from '../images/decrease.svg';
import garbageDump from '../images/garbagedump.png';

function ProductInCart(props) {
    const [quantity, setQuantity] = useState(props.quantity);
    let curPrice = props.price*(1 - props.discount/100);
    const [sumPrice, setSumPrice] = useState(curPrice * props.quantity);
    const [updateTimeout, setUpdateTimeout] = useState(null);

    const handleIncrement = () => {
        setQuantity(quantity + 1);
        updateProductInfo(quantity + 1);
        scheduleUpdateToDB(quantity + 1);
    }
    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            updateProductInfo(quantity - 1);
            scheduleUpdateToDB(quantity - 1);
        }
    }
    const handleDeleteFromCart = async () => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?");
        if (!isConfirmed) return;

        try {
            const response = await fetch('http://localhost:3001/api/deleteFromCart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookId: props.bookId,
                    username: props.username,
                }),
            });

            const responseText = await response.text();
            console.log(responseText);
            alert('Xóa thành công!');
            props.updateProduct();

        } catch (error) {
            console.error('Error:', error);
            alert('Xóa không thành công. Vui lòng thử lại!');
        }
    };
    const scheduleUpdateToDB = (quantity) => {
        if (updateTimeout) clearTimeout(updateTimeout);
        const timeout = setTimeout(() => {
            console.log("Updating to DB:", props.bookId, quantity, sumPrice);
            fetch('http://localhost:3001/api/updateQuantityInCart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookId: props.bookId,
                    username: props.username,
                    quantity: quantity,
                }),
            })
                .then((response) => response.text())
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => console.error('Error:', error));
        }, 500);
        setUpdateTimeout(timeout);
    };



    useEffect(() => {
        setSumPrice(curPrice * quantity);
      }, [curPrice, quantity]);

    const updateProductInfo = (quantity) => {
        const newSumPrice = curPrice * quantity;
        setSumPrice(newSumPrice);
        console.log(newSumPrice);

        props.updateProductInfo({
            bookId: props.bookId,
            quantity: quantity,
            sumPrice: newSumPrice,
        });
    };

    return (
        <div className={styles.productInCart}>
            <div className={styles.productInCartName}>
                <div className={styles.productInCartImage}>
                    <Link to={`/xemsanpham/${props.bookId}`} id='from-cart-to-detail'>
                    <img src={props.imgSrc} alt={props.name} />
                    </Link>
                </div>
                <div className={styles.productInCartInfo}>
                    <p>{props.name}</p>
                    <p><span>Tác giả: </span><span>{props.author}</span></p>
                    <p>{props.publisher}</p>
                </div>
            </div>
            <div className={styles.productInCartSinglePrice}>
                {curPrice.toLocaleString('vi-VN')}<sup>đ</sup>
            </div>
            <div className={styles.productInCartQuantity}>
                    <form>
                        <button type="button" onClick={handleDecrement}>
                            <img src={decrease} alt="decrease" />
                        </button>
                        <input type="text" id="input-quantity" value={quantity} />
                        <button type="button" onClick={handleIncrement}>
                            <img src={increase} alt="increase" />
                        </button>
                    </form>
            </div>
            <div className={styles.productInCartSumPrice}>
                {sumPrice.toLocaleString('vi-VN')}<sup>đ</sup>
            </div>
            <div className={styles.garbageDump}>
                <form>
                    <button className={styles.garbageDumpButton} type="button" onClick={handleDeleteFromCart}>
                        <img src={garbageDump} alt="garbage-dump" />
                    </button>
                </form>
            </div>
        </div>
    );
}

function ListProductInCart() {

    const {userInfo} = useAuth();
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [cusInfo, setCusInfo] = useState('');

    const updateProductInfo = ({ bookId, quantity, sumPrice }) => {
        console.log("Updating product info:", bookId, quantity, sumPrice);

        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.IDSach === bookId
                    ? { ...product, SoLuong: quantity, sumPrice: sumPrice }
                    : product
            )
        );

        const newTotalPrice = products.reduce(
            (total, product) => total + product.sumPrice,
            0
        );
        console.log("New total price:", newTotalPrice);
        setTotalPrice(newTotalPrice);
    };

    const updateProduct = () => {
        const username = userInfo.username;
        fetch(`http://localhost:3001/api/cart/${username}`)
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching cart:', error));
    };

    const handleIntoOrder = async () => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn thanh toán không?");
        if (!isConfirmed) return;

        try {
            const response = await fetch('http://localhost:3001/api/intoOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userInfo.username,
                    totalPrice: totalPrice,
                }),
            });

            const responseText = await response.text();
            console.log(responseText);
            alert('Đơn hàng đã được tạo thành công. Vui lòng đợi nhân viên xác nhận!');
            updateProduct();

        } catch (error) {
            console.error('Error:', error);
            alert('Có vấn đề khi tạo đơn hàng. Vui lòng thử lại!');
        }
    };

    useEffect(() => {
        const username = userInfo.username;
        fetch(`http://localhost:3001/api/cart/${username}`)
          .then(response => response.json())
          .then(data => setProducts(data))
          .catch(error => console.error('Error fetching cart:', error));
    }, [userInfo.username]);
    useEffect(() => {
        const username = userInfo.username;
        fetch(`http://localhost:3001/api/customerInfo/${username}`)
            .then(response => response.json())
            .then(data => setCusInfo(data))
            .catch(error => console.error('Error fetching customer infomation:', error));
    }, [userInfo.username]);
    useEffect(() => {
        let newTotalPrice = 0;
        products.forEach((product) => {
          const curPrice = product.Gia * (1 - product.MucGiamGia / 100);
          newTotalPrice += curPrice * product.SoLuong;
        });
        setTotalPrice(newTotalPrice);
    }, [products]);
    console.log(cusInfo);
    return (
<div className={styles.bodyGioHang}>
    <div>
        {/* <div className={styles.cart-header">
            <p>Giỏ hàng</p>
        </div> */}
        <div className={styles.listProductInCart}>
            <div className={styles.listProductInCartHeader}>
                <span>Sản phẩm</span>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
            </div>
            <div className={styles.productsInCart} id="products-in-cart">
                {products.map((product, index) => {
                // console.log('totalPrice:', totalPrice);
                return (
                <ProductInCart
                    key={index}
                    username={userInfo.username}
                    bookId={product.IDSach}
                    imgSrc={`/images/${product.Anh}`}
                    name={product.Ten}
                    author={product.TacGia}
                    publisher={product.NXB}
                    price={product.Gia}
                    quantity={product.SoLuong}
                    discount={product.MucGiamGia}
                    updateProductInfo={updateProductInfo}
                    updateProduct={updateProduct}
                    />
                );
                })}
            </div>
        </div>
    </div>
    <div className={styles.orderInfo}>
        <div className={styles.customName}>
            <span className={styles.orderInfoTitle}>Họ và tên:</span>
            <span className={styles.customNameValue}>{cusInfo[0]?.HoTen}</span>
        </div>
        <div className={styles.customAddress}>
            <span className={styles.orderInfoTitle}>Địa chỉ:</span>
            <span className={styles.customAddressValue}>{cusInfo[0]?.Diachi}</span>
        </div>
        <div className={styles.customPhone}>
            <span className={styles.orderInfoTitle}>SĐT:</span>
            <span className={styles.customPhoneValue}>{cusInfo[0]?.SoDienThoai}</span>
        </div>
        <div className={styles.totalPrice}>
            <span className={styles.orderInfoTitle}>Tổng giá:</span>
            <span className={styles.totalPriceValue}>{totalPrice.toLocaleString('vi-VN')}<sup>đ</sup></span>
        </div>
        <div className={styles.orderButton}>
            <form>
                <button className={styles.adjustInfomation} type="button">Sửa thông tin</button>
            </form>
            <form>
                <button className={styles.payment} type="button" onClick={handleIntoOrder}>Đặt hàng</button>
            </form>
        </div>
    </div>
</div>
    );
}

function Giohang() {
    return (
        <React.Fragment>
            <Header/>
            <ListProductInCart/>
            <Footer/>
        </React.Fragment>

    );
}
export default Giohang;
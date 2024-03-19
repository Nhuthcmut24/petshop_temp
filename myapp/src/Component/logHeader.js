import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import styles from "./Header.module.css";
// import star from '../images/Star.svg';
// import cart from '../images/Cart.svg';
import logo from "../images/pet logo.jpg";

function Header() {
  const { loggedIn, userInfo, formData, isAdmin, handleLogin } = useAuth();

  // console.log('loggedIn:', loggedIn);
  // console.log('userInfo:', userInfo);
  const handlePetFoodClick = () => {
    // Navigate to the homepage when PETFOOD is clicked
    window.location.href = "/";
  };
  const navigate = useNavigate();

  // useEffect(() => {
  //   handleLogin(formData, isAdmin);
  //   navigate("/");
  // }, [loggedIn, navigate]);
  // useEffect(() => {
  //   if (loggedIn);
  //   navigate("/dangnhap");
  // }, [loggedIn, navigate]);
  return (
    <header>
      <nav>
        <div className={styles.menu}>
          <div className={styles.logoo}>
            <img
              className={styles.logoPETFOOD}
              src={logo}
              alt="PETFOOD"
              onClick={handlePetFoodClick}
            />
            <h2>PETFOOD</h2>
          </div>
          {/* <Link className={styles.cart" to='/giohang'>
                        <img src={cart} alt="cart" />
                    </Link>
                    <a className={styles.star" href="#">
                        <img src={star} alt="star" />   
                    </a> */}
          <ul>
            <li>
              <Link to="/">TRANG CHỦ</Link>
            </li>
            <li>
              <Link to="/giohang">GIỎ HÀNG</Link>
            </li>
            <li>
              <Link to="/">YÊU THÍCH</Link>
            </li>

            <li>
              {loggedIn ? (
                <Link to="/"> TÀI KHOẢN </Link>
              ) : (
                <Link to="/dangnhap">ĐĂNG NHẬP</Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
export default Header;

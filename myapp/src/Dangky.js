import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Component/Header.js';
import Footer from './Component/Footer.js';
//import Dangnhap from './Dangnhap.js';
import styles from './Dangky.module.css';

import { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

function SignupTitle() {
  return (
    <div className={styles.signupTitle}>
      <p> ĐĂNG KÝ </p>
    </div>
  );
}

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/signup', formData);
      console.log(response.data);
      setIsModalOpen(true);
      setModalContent('Đăng ký thành công!');
    } catch (error) {
      console.error('Đã có lỗi xảy ra', error);
      setIsModalOpen(true);
      setModalContent('Đã có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  return (
    <div className={styles.signupForm}>
      <p>Đăng ký tài khoản</p>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.usernameInput}
          name='username'
          type='text'
          placeholder='Hãy nhập tên đăng nhập'
          onChange={handleChange}
        />
        <input
          className={styles.passwordInput}
          name='password'
          type='password'
          placeholder='Nhập mật khẩu'
          onChange={handleChange}
        />
        <input
          className={styles.passwordReInput}
          name='confirmPassword'
          type='password'
          placeholder='Nhập lại mật khẩu'
          onChange={handleChange}
        />
        <input
          className={styles.phoneInput}
          name='phoneNumber'
          type='text'
          placeholder='Nhập số điện thoại của bạn'
          onChange={handleChange}
        />
        <button className={styles.signupButton} type='submit'>
          Đăng ký
        </button>
      </form>
      <Modal
        className={styles.signupPopup}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel='Thông báo'
        appElement={document.getElementById('root')}
      >
        <div className={styles.popupContent}>{modalContent}</div>
        <div>
          <button onClick={closeModal}
           className={styles.popupButton}
          >Đóng</button>
        </div>
      </Modal>
    </div>
  );
}


function LoginWelcome() {
  return (
    <div className={styles.loginWelcome}>
      <h2>
        Bạn đã từng đến đây?
      </h2>
      <p>
        Hãy đăng nhập tại đây.
      </p>
      <div className={styles.loginButton}>
        <Link to="/Dangnhap" className={styles.loginLink}>
          ĐĂNG NHẬP
        </Link>
      </div>
    </div>
  );
}

function DisplaySignupForm() {
  return (
    <div className={styles.displaySignupForm}>
      <SignupForm />
      <LoginWelcome />
    </div>
  );
}
function Dangky() {
  return (
    <div>
      <Header />
      <SignupTitle />
      <DisplaySignupForm />
      <Footer />
    </div>
  );
}
export default Dangky;
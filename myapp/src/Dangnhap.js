import Header from './Component/Header.js';
import Footer from './Component/Footer.js';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useAuth } from './AuthContext';

import styles from './Dangnhap.module.css';

function LoginTitle() {
    return (
        <div className={styles.loginTitle}>
            <p> ĐĂNG NHẬP </p>
        </div>
    );
}

function LoginForm() {

    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLoginRequest = async (apiEndpoint, isAdmin) => {
        try {
          const response = await axios.post(apiEndpoint, formData);
          console.log(response.data);

          if (response.status === 200) {
            handleLogin(formData, isAdmin);
            navigate('/');
          }
        } catch (error) {
          console.error('Đã có lỗi xảy ra', error);
          setIsModalOpen(true);
          setModalContent('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại!');
        }
      };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const isAdmin = document.getElementById('isAdmin').checked;

        if (isAdmin) {
            handleLoginRequest('http://localhost:3001/api/AdminLogin', true);
        } else {
            handleLoginRequest('http://localhost:3001/api/login', false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent('');
    };

    return (
        <div className={styles.loginForm}>
            <p>
                Chào mừng bạn trở lại!<br />
                Hãy đăng nhập ngay bây giờ.
            </p>
            <form onSubmit={handleSubmit}>
                <input className={styles.usernameInput} name='username'
                    type="text" placeholder='Tên đăng nhập'
                    onChange={handleChange} />
                <input className={styles.passwordInput} name='password'
                    type="password" placeholder='Mật khẩu'
                    onChange={handleChange} />
                <div className={styles.sub}>
                    <div className={styles.isAdmid}>
                        <input type="checkbox" id="isAdmin" />
                        <label htmlFor="isAdmin">Bạn là nhân viên?</label>
                    </div>
                    <a href="#">Quên mật khẩu?</a>
                </div>
                <button className={styles.loginButton} type="submit">Đăng nhập</button>
            </form>
            <Modal
                className={styles.loginPopup}
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel='Thông báo'
                appElement={document.getElementById('root')}
            >
                <div className={styles.popupContent}>{modalContent}</div>
                <button onClick={closeModal} className = {styles.popupButton}>Đóng</button>
            </Modal>
        </div>
    );
}

function SignUpWelcome() {
    return (
        <div className={styles.signupWelcome}>
            <h2>
                Bạn chưa có tài khoản?
            </h2>
            <p>
                Hãy kết nối với BKBOOK ngay tại đây.
            </p>
            <Link className={styles.signupButton} to='/dangky'>Tạo tài khoản</Link>
        </div>
    );
}

function DisplayLoginForm() {
    return (
        <div className={styles.displayLoginForm}>
            <SignUpWelcome />
            <LoginForm />
        </div>
    );
}
function Dangnhap() {
    return (
        <React.Fragment>
            <Header />
            <LoginTitle />
            <DisplayLoginForm />
            <Footer />
        </React.Fragment>
    );
}
export default Dangnhap;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import styles from './Header.module.css';
// import star from '../images/Star.svg';
// import cart from '../images/Cart.svg';
import logo from '../images/logoBK.png';
import DropdownProfile from './DropdownProfile';
function Header() {
    const { loggedIn } = useAuth();

    const[openProfile, setOpenProfile] = useState(false);

    const {userInfo, isAdmin} = useAuth();

    return (
        <header>
            <nav>
                <div className={styles.menu}>
                    <div className={styles.logoo}>
                        <img className={styles.logoBkbook} src={logo} alt="BKBOOK" />
                        <h2>BKBOOK</h2>
                    </div>
                    {/* <Link className={styles.cart" to='/giohang'>
                        <img src={cart} alt="cart" />
                    </Link>
                    <a className={styles.star" href="#">
                        <img src={star} alt="star" />
                    </a> */}
                    {loggedIn ? (
                        <ul>
                            <li><Link to='/giohang'>GIỎ HÀNG</Link></li>
                            <li><Link to='/'>YÊU THÍCH</Link></li>
                            <li><Link to='/'>TRANG CHỦ</Link></li>
                            <li><Link onClick={() => setOpenProfile(prevState => !prevState)}>TÀI KHOẢN</Link></li>
                        </ul>
                    ) : (
                        <ul>
                            <li><Link to='/dangnhap'>GIỎ HÀNG</Link></li>
                            <li><Link to='/dangnhap'>YÊU THÍCH</Link></li>
                            <li><Link to='/'>TRANG CHỦ</Link></li>
                            <li><Link to='/dangnhap'>ĐĂNG NHẬP</Link></li>
                        </ul>
                    )}
                </div>
                {openProfile && <DropdownProfile />}
            </nav>
        </header>
    );
}
export default Header;
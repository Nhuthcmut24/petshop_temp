import React from 'react';
import { Link } from 'react-router-dom';
import styles from './sideBar.module.css';
function Sidebar () {
    return (
        <div className={styles.sidebar}>
            <ul>
                <li><Link to='/thongtinkh'>Thông tin tài khoản</Link></li>
                <li><Link to='/personalBuy'>Lịch sử mua hàng</Link></li>
                <li><a href="#">Kho voucher</a></li>
                <li><a href="#">Thông báo</a></li>
            </ul>
        </div>
    );
};

export default Sidebar;

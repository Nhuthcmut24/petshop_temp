import React from 'react';
import { Link } from 'react-router-dom';
import styles from './sideBar.module.css';
function Sidebar () {
    return (
        <div className={styles.sidebar}>
            <ul>
                <li><Link to ='/thongtincanhan'>Thông tin tài khoản</Link></li>
                <li><Link to ='/xacnhandon'>Xác nhận đơn hàng</Link></li>
                <li><Link to ='/theodoidon'>Theo dõi đơn hàng</Link></li>
                <li><Link to =''>Tìm kiếm sản phẩm</Link></li>
                <li><Link to ='/quanlisanpham'>Quản lí sản phẩm</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
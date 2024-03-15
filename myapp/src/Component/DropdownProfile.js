import React from 'react'
import styles from './DropdownProfile.module.css'
import { Link } from 'react-router-dom';
import { useAuth, isAdmin } from '../AuthContext';

const DropdownProfile = () => {

    const { handleLogout } = useAuth();
    const {isAdmin} = useAuth();

    return (
        <div className={styles.dropdown}>
            <ul className={styles.dropdowncontent}>
                {isAdmin ? (
                    <li><Link to='/xacnhandon'>Quản lý đơn hàng</Link></li>
                ) : (
                    <li><Link to='/personalBuy'>Thông tin tài khoản</Link></li>
                )}
                <li><Link to='/dangnhap' onClick={handleLogout}>Đăng xuất</Link></li>
            </ul>
        </div>
    )
}
export default DropdownProfile;
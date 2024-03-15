import React from 'react';
import zlplogo from '../images/zlpaylogo.png';
import mmlogo from '../images/momologo.svg';
import pplogo from '../images/paypallogo.svg';
import payment from '../images/payment.jpg';
import styles from './Footer.module.css';
function Footer() {
    return (
        <footer>
            <div>
                <div className={styles.gridTable1}>
                    <h3 className={styles.gridTableHeading}> Về chúng tôi</h3>
                    <ul className={styles.list1}>
                        <li className={styles.gridTableItem}><a href="#">Giới thiệu về BKBOOK</a></li>
                        <li className={styles.gridTableItem}><a href="#">Các sản phẩm của BKBOOK</a></li>
                    </ul>
                </div>
                <div className={styles.gridTable2}>
                    <h3 className={styles.gridTableHeading}>Phương thức thanh toán</h3>
                    <ul className={styles.list2}>
                        <li className={styles.gridTableItem}>
                            <img src={mmlogo} alt="Momo" />
                        </li>
                        <li className={styles.gridTableItem}>
                            <img src={zlplogo} alt="Zalopay" />
                        </li>
                        <li className={styles.paypal}>
                            <img src={pplogo} alt="Paypal" />
                        </li>
                        <li className={styles.gridTableItem}>
                            <img src={payment} alt="Payment" />
                        </li>
                    </ul>
                </div>
                <div className={styles.gridTable3}>
                    <h3 className={styles.gridTableHeading}>Thông tin liên hệ</h3>
                    <ul className="list3">
                        <li className={styles.gridTableItem}>Email: bkbook@hcmut.edu.vn</li>
                        <li className={styles.gridTableItem}>SĐT: 1017-0958</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
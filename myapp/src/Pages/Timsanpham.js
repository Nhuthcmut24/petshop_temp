import styles from '../Styles/Theodoidon.module.css';
import React from 'react';
import Header from '../Component/logHeader.js';
import Footer from '../Component/Footer.js';
import Sidebar from '../Component/sideBarAdmin.js';
import Table from 'react-bootstrap/Table';

function Timsanpham(){
    return (
        <React.Fragment>
          <Header />
          <Sidebar />
          <input className={styles.searchbar} type="text" placeholder="Nhập mã sản phẩm cần tìm" />
          <Footer />
        </React.Fragment>
      );
}
// fsefesfesfes
export default Timsanpham
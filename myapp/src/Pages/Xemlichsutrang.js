import styles from '../Styles/Xemlichsutrang.module.css';
import React, { useState } from 'react';
import Header from '../Component/logHeader.js';
import Footer from '../Component/Footer.js';
import Sidebar from '../Component/sideBar.js';
import Table from 'react-bootstrap/Table';
import blockchaintreem from '../images/blockchaintreem.jpg';
import { CiStar } from "react-icons/ci";
const ViewHistory = () =>{

  return(
    <div className = {styles.containerDetails}>
      <h2>Lịch sử mua hàng</h2>
      <button className ={styles.buttonDetailsOne}>Quay lại</button>
      <div className={styles.midDetails}>
        <div className={styles.midDetailsLeft}>
          <img src={blockchaintreem}/>

        </div>
        <div className={styles.midDetailsRight}>
          <button className ={styles.buttonDetailsTwo}>
            Đã giao
          </button>
          <div>Tên sách: Blockchain cho trẻ</div>
          <div>Thời gian đặt mua: 04:50 26/10/2023</div>
          <div>Thời gian giao: 10:28 28/10/2023</div>
          <div className = {styles.midDetailsRightBot}>
            <ul>
              <li><CiStar /></li>
              <li><CiStar /></li>
              <li><CiStar /></li>
              <li><CiStar /></li>
              <li><CiStar /></li>
            </ul>
            <div className ={styles.inputHistory}>
            <input type="text" id="comment" name="comment" placeholder="Ghi đánh giá cho đơn hàng" ></input>
            </div>
            <button className ={styles.buttonHistory}>Gửi đánh giá</button>
          </div>
        </div>
        <div className={styles.midDetailsRight}>
          <button className ={styles.buttonDetailsTwo}>
            Đã giao
          </button>
          <div>Tên sách: Blockchain cho trẻ</div>
          <div>Thời gian đặt mua: 04:50 26/10/2023</div>
          <div>Thời gian giao: 10:28 28/10/2023</div>
          <div>Chi tiết quá trình</div>
          èhefu
        </div>
      </div>
    </div>
  )
}
function App() {
  return (
    <React.Fragment>
      <Header/>
      <Sidebar/>
      <ViewHistory />
      <Footer/>
    </React.Fragment>
  );
}
export default App;
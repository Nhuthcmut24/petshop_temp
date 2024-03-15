//import logo from './logo.svg';
import styles from '../Styles/personalBuy.module.css';
import React, { useState, useEffect } from 'react';
import Header from '../Component/logHeader.js';
// import Header from '../Component/Header.js';
import Footer from '../Component/Footer.js';
import Sidebar from '../Component/sideBar.js';
import Table from 'react-bootstrap/Table';
import { useAuth } from '../AuthContext.js';
import { Link } from 'react-router-dom';

const getStatusClass = (status) => {
  switch (status) {
    case 'Đã giao':
      return 'DaGiao';
    case 'Đang giao':
      return 'DangGiao';
    case 'Đã hủy':
      return 'DaHuy';
    case 'Đang xử lý':
      return 'DangXuLy';
    case 'Chờ thanh toán':
      return 'ChoThanhToan';
    case 'Đã thanh toán':
      return 'DaThanhToan';
    case 'Yêu cầu hủy đơn':
      return 'YeuCauHuyDon';
    default:
      return ''; // Không có class nếu không có trạng thái nào khớp
  }
};

function PersonalBuy() {
  const {userInfo} = useAuth();
  const [data, setData] = useState([]); 
  const [filter, setFilter] = useState('Tất cả'); // State để lưu giá trị filter, mặc định là '0' (Tất cả)
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  useEffect(() => {
    fetch(`http://localhost:3001/api/orderList/${userInfo.username}`)
      .then(res => res.json())
      .then(
        (result) => {
          setData(result);
        },
        (error) => {
          console.log(error);
        }
      )
  } ,[])

  // Lọc dữ liệu theo giá trị của dropdown
  const filteredData =
    filter === 'Tất cả' ? data : data.filter(item => item.XacNhan.toLowerCase() === filter.toLowerCase());
  const filterDropdown =
    <div className={styles.filterDropdown}>
      <select onChange={handleFilterChange} value={filter}>
        <option value="Tất cả">Tất cả</option>
        <option value="Đã giao">Đã giao</option>
        <option value="Đang giao">Đang giao</option>
        <option value="Đang xử lý">Đang xử lý</option>
        <option value="Chờ thanh toán">Chờ thanh toán</option>
        <option value="Đã thanh toán">Đã thanh toán</option>
        <option value="Đã hủy">Đã hủy</option>
        <option value="Yêu cầu hủy đơn">Yêu cầu hủy đơn</option>
      </select>
    </div>

  const orderedTable =
    <Table className={styles.orderedTable}>
      <div className={styles.tableContainer}>
        <thead>
          <tr>
            <th scope="col">Trạng thái</th>
            <th scope="col">Mã đơn hàng</th>
            <th scope="col">Ngày mua</th>
            <th scope="col">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className={getStatusClass(item.XacNhan)}>
              <td>{item.XacNhan}</td>
              <td>{item.ID}</td>
              <td>{item.NgayTao}</td>
              <td><Link to={`/xemchitiet/${item.ID}`}>Xem chi tiết</Link></td>
            </tr>
          ))}
        </tbody>
      </div>
    </Table>
  return (
    <React.Fragment>
      <Header />
      <Sidebar />
      {filterDropdown}
      {orderedTable}
      <Footer />
    </React.Fragment>
  );
}
export default PersonalBuy;
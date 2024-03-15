import styles from '../Styles/Xacnhandon.module.css';
import React from 'react';
import Header from '../Component/Header.js';
import Footer from '../Component/Footer.js';
import Sidebar from '../Component/sideBarAdmin.js';
import Table from 'react-bootstrap/Table';
import {useState, useEffect} from 'react';
import { useSearch } from '../SearchContext';

function Xacnhandon(){
    const [data, setData] = useState([]);
    const { searchTerm, setSearchTerm } = useSearch();
    const [isSearch, setIsSearch] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const fetchAllOrder = () => {
      fetch('http://localhost:3001/api/GetOrder')
      .then(res => res.json())
      .then(json => setData(json))
    }

    const handleSearchInputChange = (event) => {
      setSearchInput(event.target.value);
    };
  
    const handleSearchSubmit = (event) => {
      event.preventDefault();
      setSearchTerm(searchInput.trim());
    };
  
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleSearchSubmit(event);
        }
    };

    useEffect(() => {
      if (searchTerm) {
        console.log(searchTerm);
        setIsSearch(true);
        fetch(`http://localhost:3001/api/SearchOrder?searchTerm=${searchTerm}`)
          .then((response) => response.json())
          .then((data) => setData(data))
          .catch((error) => console.log(error));
      } else {
        setIsSearch(false);
        fetchAllOrder();
      }
    }, [searchTerm]);

    const OrderTable = 
    <Table className={styles.OrderTable}>
    <div className={styles.tableContainer}>
      <thead>
        <tr>
          <th scope="col">Mã đơn</th>
          <th scope="col">Người đặt hàng</th>
          <th scope="col">Giá trị</th>
          <th scope="col">Địa chỉ giao hàng</th>
          <th scope="col">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
        <tr key={index} className="tableColor">
          <td>{item.ID}</td>
          <td>{item.HoTen}</td>
          <td>{item.TongTien}</td>
          <td>{item.DiaChi}</td>
          <td>
        {
          item.XacNhan === 'Đang xử lý' ? (
            <a href="#">Xác nhận đơn hàng</a>
          ) : (
            item.XacNhan === 'Yêu cầu hủy đơn' ? (
              <a href="#">Xác nhận hủy đơn</a>
            ) : (
              <a href="#">{item.XacNhan}</a>
            )
          )
        }
          </td>
      </tr>
    ))}
</tbody>
    </div>
  </Table>
    return (
        <React.Fragment key={searchTerm}>
          <Header />
          <Sidebar />
          <form onSubmit={handleSearchSubmit}>
          <input className={styles.searchbar} type="text" placeholder="Nhập mã đơn hàng cần tìm" 
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyDown}/>
          </form>
          {OrderTable}
          <Footer />  
        </React.Fragment>
      );
}

export default Xacnhandon
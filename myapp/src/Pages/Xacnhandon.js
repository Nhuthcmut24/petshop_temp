import styles from "../Styles/Xacnhandon.module.css";
import React, { useState, useEffect } from "react";
import Header from "../Component/Header.js";
import Footer from "../Component/Footer.js";
import Sidebar from "../Component/sideBarAdmin.js";
import Table from "react-bootstrap/Table";
import { useSearch } from "../SearchContext";

function Xacnhandon() {
  const [data, setData] = useState([]);
  const { searchTerm, setSearchTerm } = useSearch();
  const [isSearch, setIsSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [updateTimeout, setUpdateTimeout] = useState(null);
  const fetchAllOrder = () => {
    fetch("http://localhost:4001/api/GetOrder")
      .then((res) => res.json())
      .then((json) => setData(json));
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      setIsSearch(true);
      fetch(`http://localhost:4001/api/SearchOrder?searchTerm=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.log(error));
    } else {
      setIsSearch(false);
      fetchAllOrder();
    }
  }, [searchTerm]);

  const handleConfirmOrder = (orderId) => {
    try {
      fetch(`http://localhost:4001/api/updateOrderState/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: "Đã được xác nhận" }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log(result);
          },
          (error) => {
            console.log(error);
          }
        );
    } catch (error) {
      console.log(error);
      window.alert("Hiện tại không thể hủy đơn. Vui lòng thử lại!");
    }
  };
  const handleConfirmOrder2 = (orderId) => {
    try {
      fetch(`http://localhost:4001/api/updateOrderState/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: "Đã thanh toán" }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log(result);
          },
          (error) => {
            console.log(error);
          }
        );
    } catch (error) {
      console.log(error);
      window.alert("Hiện tại không thể hủy đơn. Vui lòng thử lại!");
    }
  };
  const OrderTable = (
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
                {item.XacNhan === "Đang xử lý" ? (
                  <a href="#" onClick={() => handleConfirmOrder(item.ID)}>
                    {item.XacNhan}
                  </a>
                ) : item.XacNhan === "Đơn hàng bị hủy" ? (
                  <a href="#">Đơn hàng bị hủy</a>
                ) : item.XacNhan === "Đã được xác nhận" ? (
                  <React.Fragment>
                    <a href="#" onClick={() => handleConfirmOrder2(item.ID)}>
                      {item.XacNhan}
                    </a>
                    {/* <td>{item.XacNhan}</td> */}
                  </React.Fragment>
                ) : (
                  <a href="#">{item.XacNhan}</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </div>
    </Table>
  );

  return (
    <React.Fragment key={searchTerm}>
      <Header />
      <Sidebar />
      <form onSubmit={handleSearchSubmit}>
        <input
          className={styles.searchbar}
          type="text"
          placeholder="Nhập mã đơn hàng cần tìm"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyDown}
        />
      </form>
      {OrderTable}
      <Footer />
    </React.Fragment>
  );
}

export default Xacnhandon;

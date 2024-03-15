import styles from '../Styles/Thongtincanhan.module.css';
import React , {useState, useEffect} from 'react';
import Header from '../Component/logHeader.js';
import Footer from '../Component/Footer.js';
import Sidebar from '../Component/sideBarAdmin.js';
import { RxAvatar } from "react-icons/rx";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import {useAuth} from '../AuthContext.js';
const Thongtintk = () =>{

  const {userInfo} = useAuth();
  const [staffInfo, setStaffInfo] = useState([]);

  const fetchStaffInfo = (username, setStaffInfo ) => {
    console.log(username);
    fetch(`http://localhost:3001/api/staffInfo/${username}`)
      .then(res => res.json())
      .then(
        (result) => {
          setStaffInfo(result);
        },
        (error) => {
          console.log(error);
        }
      )
  }
  
  useEffect(() => {
    fetchStaffInfo(userInfo.username, setStaffInfo);
  }, [userInfo.username]);

  const handelUpdateEmail = () => {
    const username = userInfo.username;
    const email = prompt("Nhập email mới");
    if (email === null) return;
    fetch(`http://localhost:3001/api/updateStaffEmail/${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email})
    })
      .then(res => res.json())
      .then(
        (result) => {
          alert("Cập nhật email thành công");
          fetchStaffInfo(userInfo.username, setStaffInfo);
        },
        (error) => {
          console.log(error);
        }
      )
  }
  
  const handleUpdateAddress = () => {
    const username = userInfo.username;
    const address = prompt("Nhập địa chỉ mới");
    if (address === null) return;
    fetch(`http://localhost:3001/api/updateStaffAddress/${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({address: address})
    })
      .then(res => res.json())
      .then(
        (result) => {
          alert("Cập nhật địa chỉ thành công");
          fetchStaffInfo(userInfo.username, setStaffInfo);
        },
        (error) => {
          console.log(error);
        }
      )
  }

  const handleUpdatePassword = () => {
    const username = userInfo.username;
    const password = prompt("Nhập mật khẩu mới");
    if (password === null) return;
    fetch(`http://localhost:3001/api/updateStaffPassword/${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({password: password})
    })
      .then(res => res.json())
      .then(
        (result) => {
          alert("Cập nhật mật khẩu thành công");
        },
        (error) => {
          console.log(error);
        }
      )
  }

  if (staffInfo.length === 0) return null;
  return (

      <div className ={styles.infoPersonal}>
        <h2>Thông tin tài khoản</h2>
        <div className = {styles.info}>
          <div className = {styles.infoContainer}>
            <div className = {styles.avatar}>
             <RxAvatar />
            </div>
            <div className = {styles.infoDetails}>
              <ul>
                <li>
                  Họ và tên: {staffInfo[0].HoTen}
                </li>
                <li>Giới tính: 
                  {
                    staffInfo[0].GioiTinh === 'M' ? " Nam" : " Nữ"
                  }
                </li>
                <li>Nhân viên quản lý</li>
              </ul>
            </div>

          </div>
          <div className = {styles.infoContainer}>
            <div className = {styles.infoRight}>
                <ul>
                  <li><BsFillTelephoneFill /> Số điện thoại</li>
                  <li className ={styles.infoTel}>{staffInfo[0].SoDienThoai}</li>
                </ul>
                <button className ={styles.infoButton1}>Cập nhật</button>
            </div>
            <div className = {styles.infoRight}>
                <ul>
                  <li><MdOutlineMail />Địa chỉ email</li>
                  <li className ={styles.infoTel}>{
                    staffInfo[0].Email === null ? "Chưa cập nhật" : staffInfo[0].Email
                  }</li>
                </ul>
                <button  className ={styles.infoButton2} onClick={handelUpdateEmail}>Cập nhật</button>
            </div>
            <div className = {styles.infoRight}>
                <ul>
                  <li><FaHome /> Địa chỉ </li>
                  <li className ={styles.infoTel}>
                    {
                      staffInfo[0].Diachi === null ? "Chưa cập nhật" : staffInfo[0].DiaChi
                    }
                  </li>
                </ul>
                <button className ={styles.infoButton3} onClick={handleUpdateAddress}>Cập nhật</button>
            </div>
            <div className = {styles.infoRight}>
                <ul>
                  <li><RiLockPasswordFill />Thiết lập mật khẩu</li>
                </ul>
                <button className ={styles.infoButton4} onClick={handleUpdatePassword}>Đổi mật khẩu</button>
            </div>
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
      <Thongtintk/>
      <Footer/>
    </React.Fragment>
  );
}
export default App;
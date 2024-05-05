import { faArrowDown } from "@fortawesome/free-solid-svg-icons/faArrowDown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dropdown } from "antd";
import classNames from 'classnames/bind';
import { Link } from "react-router-dom";
import logo from "../../assets/images/main_logo_petfood.jpg";
import styles from './AdminHeader.module.scss';
const cx = classNames.bind(styles)

function AdminHeader() {

    const items = [
        // {
        //     label: <Link to="/profile">{"Profile"}</Link>,

        //     key: "1",
        // },
        // {
        //     label: <Link to="/settings">{"Setting"}</Link>,
        //     key: "3",

        // },
        {
            label: "Logout",
            key: "2",
            danger: true,
            onClick: () => {

            },
        },
    ];
    return (
        <div
            className={cx("wrapper")}
        >
            <div className={cx("navbar")}>
                
                <img alt="avatar" className={cx("logo")} src={logo} />
            </div>

            <h6 className={cx("slogan")}>Chào mừng quay trở lại, Admin!</h6>

            <div className={cx("btn-wrapper")}>
                <Dropdown menu={{items}} >
                    <Button className={cx("admin-btn")}>
                        <div className={cx("admin-avatar-wrapper")}  >                        
                            <img
                                src="https://cdn-icons-png.flaticon.com/256/163/163801.png"
                                alt="avatar"
                                width={30}
                                height={30}
                                className={cx("admin-avatar")}
                            />
                        </div>
                        <span className={cx("admin-name")} >Admin</span>
                        <div className={cx("admin-icon")} >
                            <FontAwesomeIcon icon={faArrowDown} />
                        </div>
                    </Button>
                </Dropdown>
            </div>
        </div>
    );
}

export default AdminHeader;
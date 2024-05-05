import React, { Fragment } from "react";
import {
    AiOutlineHome
} from "react-icons/ai";
import { TbDeviceDesktop } from "react-icons/tb";
import { Navigation } from "react-minimal-side-navigation";
import styles from './AdminSidebar.module.scss'
import classNames from "classnames/bind";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
// import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faBarsProgress } from "@fortawesome/free-solid-svg-icons/faBarsProgress";

const cx = classNames.bind(styles)


function AdminSidebar() {
    // const navigate = useNavigate();

    return (
            <div
                className={cx("wrapper")}
            >
                <Navigation
                    // you can use your own router's api to get pathname
                    activeItemId={document.location.pathname}
                    // onSelect={({ itemId, index }) => {
                    //     navigate(itemId);
                    // }}
                    items={[
                        {
                            title: "Dashboard",
                            itemId: "/dashboard",

                            elemBefore: () => (
                                <FontAwesomeIcon icon={faHome} />
                            ),
                        },
                        {
                            title: "Quản lý sản phẩm",
                            itemId: "/admin/books",
                            // you can use your own custom Icon component as well
                            // icon is optional
                            elemBefore: () => (
                                <FontAwesomeIcon icon={faBarsProgress} />

                            ),
                        },

                    ]}
                />
            </div>
    );
}

export default AdminSidebar;
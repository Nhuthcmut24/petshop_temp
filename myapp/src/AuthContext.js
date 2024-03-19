import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const isAdmin = localStorage.getItem("isAdmin");

    if (isLoggedIn === "true" && userData) {
      setLoggedIn(true);
      setUserInfo(userData);
      setIsAdmin(isAdmin === "true");
    }
  }, []);

  const handleLogin = (userData, isAdmin) => {
    setLoggedIn(true);
    setUserInfo(userData);
    setIsAdmin(isAdmin);
    // Save login data to localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserInfo({});
    setIsAdmin(false);
    // Clear login data from localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        userInfo,
        isAdmin,
        handleLogin,
        handleLogout,
        setLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (userData, isAdmin) => {
    setLoggedIn(true);
    setUserInfo(userData);
    setIsAdmin(isAdmin);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserInfo({});
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, userInfo, isAdmin, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

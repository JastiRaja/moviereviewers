//Here we are going to authenticate a user and setting a time for 30minutes
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    let timer;
    if (user) {
      timer = setTimeout(() => {
        setUser(null);
        localStorage.removeItem('user');
        alert('Session expired. Please log in again.');
      }, 30 * 60 * 1000); // 30 minutes
    }
    return () => clearTimeout(timer);
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

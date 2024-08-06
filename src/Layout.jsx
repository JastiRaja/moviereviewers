import React, { useContext, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from './AuthContext';

const Layout = ({ onSearchChange }) => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (onSearchChange) {
      onSearchChange(query);
    }
  };

  // Paths where Navbar should not be displayed
  const hideNavbarPaths = ['/', '/Login', '/Signup', '/reset-password'];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && (
        <Navbar onSearchChange={handleSearchChange} onLogout={logout} />
      )}
      <Outlet context={{ searchQuery }} />
    </>
  );
};

export default Layout;

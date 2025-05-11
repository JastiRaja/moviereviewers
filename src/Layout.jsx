import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbars from './Navbars';

const Layout = ({ onSearchChange }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (onSearchChange) {
      onSearchChange(query);
    }
  };

  // Paths where Navbar should not be displayed
  // const hideNavbarPaths = ['/'];

  return (
    <>
      {/* {!hideNavbarPaths.includes(location.pathname) && ( */}
        <Navbars onSearchChange={handleSearchChange} />
      {/* )} */}
      <Outlet context={{ searchQuery }} />
    </>
  );
};

export default Layout;

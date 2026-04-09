import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbars from './Navbars';

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Navbars onSearchChange={handleSearchChange} />
      <Outlet context={{ searchQuery }} />
    </>
  );
};

export default Layout;

import React from 'react';
import { NavLink } from 'react-router-dom';
import banner from './Banner.jpg';
import { FiSearch } from 'react-icons/fi';

const Navbar = ({ onSearchChange }) => {
  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  return (
    <nav className='navcontainer'>
      <div className='navblock'>
        <NavLink to='/'>
          <img src={banner} alt="logo" />
        </NavLink>
        <ul>
          <NavLink to='/' className={({ isActive }) => isActive ? 'active' : ''}>
            <li>Home</li>
          </NavLink>
          {/* <NavLink to='/Contact' className={({ isActive }) => isActive ? 'active' : ''}>
            <li>Contact us</li>
          </NavLink> */}
          <NavLink to='/About' className={({ isActive }) => isActive ? 'active' : ''}>
            <li>About</li>
          </NavLink>
        </ul>
        <ul>
          <div className='navbar-search-wrapper'>
            <input
              type="search"
              className="searchbox"
              id="search"
              placeholder='search movies...'
              onChange={handleInputChange}
            />
            <FiSearch className='search-icon' />
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

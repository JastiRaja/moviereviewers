import React from 'react';
import { NavLink } from 'react-router-dom';
import banner from './Banner.jpg';

const Navbar = ({ onSearchChange, onLogout }) => {
  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  return (
    <nav className="navcontainer">
      <div className="navblock">
        <aside className="bannerblock">
          <img src={banner} alt="MovieReviewer logo" />
          <h1 className="brand-title">MovieReviewer</h1>
        </aside>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>
        <div className="search-wrap">
          <input
            type="search"
            className="searchbox"
            id="search"
            placeholder="Search movies..."
            onChange={handleInputChange}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

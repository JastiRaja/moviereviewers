import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import banner from './Banner.jpg';
import { AuthContext } from './AuthContext';
import { Container } from 'react-bootstrap';

const Navbar = ({ onSearchChange, onLogout }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleSignout = () => {
    onLogout();
    navigate('/');
  };

  return (
    
    <Container>
    <nav className='navcontainer'>
      <aside className='bannerblock'>
        <img src={banner} alt="" />
      </aside>
      <aside className='listitems'>
        <ul>
          <NavLink to='/Home'>
            <li>Home</li>
          </NavLink>
        </ul>
        <ul>
          <NavLink to='/Contact'>
            <li>Contact us</li>
          </NavLink>
        </ul>
        <ul>
          <NavLink to='/About'>
            <li>About</li>
          </NavLink>
        </ul>
        <ul>
          <input
            type="search"
            className="searchbox"
            id="search"
            placeholder='search'
            onChange={handleInputChange}
          />
        </ul>
        {user ? (
          <ul>
            <li className='welcome-message'>Hi, {user.username}</li>
          </ul>
        ) : null}
        <ul>
          <li onClick={handleSignout} className='signout'>Signout</li>
        </ul>
      </aside>
    </nav>
    </Container>
  );
};

export default Navbar;

import React, { useState, useContext } from 'react';
import banner from './Banner.jpg';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';

const Login = () => {
  const [user, setUser] = useState({ username: '', password: '' });
  const { username, password } = user;
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
      alert('Both fields are mandatory...');
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/user");
      const data = response.data;
      const userExists = data.find(usr => (usr.username === username || usr.email === username || usr.mobile === username) && usr.password === password);

      if (userExists) {
        login(userExists);
        navigate('/Home');
        toast.success('Logged-in successfully');
      } else {
        alert('Invalid credentials');
      }
    } catch (e) {
      console.error("Error fetching users:", e);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className='global-background'>
      <img src={banner} alt="banner" className='bannersignup'/>
      <fieldset align="center" className='loginfield'>
        <legend><h1 className='login'>Login</h1></legend>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td>Email-id/Username<sup>*</sup></td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    placeholder="Email/Username"
                    value={username}
                    name="username"
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <br />
              <tr>
                <td>Password<sup>*</sup></td>
                <td>:</td>
                <td>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    name="password"
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <br />
              <tr>
                <td></td>
                <td></td>
                <td style={{ fontSize: 'small', textDecoration: 'underline', color: 'red' }}>
                  <NavLink to="/reset-password">Forgotten password</NavLink>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>
                  <button type="submit" className="button loginButton">
                    Login
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <div className='asignup'>
          Don't have an account? <NavLink to="/Signup">Sign-up</NavLink> here
        </div>
      </fieldset>
    </div>
  );
};

export default Login;

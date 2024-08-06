import React, { useState, useContext } from 'react';
import banner from './Banner.jpg';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const Signup = () => {
  const [user, setUser] = useState({ username: '', email: '', mobile: '', password: '', repass: '' });
  const { username, email, mobile, password, repass } = user;
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== repass) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/user");
      const data = response.data;

      const userExists = data.some(user => user.username === username || user.email === email || user.mobile === mobile);

      if (userExists) {
        alert("Username, email, or mobile number already exists!");
      } else {
        const newUser = { username, email, mobile, password };
        await axios.post("http://localhost:5000/user", newUser);
        login(newUser);
        navigate('/Home');
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setUser({ username: "", email: "", mobile: "", password: "", repass: "" });
    }
  };

  return (
    <div className='global-background'>
      <img src={banner} alt="banner" className='bannersignup'/>
      <fieldset align="center" className='signupfield'>
        <legend><h1 >Sign-up</h1></legend>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td>Username<sup>*</sup></td>
                <td>:</td>
                <td>
                  <input 
                    type="text" 
                    placeholder='Username'
                    value={username}
                    name='username'
                    onChange={handleChange}
                    required 
                  />
                </td>
              </tr><br />
              <tr>
                <td>Email-id<sup>*</sup></td>
                <td>:</td>
                <td>
                  <input 
                    type="email" 
                    placeholder='Email'
                    value={email}
                    name='email'
                    onChange={handleChange}
                    required 
                  />
                </td>
              </tr><br />
              <tr>
                <td>Mobile no<sup>*</sup></td>
                <td>:</td>
                <td>
                  <input 
                    type="text" 
                    placeholder='Mobile'
                    value={mobile}
                    name='mobile'
                    onChange={handleChange}
                    required 
                  />
                </td>
              </tr><br />
              <tr>
                <td>Password<sup>*</sup></td>
                <td>:</td>
                <td>
                  <input 
                    type="password" 
                    placeholder='Password'
                    value={password}
                    name='password'
                    onChange={handleChange}
                    required 
                  />
                </td>
              </tr><br />
              <tr>
                <td>Re-Enter Password<sup>*</sup></td>
                <td>:</td>
                <td>
                  <input 
                    type="password" 
                    placeholder='Password'
                    value={repass}
                    name='repass'
                    onChange={handleChange}
                    required 
                  />
                </td>
              </tr><br />
              <tr>
                <td></td>
                <td></td>
                <td>
                  <button type='submit' className='button loginButton'>
                    Sign-Up
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <br />
        <div className='asignup'>Already have an account? <NavLink to="/Login">Login</NavLink> here</div>
      </fieldset>
    </div>
  );
};

export default Signup;

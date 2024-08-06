import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import banner from './Banner.jpg';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== verifyPassword) {
      setMessage('Passwords do not match!');
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/user");
      const data = response.data;
      const userIndex = data.findIndex(user => user.email === email);

      if (userIndex !== -1) {
        const updatedUser = { ...data[userIndex], password: newPassword };
        // Update the user data on the server
        await axios.put(`http://localhost:5000/user/${data[userIndex].id}`, updatedUser);
        setMessage('Password updated successfully!');
        toast.success('Password updated successfully');
        navigate('/Login');
      } else {
        setMessage('User not found!');
        toast.error('User not found');
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage('An error occurred. Please try again later.');
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div className='global-background'>
      <img src={banner} alt="banner" className='bannersignup'/>
      <fieldset align="center" className='loginfield'>
        <legend><h1 className='login'>Reset Password</h1></legend>
        <form onSubmit={handleResetPassword}>
          <table>
            <tbody>
              <tr>
                <td>Email-id<sup>*</sup></td>
                <td>:</td>
                <td>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <br />
              <tr>
                <td>New Password<sup>*</sup></td>
                <td>:</td>
                <td>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    name="newPassword"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <br />
              <tr>
                <td>Verify Password<sup>*</sup></td>
                <td>:</td>
                <td>
                  <input
                    type="password"
                    placeholder="Verify Password"
                    value={verifyPassword}
                    name="verifyPassword"
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <br />
              <tr>
                <td></td>
                <td></td>
                <td>
                  <button type="submit" className="button loginButton">
                    Reset Password
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        {message && <p>{message}</p>}
        <div className='asignup'>
          Don't have an account? <NavLink to="/Signup">Sign-up</NavLink> here
        </div>
      </fieldset>
    </div>
  );
};

export default ResetPassword;

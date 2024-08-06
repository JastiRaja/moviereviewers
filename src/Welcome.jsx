import React from 'react'
import logo from './Logo.jpg'
import banner from './Banner.jpg'
import { NavLink } from 'react-router-dom'
const Welcome = () => {
  return (
    <div className='global-background'>
      <img src={banner} alt="banner"  className='banner'/>
       <img src={logo} alt="logo" className='logo' />
       <NavLink to="/Login"><button className='button signin'> Signin</button></NavLink>
       <NavLink to="/Signup"><button className='button signup'>Sign-up</button></NavLink>
    </div>
  )
}

export default Welcome
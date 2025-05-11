import React from 'react'
import logo from './Logo.jpg'
import banner from './Banner.jpg'
import { NavLink } from 'react-router-dom'

const Welcome = () => {
  return (
    <div className='global-background'>
      <img src={banner} alt="banner" className='banner'/>
      <img src={logo} alt="logo" className='logo' />
      <NavLink to="/"><button className='button signin'>Get Started</button></NavLink>
    </div>
  )
}

export default Welcome
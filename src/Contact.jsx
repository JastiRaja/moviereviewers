import React from 'react';
import facebook from './facebook.png'
import instagram from './insta.jpeg'

const Contact = () => {
  return (
    <div className='global-background'>
      <div className='logos'>
        <div className="fb">
          <img src={facebook} alt="" />
          <p>
          <a href="https://www.facebook.com/profile.php?id=61563755309085" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </p>
        <div className='insta'>
            <img src={instagram} alt="" />
            <p>
              <a href="https://www.instagram.com/movie__reviewer/"> Instagram</a>
            </p>
        </div>
        </div>
        
      </div> 
    </div>
  );
}

export default Contact;

import React from 'react';
import facebook from './facebook.png'
import instagram from './insta.jpeg'

const Contact = () => {
  return (
    <div className="page-shell">
      <div className="logos content-card">
        <h2>Contact us</h2>
        <p>Follow MovieReviewer on social platforms:</p>

        <div className="social-list">
          <a className="social-link" href="https://www.facebook.com/profile.php?id=61563755309085" target="_blank" rel="noopener noreferrer">
            <img src={facebook} alt="Facebook icon" />
            <span>Facebook</span>
          </a>

          <a className="social-link" href="https://www.instagram.com/movie__reviewer/" target="_blank" rel="noopener noreferrer">
            <img src={instagram} alt="Instagram icon" />
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;

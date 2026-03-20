import React from 'react';
import './MobileMenu.css';

const MobileMenu = ({ isOpen, onToggle }) => {
  return (
    <button 
      className={`mobile-menu-btn ${isOpen ? 'open' : ''}`}
      onClick={onToggle}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>
  );
};

export default MobileMenu;
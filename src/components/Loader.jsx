import React from 'react';

const Loader = ({ text = "Loading...", fullPage = false }) => {
  return (
    <div className={`loader ${fullPage ? 'loader-fullpage' : ''}`}>
      <div className="loader-spinner"></div>
      {text && <span className="loader-text">{text}</span>}
    </div>
  );
};

export default Loader;
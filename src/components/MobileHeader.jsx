import './MobileHeader.css';

const MobileHeader = ({ onToggleSidebar }) => {
  return (
    <header className="mobile-header">
      <button 
        className="mobile-menu-btn"
        onClick={onToggleSidebar}
        aria-label="Open menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
      
      <span className="mobile-logo">Study Saathi</span>
      
      {/* Empty div for spacing balance */}
      <div style={{ width: '40px' }}></div>
    </header>
  );
};

export default MobileHeader;
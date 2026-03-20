import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className={`spinner spinner-${size}`}></div>
      </div>
    );
  }

  return <div className={`spinner spinner-${size}`}></div>;
};

export default LoadingSpinner;
import React from 'react';
import PropTypes from 'prop-types';
import './ProgressBar.css';

const ProgressBar = ({ progress, step, stepVisible }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
          {`${progress.toFixed(2)}%`} {/* Always show the percentage */}
        </div>
      </div>
      {stepVisible && <div className="progress-bar-step">{step}</div>} {/* Conditionally render the step */}
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  step: PropTypes.string.isRequired,
  stepVisible: PropTypes.bool.isRequired, // Add stepVisible prop type
};

export default ProgressBar;

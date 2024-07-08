import React from 'react';
import PropTypes from 'prop-types';
import './ProgressBar.css';

const ProgressBar = ({ progress, step }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        >
          <span className="progress-bar-text">{progress.toFixed(2)}%</span>
        </div>
      </div>
      <div className="progress-bar-step">{step}</div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  step: PropTypes.string.isRequired,
};

export default ProgressBar;

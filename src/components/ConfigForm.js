import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ConfigForm = ({ onSaveConfig, onCancel, initialConfig }) => {
  const [config, setConfig] = useState(initialConfig);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const handleChange = (e) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig(config);
  };

  return (
    <div className="form-container">
      <h2>Edit Config</h2>
      <form id="configForm" onSubmit={handleSubmit}>
        <label htmlFor="facebook_page_id">Facebook Page ID:</label>
        <input
          type="text"
          id="facebook_page_id"
          name="facebook_page_id"
          value={config.facebook_page_id}
          onChange={handleChange}
        />

        <label htmlFor="headline">Headline:</label>
        <input
          type="text"
          id="headline"
          name="headline"
          value={config.headline}
          onChange={handleChange}
        />

        <label htmlFor="link">Link:</label>
        <input
          type="text"
          id="link"
          name="link"
          value={config.link}
          onChange={handleChange}
        />

        <label htmlFor="utm_parameters">UTM Parameters:</label>
        <input
          type="text"
          id="utm_parameters"
          name="utm_parameters"
          value={config.utm_parameters}
          onChange={handleChange}
        />

        <button type="submit" className="save-config-button">Save Config</button>
        <button type="button" className="go-back-button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

ConfigForm.propTypes = {
  onSaveConfig: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialConfig: PropTypes.object.isRequired,
};

export default ConfigForm;

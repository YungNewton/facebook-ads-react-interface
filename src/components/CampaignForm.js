import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CampaignForm = ({ formId, onSubmit, onEditConfig, onGoBack }) => {
  const [campaignName, setCampaignName] = useState('');
  const [campaignId, setCampaignId] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (formId === 'newCampaign') {
      formData.append('campaign_name', campaignName);
    } else {
      formData.append('campaign_id', campaignId);
    }

    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <h2>{formId === 'newCampaign' ? 'Create New Campaign' : 'Use Existing Campaign'}</h2>
      <form id={formId} onSubmit={handleSubmit} encType="multipart/form-data">
        {formId === 'newCampaign' ? (
          <>
            <label htmlFor="campaignName">Campaign Name:</label>
            <input
              type="text"
              id="campaignName"
              name="campaignName"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              required
            />
          </>
        ) : (
          <>
            <label htmlFor="campaignId">Campaign ID:</label>
            <input
              type="text"
              id="campaignId"
              name="campaignId"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              required
            />
          </>
        )}

        <label htmlFor="uploadFolders">Upload Folders:</label>
        <input type="file" id="uploadFolders" name="uploadFolders" webkitdirectory="true" directory="true" multiple required />

        <button type="button" className="edit-config-button" onClick={onEditConfig}>Edit Config</button>
        <button type="submit" className="create-ad-button">Create Ad</button>
        <button type="button" className="go-back-button" onClick={onGoBack}>Go Back</button>
      </form>
    </div>
  );
};

CampaignForm.propTypes = {
  formId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onEditConfig: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export default CampaignForm;

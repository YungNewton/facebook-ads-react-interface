import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CampaignForm from './CampaignForm';
import ConfigForm from './ConfigForm';
import ProgressBar from './ProgressBar';
import SuccessScreen from './SuccessScreen';

const socket = io('http://localhost:5000/');

const getDefaultStartTime = () => {
  const startTime = new Date();
  startTime.setUTCDate(startTime.getUTCDate() + 1);
  startTime.setUTCHours(4, 0, 0, 0);
  return startTime.toISOString().slice(0, 16); // Ensure it is in correct format for datetime-local input
};

const getDefaultEndTime = () => {
  const endTime = new Date();
  endTime.setUTCDate(endTime.getUTCDate() + 2); // Default end time 1 day after start time
  endTime.setUTCHours(4, 0, 0, 0);
  return endTime.toISOString().slice(0, 16); // Ensure it is in correct format for datetime-local input
};

const Main = () => {
  const [formId, setFormId] = useState('mainForm');
  const [previousForm, setPreviousForm] = useState('mainForm');
  const [progress, setProgress] = useState(0);
  const [stepVisible, setStepVisible] = useState(false);
  const [step, setStep] = useState('');
  const [config, setConfig] = useState({
    ad_account_id: 'act_2945173505586523',
    pixel_id: '466400552489809',
    facebook_page_id: '102076431877514',
    app_id: '314691374966102',
    app_secret: '88d92443cfcfc3922cdea79b384a116e',
    access_token: 'EAAEeNcueZAVYBO0NvEUMo378SikOh70zuWuWgimHhnE5Vk7ye8sZCaRtu9qQGWNDvlBZBBnZAT6HCuDlNc4OeOSsdSw5qmhhmtKvrWmDQ8ZCg7a1BZAM1NS69YmtBJWGlTwAmzUB6HuTmb3Vz2r6ig9Xz9ZADDDXauxFCry47Fgh51yS1JCeo295w2V',
    objective: 'OUTCOME_SALES',
    campaign_budget_optimization: 'AD_SET_BUDGET_OPTIMIZATION',
    budget_value: '50.73', // Default value in dollars
    campaign_bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    buying_type: 'AUCTION',
    object_store_url: '',
    location: 'GB',
    age_range_min: '30',
    age_range_max: '65',
    gender: 'All',
    app_events: getDefaultStartTime(),
    ad_creative_primary_text: '',
    ad_creative_headline: '',
    ad_creative_description: '',
    call_to_action: 'SHOP_NOW',
    destination_url: '',
    url_parameters: '',
    ad_set_budget_value: '50.73', // Default ad set budget value in dollars
    ad_format: 'Single image or video', // Default ad format
    bid_amount: '5.0', // Default bid amount value
    end_time: getDefaultEndTime(),
    ad_set_bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    prediction_id: '', // New field for prediction_id
  });
  const [taskId, setTaskId] = useState(null);
  const [uploadController, setUploadController] = useState(null);

  useEffect(() => {
    let progressData = null;
    let logInterval = null;

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('progress', (data) => {
      if (data.task_id === taskId) {
        progressData = data;
        setProgress(data.progress);
        setStep(data.step);
        setStepVisible(true);
        console.log('Received progress:', data);
      }
    });

    socket.on('task_complete', (data) => {
      if (data.task_id === taskId) {
        clearInterval(logInterval);
        setFormId('successScreen');
      }
    });

    socket.on('error', (data) => {
      if (data.task_id === taskId) {
        clearInterval(logInterval);
        alert(`Error: ${data.message}`);
        setFormId('mainForm');
      }
    });

    logInterval = setInterval(() => {
      if (progressData) {
        console.log('Progress:', progressData.progress, 'Step:', progressData.step);
      }
    }, 500);

    return () => {
      clearInterval(logInterval);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('progress');
      socket.off('task_complete');
      socket.off('error');
    };
  }, [taskId]);

  const handleShowForm = (formId) => {
    setPreviousForm(formId === 'configForm' ? previousForm : formId);
    setFormId(formId);
  };

  const handleEditConfig = () => {
    setPreviousForm(formId);
    setFormId('configForm');
  };

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    setFormId(previousForm);
  };

  const handleCancelConfig = () => {
    setFormId(previousForm);
  };

  const handleCancel = () => {
    if (uploadController) {
      uploadController.abort();
      setUploadController(null);
    }

    if (taskId) {
      fetch('http://localhost:5000/cancel_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          setFormId('mainForm');
        })
        .catch((error) => {
          alert('An error occurred while canceling the upload');
          setFormId('mainForm');
        });
    }
  };

  const handleSubmit = (formData, isNewCampaign) => {
    const taskId = `task-${Math.random().toString(36).substr(2, 9)}`;
    setTaskId(taskId);
    formData.append('task_id', taskId);

    // Append all config values to formData
    Object.keys(config).forEach((key) => {
      formData.append(key, config[key]);
    });

    // If buying_type is RESERVED, add prediction_id to formData
    if (config.buying_type === 'RESERVED' && config.prediction_id) {
      formData.append('prediction_id', config.prediction_id);
    }

    const controller = new AbortController();
    setUploadController(controller);

    setProgress(0);
    setStepVisible(false);

    fetch('http://localhost:5000/create_campaign', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          setFormId('mainForm');
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Upload canceled by user');
        } else {
          alert('An error occurred while creating the campaign');
        }
        setFormId('mainForm');
      });

    handleShowForm('progress');
  };

  return (
    <div className="container">
      <h1>Facebook Ads Campaign Manager</h1>
      {formId === 'mainForm' && (
        <div className="form-container">
          <button className="option-button" onClick={() => handleShowForm('newCampaignForm')}>Create New Campaign</button>
          <button className="option-button" onClick={() => handleShowForm('existingCampaignForm')}>Use Existing Campaign</button>
        </div>
      )}
      {formId === 'newCampaignForm' && (
        <CampaignForm
          formId="newCampaign"
          onSubmit={handleSubmit}
          onEditConfig={handleEditConfig}
          onGoBack={() => handleShowForm('mainForm')}
        />
      )}
      {formId === 'existingCampaignForm' && (
        <CampaignForm
          formId="existingCampaign"
          onSubmit={handleSubmit}
          onEditConfig={handleEditConfig}
          onGoBack={() => handleShowForm('mainForm')}
        />
      )}
      {formId === 'configForm' && (
        <ConfigForm
          initialConfig={config}
          onSaveConfig={handleSaveConfig}
          onCancel={handleCancelConfig}
          isNewCampaign={previousForm === 'newCampaignForm'}
        />
      )}
      {formId === 'progress' && (
        <div className="progress-container">
          <ProgressBar progress={progress} step={step} stepVisible={stepVisible} />
          <button className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      )}
      {formId === 'successScreen' && (
        <SuccessScreen onGoBack={() => handleShowForm('mainForm')} />
      )}
    </div>
  );
};

export default Main;

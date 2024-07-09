import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CampaignForm from './CampaignForm';
import ConfigForm from './ConfigForm';
import ProgressBar from './ProgressBar'; // Ensure ProgressBar is imported
import SuccessScreen from './SuccessScreen';

const socket = io('https://fb-ads-backend.onrender.com/');

const Main = () => {
  const [formId, setFormId] = useState('mainForm');
  const [previousForm, setPreviousForm] = useState('mainForm');
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('');
  const [config, setConfig] = useState({
    facebook_page_id: '102076431877514',
    headline: 'No More Neuropathic Foot Pain',
    link: 'https://kyronaclinic.com/pages/review-1',
    utm_parameters: '?utm_source=Facebook&utm_medium={{adset.name}}&utm_campaign={{campaign.name}}&utm_content={{ad.name}}',
  });
  const [taskId, setTaskId] = useState(null);
  const [uploadController, setUploadController] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('progress', (data) => {
      if (data.task_id === taskId) {
        setProgress(data.progress);
        setStep(data.step);
      }
    });

    socket.on('task_complete', (data) => {
      if (data.task_id === taskId) {
        setFormId('successScreen');
      }
    });

    socket.on('error', (data) => {
      if (data.task_id === taskId) {
        alert(`Error: ${data.message}`);
        setFormId('mainForm');
      }
    });

    return () => {
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
      fetch('https://fb-ads-backend.onrender.com/cancel_task', {
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

  const handleSubmit = (formData) => {
    const taskId = `task-${Math.random().toString(36).substr(2, 9)}`;
    setTaskId(taskId);
    formData.append('task_id', taskId);

    if (config.facebook_page_id) {
      formData.append('facebook_page_id', config.facebook_page_id);
      formData.append('headline', config.headline);
      formData.append('link', config.link);
      formData.append('utm_parameters', config.utm_parameters);
    }

    const controller = new AbortController();
    setUploadController(controller);

    fetch('https://fb-ads-backend.onrender.com/create_campaign', {
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
        <ConfigForm initialConfig={config} onSaveConfig={handleSaveConfig} onCancel={handleCancelConfig} />
      )}
      {formId === 'progress' && (
        <div className="progress-container">
          <ProgressBar progress={progress} step={step} />
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

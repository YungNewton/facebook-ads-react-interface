import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CampaignForm from './CampaignForm';
import ConfigForm from './ConfigForm';
import ProgressBar from './ProgressBar';
import SuccessScreen from './SuccessScreen';

const socket = io('http://localhost:5000/');

const Main = () => {
  const [formId, setFormId] = useState('mainForm');
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('');
  const [config, setConfig] = useState({});
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
    setFormId(formId);
  };

  const handleEditConfig = () => {
    setFormId('configForm');
  };

  const handleSaveConfig = (config) => {
    setConfig(config);
    setFormId('mainForm');
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
        <>
          <button className="option-button" onClick={() => handleShowForm('newCampaignForm')}>Create New Campaign</button>
          <button className="option-button" onClick={() => handleShowForm('existingCampaignForm')}>Use Existing Campaign</button>
        </>
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
        <ConfigForm onSaveConfig={handleSaveConfig} onCancel={() => handleShowForm('mainForm')} />
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

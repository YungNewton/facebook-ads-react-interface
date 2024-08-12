import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ConfigForm.css';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const getDefaultStartTime = () => {
  const startTime = new Date();
  startTime.setUTCDate(startTime.getUTCDate() + 1);
  startTime.setUTCHours(4, 0, 0, 0);
  const isoString = startTime.toISOString();
  return isoString.slice(0, 19); // Ensure it is in correct format for datetime-local input with seconds
};

const getDefaultEndTime = () => {
  const endTime = new Date();
  endTime.setUTCDate(endTime.getUTCDate() + 2);
  endTime.setUTCHours(4, 0, 0, 0);
  const isoString = endTime.toISOString();
  return isoString.slice(0, 19); // Ensure it is in correct format for datetime-local input with seconds
};

const ConfigForm = ({ onSaveConfig, onCancel, initialConfig, isNewCampaign }) => {
  const [config, setConfig] = useState({
    ...initialConfig,
    app_events: initialConfig.app_events || getDefaultStartTime(),
    ad_creative_primary_text: initialConfig.ad_creative_primary_text || "",
    ad_creative_headline: initialConfig.ad_creative_headline || "",
    ad_creative_description: initialConfig.ad_creative_description || "",
    call_to_action: initialConfig.call_to_action || "SHOP_NOW",
    link: initialConfig.link || '',
    url_parameters: initialConfig.url_parameters || '',
    display_link: initialConfig.display_link || '',
    destination_url: initialConfig.destination_url || '',
    campaign_budget_optimization: isNewCampaign ? (initialConfig.campaign_budget_optimization || 'AD_SET_BUDGET_OPTIMIZATION') : 'AD_SET_BUDGET_OPTIMIZATION',
    ad_set_budget_optimization: initialConfig.ad_set_budget_optimization || 'DAILY_BUDGET',
    ad_set_budget_value: initialConfig.ad_set_budget_value || initialConfig.budget_value || '50.00',
    ad_set_bid_strategy: initialConfig.ad_set_bid_strategy || 'LOWEST_COST_WITHOUT_CAP',
    campaign_budget_value: initialConfig.campaign_budget_value || '50.00',
    campaign_bid_strategy: initialConfig.campaign_bid_strategy || 'LOWEST_COST_WITHOUT_CAP',
    bid_amount: initialConfig.bid_amount || '',
    ad_format: initialConfig.ad_format || 'Single image or video',
    ad_set_end_time: initialConfig.ad_set_end_time || getDefaultEndTime(),
    prediction_id: initialConfig.prediction_id || '',
    placement_type: initialConfig.placement_type || 'advantage_plus',
    platforms: initialConfig.platforms || {
      facebook: false,
      instagram: false,
      audience_network: false,
      messenger: false,
    },
    placements: initialConfig.placements || {
      feeds: false,
      stories: false,
      in_stream: false,
      search: false,
      messages: false,
      apps_sites: false,
    }
  });

  const [showAppStoreUrl, setShowAppStoreUrl] = useState(initialConfig.objective === 'OUTCOME_APP_PROMOTION');
  const [showBidAmount, setShowBidAmount] = useState(
    ['COST_CAP', 'LOWEST_COST_WITH_BID_CAP'].includes(config.campaign_bid_strategy) ||
    ['COST_CAP', 'LOWEST_COST_WITH_BID_CAP'].includes(config.ad_set_bid_strategy)
  );
  const [showEndDate, setShowEndDate] = useState(
    config.ad_set_budget_optimization === 'LIFETIME_BUDGET' || 
    config.campaign_budget_optimization === 'LIFETIME_BUDGET'
  );  
  const [showPredictionId, setShowPredictionId] = useState(config.buying_type === 'RESERVED');

  useEffect(() => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      campaign_budget_optimization: isNewCampaign ? prevConfig.campaign_budget_optimization : 'AD_SET_BUDGET_OPTIMIZATION',
    }));
  }, [isNewCampaign]);

  useEffect(() => {
    const shouldShowEndDate = (config.campaign_budget_optimization !== 'AD_SET_BUDGET_OPTIMIZATION' && config.campaign_budget_optimization === 'LIFETIME_BUDGET') ||
                              (config.campaign_budget_optimization === 'AD_SET_BUDGET_OPTIMIZATION' && config.ad_set_budget_optimization === 'LIFETIME_BUDGET');
    setShowBidAmount(
      ['COST_CAP', 'LOWEST_COST_WITH_BID_CAP'].includes(config.campaign_bid_strategy) ||
      ['COST_CAP', 'LOWEST_COST_WITH_BID_CAP'].includes(config.ad_set_bid_strategy)
    );
    setShowEndDate(shouldShowEndDate);
    setShowPredictionId(config.buying_type === 'RESERVED');
  }, [config.campaign_bid_strategy, config.ad_set_bid_strategy, config.ad_set_budget_optimization, config.campaign_budget_optimization, config.buying_type]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => {
      const newConfig = {
        ...prevConfig,
        [name]: value,
      };
  
      if (name === 'buying_type' && value === 'RESERVED') {
        newConfig.campaign_budget_optimization = 'AD_SET_BUDGET_OPTIMIZATION';
        newConfig.ad_set_bid_strategy = ''; 
      }
  
      if (name === 'campaign_budget_optimization' && value !== 'AD_SET_BUDGET_OPTIMIZATION') {
        newConfig.buying_type = 'AUCTION';
      }
  
      return newConfig;
    });
  
    if (name === 'objective') {
      setShowAppStoreUrl(value === 'OUTCOME_APP_PROMOTION');
    }
    if (name === 'ad_set_bid_strategy' || name === 'campaign_bid_strategy') {
      setShowBidAmount(['COST_CAP', 'LOWEST_COST_WITH_BID_CAP'].includes(value));
    }
    if (name === 'ad_set_budget_optimization' || name === 'campaign_budget_optimization') {
      const shouldShowEndDate = (name === 'campaign_budget_optimization' && value === 'LIFETIME_BUDGET') ||
                                (name === 'ad_set_budget_optimization' && value === 'LIFETIME_BUDGET' && config.campaign_budget_optimization === 'AD_SET_BUDGET_OPTIMIZATION');
      setShowEndDate(shouldShowEndDate);
    }
    if (name === 'buying_type') {
      setShowPredictionId(value === 'RESERVED');
    }
  };

  const handlePlatformChange = (e) => {
    const { name, checked } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      platforms: {
        ...prevConfig.platforms,
        [name]: checked,
      },
    }));
  };
  
  const handlePlacementChange = (e) => {
    const { name, checked } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      placements: {
        ...prevConfig.placements,
        [name]: checked,
      },
    }));
  };  

  const handlePlacementTypeChange = (e) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      placement_type: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showAppStoreUrl && !config.object_store_url) {
        alert('App Store URL is required for App Promotion objective.');
        return;
    }
    if (!config.destination_url) {
        config.destination_url = config.display_link;
    }
  
    // Serialize platforms and placements
    const serializedConfig = {
        ...config,
        platforms: config.platforms, // No need to serialize; just preserve the structure
        placements: config.placements,
    };
  
    onSaveConfig(serializedConfig);
  };  

  return (
    <div className="form-container">
      <h2>Edit Config</h2>
      <form id="configForm" onSubmit={handleSubmit}>
        <h3>Facebook Connection</h3>
        <label htmlFor="ad_account_id">Ad Account ID:</label>
        <input
          type="text"
          id="ad_account_id"
          name="ad_account_id"
          value={config.ad_account_id}
          onChange={handleChange}
        />
        <label htmlFor="pixel_id">Pixel ID:</label>
        <input
          type="text"
          id="pixel_id"
          name="pixel_id"
          value={config.pixel_id}
          onChange={handleChange}
        />
        <label htmlFor="facebook_page_id">Facebook Page ID:</label>
        <input
          type="text"
          id="facebook_page_id"
          name="facebook_page_id"
          value={config.facebook_page_id}
          onChange={handleChange}
        />
        <label htmlFor="app_id">App ID:</label>
        <input
          type="text"
          id="app_id"
          name="app_id"
          value={config.app_id}
          onChange={handleChange}
        />
        <label htmlFor="app_secret">App Secret:</label>
        <input
          type="text"
          id="app_secret"
          name="app_secret"
          value={config.app_secret}
          onChange={handleChange}
        />
        <label htmlFor="access_token">Access Token:</label>
        <input
          type="text"
          id="access_token"
          name="access_token"
          value={config.access_token}
          onChange={handleChange}
        />

        {isNewCampaign && (
          <>
            <h3>Campaign Level</h3>
            <label htmlFor="objective">Objective:</label>
            <select
              id="objective"
              name="objective"
              value={config.objective}
              onChange={handleChange}
            >
              <option value="OUTCOME_LEADS">Leads</option>
              <option value="OUTCOME_SALES">Sales</option>
              <option value="OUTCOME_ENGAGEMENT">Engagement</option>
              <option value="OUTCOME_AWARENESS">Awareness</option>
              <option value="OUTCOME_TRAFFIC">Traffic</option>
              <option value="OUTCOME_APP_PROMOTION">App Promotion</option>
            </select>

            {showAppStoreUrl && (
              <div>
                <label htmlFor="object_store_url">App Store URL:</label>
                <input
                  type="text"
                  id="object_store_url"
                  name="object_store_url"
                  value={config.object_store_url}
                  onChange={handleChange}
                  required={showAppStoreUrl}
                />
              </div>
            )}

            <label htmlFor="campaign_budget_optimization">Campaign Budget Optimization:</label>
            <select
              id="campaign_budget_optimization"
              name="campaign_budget_optimization"
              value={config.campaign_budget_optimization}
              onChange={handleChange}
            >
              <option value="DAILY_BUDGET">Daily Budget</option>
              <option value="LIFETIME_BUDGET">Lifetime Budget</option>
              <option value="AD_SET_BUDGET_OPTIMIZATION">Ad Set Budget Optimization</option>
            </select>

            {config.campaign_budget_optimization !== 'AD_SET_BUDGET_OPTIMIZATION' && (
              <div>
                <label htmlFor="campaign_budget_value">Campaign Budget Value:</label>
                <input
                  type="number"
                  id="campaign_budget_value"
                  name="campaign_budget_value"
                  value={config.campaign_budget_value}
                  onChange={handleChange}
                />
              </div>
            )}

            {config.campaign_budget_optimization !== 'AD_SET_BUDGET_OPTIMIZATION' && (
              <div>
                <label htmlFor="campaign_bid_strategy">Campaign Bid Strategy:</label>
                <select
                  id="campaign_bid_strategy"
                  name="campaign_bid_strategy"
                  value={config.campaign_bid_strategy}
                  onChange={handleChange}
                >
                  <option value="LOWEST_COST_WITHOUT_CAP">Lowest Cost</option>
                  <option value="COST_CAP">Cost Cap</option>
                  <option value="LOWEST_COST_WITH_BID_CAP">Bid Cap</option>
                </select>
              </div>
            )}

            <label htmlFor="buying_type">Buying Type:</label>
            <select
              id="buying_type"
              name="buying_type"
              value={config.buying_type}
              onChange={handleChange}
            >
              <option value="AUCTION">Auction</option>
              <option value="RESERVED">Reserved</option>
            </select>
          </>
        )}

        <h3>Ad Set Level</h3>

        {config.campaign_budget_optimization === 'AD_SET_BUDGET_OPTIMIZATION' && (
          <>
            <label htmlFor="ad_set_budget_optimization">Ad Set Budget Optimization:</label>
            <select
              id="ad_set_budget_optimization"
              name="ad_set_budget_optimization"
              value={config.ad_set_budget_optimization}
              onChange={handleChange}
            >
              <option value="DAILY_BUDGET">Daily Budget</option>
              <option value="LIFETIME_BUDGET">Lifetime Budget</option>
            </select>

            <label htmlFor="ad_set_budget_value">Ad Set Budget Value:</label>
            <input
              type="number"
              id="ad_set_budget_value"
              name="ad_set_budget_value"
              value={config.ad_set_budget_value}
              onChange={handleChange}
            />

            {showPredictionId && (
              <div>
                <label htmlFor="prediction_id">Prediction ID:</label>
                <input
                  type="text"
                  id="prediction_id"
                  name="prediction_id"
                  value={config.prediction_id}
                  onChange={handleChange}
                />
              </div>
            )}

            {config.buying_type !== 'RESERVED' && (
              <label htmlFor="ad_set_bid_strategy">Ad Set Bid Strategy:</label>
            )}
            {config.buying_type !== 'RESERVED' && (
              <select
                id="ad_set_bid_strategy"
                name="ad_set_bid_strategy"
                value={config.ad_set_bid_strategy}
                onChange={handleChange}
              >
                <option value="LOWEST_COST_WITHOUT_CAP">Lowest Cost</option>
                <option value="COST_CAP">Cost Cap</option>
                <option value="LOWEST_COST_WITH_BID_CAP">Bid Cap</option>
              </select>
            )}
          </>
        )}

        {showEndDate && (
          <div>
            <label htmlFor="ad_set_end_time">Ad Set End Time:</label>
            <input
              type="datetime-local"
              id="ad_set_end_time"
              name="ad_set_end_time"
              value={config.ad_set_end_time}
              onChange={handleChange}
            />
          </div>
        )}

        {showBidAmount && (
          <div>
            <label htmlFor="bid_amount">Bid Amount:</label>
            <input
              type="number"
              id="bid_amount"
              name="bid_amount"
              value={config.bid_amount}
              onChange={handleChange}
            />
          </div>
        )}

        <label htmlFor="location">Location:</label>
        <select
          id="location"
          name="location"
          value={config.location}
          onChange={handleChange}
        >
          {/* List of locations */}
        </select>

        <label htmlFor="age_range">Age Range:</label>
        <div className="age-range-container">
          <select
            id="age_range_min"
            name="age_range_min"
            value={config.age_range_min}
            onChange={handleChange}
          >
            {[...Array(48).keys()].map(age => (
              <option key={age + 18} value={age + 18}>{age + 18}</option>
            ))}
          </select>
          <span className="age-range-separator">to</span>
          <select
            id="age_range_max"
            name="age_range_max"
            value={config.age_range_max}
            onChange={handleChange}
          >
            {[...Array(48).keys()].map(age => (
              <option key={age + 18} value={age + 18}>{age + 18}</option>
            ))}
          </select>
        </div>

        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={config.gender}
          onChange={handleChange}
        >
          <option value="All">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label htmlFor="placement_type">Placement Type:</label>
        <select
          id="placement_type"
          name="placement_type"
          value={config.placement_type}
          onChange={handlePlacementTypeChange}
        >
          <option value="Advantage">Advantage+ placements</option>
          <option value="Manual">Manual</option>
        </select>

        {config.placement_type === 'Manual' && (
          <div className="manual-options">
            <h4>Platforms</h4>
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.platforms.facebook}
                  onChange={handlePlatformChange}
                  name="facebook"
                />
              }
              label="Facebook"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.platforms.instagram}
                  onChange={handlePlatformChange}
                  name="instagram"
                />
              }
              label="Instagram"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.platforms.audience_network}
                  onChange={handlePlatformChange}
                  name="audience_network"
                />
              }
              label="Audience Network"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.platforms.messenger}
                  onChange={handlePlatformChange}
                  name="messenger"
                />
              }
              label="Messenger"
            />

            <h4>Placements</h4>
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.placements.feeds}
                  onChange={handlePlacementChange}
                  name="feeds"
                />
              }
              label="Feeds"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.placements.stories}
                  onChange={handlePlacementChange}
                  name="stories"
                />
              }
              label="Stories"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.placements.in_stream}
                  onChange={handlePlacementChange}
                  name="in_stream"
                />
              }
              label="In-stream ads for videos and reels"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.placements.search}
                  onChange={handlePlacementChange}
                  name="search"
                />
              }
              label="Search results"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.placements.apps_sites}
                  onChange={handlePlacementChange}
                  name="apps_sites"
                />
              }
              label="Apps and sites"
            />
          </div>
        )}
        <label htmlFor="app_events">Schedule:</label>
        <input
          type="datetime-local"
          id="app_events"
          name="app_events"
          value={config.app_events}
          onChange={handleChange}
        />

        <h3>Ad Level</h3>
        <label htmlFor="ad_format">Ad Format:</label>
        <select
          id="ad_format"
          name="ad_format"
          value={config.ad_format}
          onChange={handleChange}
        >
          <option value="Single image or video">Single image or video</option>
          <option value="Carousel">Carousel</option>
        </select>
        <label htmlFor="ad_creative_primary_text">Primary Text:</label>
        <textarea
          id="ad_creative_primary_text"
          name="ad_creative_primary_text"
          value={config.ad_creative_primary_text}
          onChange={handleChange}
          rows="4"
        />
        <label htmlFor="ad_creative_headline">Headline:</label>
        <textarea
          id="ad_creative_headline"
          name="ad_creative_headline"
          value={config.ad_creative_headline}
          onChange={handleChange}
          rows="4"
        />
        <label htmlFor="ad_creative_description">Description:</label>
        <textarea
          id="ad_creative_description"
          name="ad_creative_description"
          value={config.ad_creative_description}
          onChange={handleChange}
          rows="4"
        />
        <label htmlFor="call_to_action">Call to Action:</label>
        <select
          id="call_to_action"
          name="call_to_action"
          value={config.call_to_action}
          onChange={handleChange}
        >
          <option value="SHOP_NOW">Shop Now</option>
          <option value="LEARN_MORE">Learn More</option>
        </select>
        <label htmlFor="destination_url">Destination URL:</label>
        <input
          type="text"
          id="destination_url"
          name="destination_url"
          value={config.destination_url}
          onChange={handleChange}
        />
        <label htmlFor="url_parameters">URL Parameters:</label>
        <input
          type="text"
          id="url_parameters"
          name="url_parameters"
          value={config.url_parameters}
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
  isNewCampaign: PropTypes.bool.isRequired,
};

export default ConfigForm;

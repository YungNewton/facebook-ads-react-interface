import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ConfigForm.css';

const getDefaultStartTime = () => {
  const startTime = new Date();
  startTime.setUTCDate(startTime.getUTCDate() + 1);
  startTime.setUTCHours(4, 0, 0, 0);
  const isoString = startTime.toISOString();
  return isoString.slice(0, 19); // Ensure it is in correct format for datetime-local input with seconds
};

const ConfigForm = ({ onSaveConfig, onCancel, initialConfig }) => {
  const defaultPrimaryText = "Finding it difficult to deal with neuropathic foot pain, as well as stiff and painful joints?"
    + "\n\nNo matter whether your neuropathy is caused by diabetes, chemo-induced, autoimmune disease, or idiopathic conditions... "
    + "Tingling neuropathy has the potential to completely disrupt your life."
    + "\n\nIt is essential to take action right now, without delay, before it is too late..."
    + "\n\nThrough the promotion of blood circulation and the healing of damaged tissue in your foot, the Kyrona Clinics NMES Foot Massager "
    + "utilises cutting-edge technology that provides almost instantaneous relief from neuropathic foot pain, stiffness, and swelling."
    + "\n\nTo use it, all you need is fifteen minutes per day, and you can do it from the convenience of your own home."
    + "\n\nAfter only fourteen days of use, you will experience a significant increase in your level of energy, and you will be able to once "
    + "again take pleasure in living life to the fullest."
    + "\n\nIn addition, the Kyrona Clinics NMES Foot Massager comes with a money-back guarantee for a period of 60 Days and free shipping. "
    + "You will either receive results or see a full refund of your money, guaranteed."
    + "\n\n✅ Stimulates blood flow"
    + "\n✅ Naturally promotes nerve regeneration process (no harsh medication)"
    + "\n✅ Designed & recommended by Dr. Campbell, a top renowned Chicago doctor with over 10 years of experience"
    + "\n\nGet yours now risk-free> https://kyronaclinic.com/pages/review-1"
    + "\n\nFast shipping from the UK warehouse - only 4-7 days!";

  const defaultHeadline = "No More Neuropathic Foot Pain";
  const defaultDescription = "FREE Shipping & 60-Day Money-Back Guarantee";
  const defaultCallToAction = "SHOP_NOW";
  const defaultLink = 'https://kyronaclinic.com/pages/review-1';
  const defaultURLParameters = '?utm_source=Facebook&utm_medium={{adset.name}}&utm_campaign={{campaign.name}}&utm_content={{ad.name}}';

  const [config, setConfig] = useState({
    ...initialConfig,
    app_events: getDefaultStartTime(),
    ad_creative_primary_text: defaultPrimaryText,
    ad_creative_headline: defaultHeadline,
    ad_creative_description: defaultDescription,
    call_to_action: defaultCallToAction,
    link: defaultLink,
    url_parameters: defaultURLParameters,
    display_link: initialConfig.display_link || defaultLink,
    destination_url: initialConfig.destination_url || defaultLink
  });

  const [showAppStoreUrl, setShowAppStoreUrl] = useState(initialConfig.objective === 'OUTCOME_APP_PROMOTION');

  useEffect(() => {
    setConfig({
      ...initialConfig,
      app_events: initialConfig.app_events || getDefaultStartTime(),
      ad_creative_primary_text: initialConfig.ad_creative_primary_text || defaultPrimaryText,
      ad_creative_headline: initialConfig.ad_creative_headline || defaultHeadline,
      ad_creative_description: initialConfig.ad_creative_description || defaultDescription,
      call_to_action: initialConfig.call_to_action || defaultCallToAction,
      link: initialConfig.link || defaultLink,
      url_parameters: initialConfig.url_parameters || defaultURLParameters,
      display_link: initialConfig.display_link || defaultLink,
      destination_url: initialConfig.destination_url || initialConfig.display_link || defaultLink
    });
  }, [initialConfig, defaultPrimaryText]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({
      ...config,
      [name]: value,
    });

    if (name === 'objective') {
      setShowAppStoreUrl(value === 'OUTCOME_APP_PROMOTION');
    }
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
    onSaveConfig(config);
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

        <label htmlFor="budget_value">Budget Value:</label>
        <input
          type="number"
          id="budget_value"
          name="budget_value"
          value={config.budget_value}
          onChange={handleChange}
        />

        <label htmlFor="bid_strategy">Bid Strategy:</label>
        <select
          id="bid_strategy"
          name="bid_strategy"
          value={config.bid_strategy}
          onChange={handleChange}
        >
          <option value="LOWEST_COST_WITHOUT_CAP">Lowest Cost</option>
          <option value="COST_CAP">Cost Cap</option>
          <option value="LOWEST_COST_WITH_BID_CAP">Bid Cap</option>
          <option value="LOWEST_COST_WITH_MIN_ROAS">Lowest Cost with Min ROAS</option>
        </select>

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

        <h3>Ad Set Level</h3>
        <label htmlFor="location">Location:</label>
        <select
          id="location"
          name="location"
          value={config.location}
          onChange={handleChange}
        >
          <option value="AF">Afghanistan</option>
          <option value="AL">Albania</option>
          <option value="DZ">Algeria</option>
          <option value="AD">Andorra</option>
          <option value="AO">Angola</option>
          <option value="AG">Antigua and Barbuda</option>
          <option value="AR">Argentina</option>
          <option value="AM">Armenia</option>
          <option value="AU">Australia</option>
          <option value="AT">Austria</option>
          <option value="AZ">Azerbaijan</option>
          <option value="BS">Bahamas</option>
          <option value="BH">Bahrain</option>
          <option value="BD">Bangladesh</option>
          <option value="BB">Barbados</option>
          <option value="BY">Belarus</option>
          <option value="BE">Belgium</option>
          <option value="BZ">Belize</option>
          <option value="BJ">Benin</option>
          <option value="BT">Bhutan</option>
          <option value="BO">Bolivia</option>
          <option value="BA">Bosnia and Herzegovina</option>
          <option value="BW">Botswana</option>
          <option value="BR">Brazil</option>
          <option value="BN">Brunei</option>
          <option value="BG">Bulgaria</option>
          <option value="BF">Burkina Faso</option>
          <option value="BI">Burundi</option>
          <option value="CV">Cabo Verde</option>
          <option value="KH">Cambodia</option>
          <option value="CM">Cameroon</option>
          <option value="CA">Canada</option>
          <option value="CF">Central African Republic</option>
          <option value="TD">Chad</option>
          <option value="CL">Chile</option>
          <option value="CN">China</option>
          <option value="CO">Colombia</option>
          <option value="KM">Comoros</option>
          <option value="CD">Congo (Democratic Republic)</option>
          <option value="CG">Congo (Republic)</option>
          <option value="CR">Costa Rica</option>
          <option value="HR">Croatia</option>
          <option value="CU">Cuba</option>
          <option value="CY">Cyprus</option>
          <option value="CZ">Czechia</option>
          <option value="DK">Denmark</option>
          <option value="DJ">Djibouti</option>
          <option value="DM">Dominica</option>
          <option value="DO">Dominican Republic</option>
          <option value="EC">Ecuador</option>
          <option value="EG">Egypt</option>
          <option value="SV">El Salvador</option>
          <option value="GQ">Equatorial Guinea</option>
          <option value="ER">Eritrea</option>
          <option value="EE">Estonia</option>
          <option value="SZ">Eswatini</option>
          <option value="ET">Ethiopia</option>
          <option value="FJ">Fiji</option>
          <option value="FI">Finland</option>
          <option value="FR">France</option>
          <option value="GA">Gabon</option>
          <option value="GM">Gambia</option>
          <option value="GE">Georgia</option>
          <option value="DE">Germany</option>
          <option value="GH">Ghana</option>
          <option value="GR">Greece</option>
          <option value="GD">Grenada</option>
          <option value="GT">Guatemala</option>
          <option value="GN">Guinea</option>
          <option value="GW">Guinea-Bissau</option>
          <option value="GY">Guyana</option>
          <option value="HT">Haiti</option>
          <option value="HN">Honduras</option>
          <option value="HU">Hungary</option>
          <option value="IS">Iceland</option>
          <option value="IN">India</option>
          <option value="ID">Indonesia</option>
          <option value="IR">Iran</option>
          <option value="IQ">Iraq</option>
          <option value="IE">Ireland</option>
          <option value="IL">Israel</option>
          <option value="IT">Italy</option>
          <option value="JM">Jamaica</option>
          <option value="JP">Japan</option>
          <option value="JO">Jordan</option>
          <option value="KZ">Kazakhstan</option>
          <option value="KE">Kenya</option>
          <option value="KI">Kiribati</option>
          <option value="KP">Korea (North)</option>
          <option value="KR">Korea (South)</option>
          <option value="KW">Kuwait</option>
          <option value="KG">Kyrgyzstan</option>
          <option value="LA">Laos</option>
          <option value="LV">Latvia</option>
          <option value="LB">Lebanon</option>
          <option value="LS">Lesotho</option>
          <option value="LR">Liberia</option>
          <option value="LY">Libya</option>
          <option value="LI">Liechtenstein</option>
          <option value="LT">Lithuania</option>
          <option value="LU">Luxembourg</option>
          <option value="MG">Madagascar</option>
          <option value="MW">Malawi</option>
          <option value="MY">Malaysia</option>
          <option value="MV">Maldives</option>
          <option value="ML">Mali</option>
          <option value="MT">Malta</option>
          <option value="MH">Marshall Islands</option>
          <option value="MR">Mauritania</option>
          <option value="MU">Mauritius</option>
          <option value="MX">Mexico</option>
          <option value="FM">Micronesia</option>
          <option value="MD">Moldova</option>
          <option value="MC">Monaco</option>
          <option value="MN">Mongolia</option>
          <option value="ME">Montenegro</option>
          <option value="MA">Morocco</option>
          <option value="MZ">Mozambique</option>
          <option value="MM">Myanmar</option>
          <option value="NA">Namibia</option>
          <option value="NR">Nauru</option>
          <option value="NP">Nepal</option>
          <option value="NL">Netherlands</option>
          <option value="NZ">New Zealand</option>
          <option value="NI">Nicaragua</option>
          <option value="NE">Niger</option>
          <option value="NG">Nigeria</option>
          <option value="MK">North Macedonia</option>
          <option value="NO">Norway</option>
          <option value="OM">Oman</option>
          <option value="PK">Pakistan</option>
          <option value="PW">Palau</option>
          <option value="PA">Panama</option>
          <option value="PG">Papua New Guinea</option>
          <option value="PY">Paraguay</option>
          <option value="PE">Peru</option>
          <option value="PH">Philippines</option>
          <option value="PL">Poland</option>
          <option value="PT">Portugal</option>
          <option value="QA">Qatar</option>
          <option value="RO">Romania</option>
          <option value="RU">Russia</option>
          <option value="RW">Rwanda</option>
          <option value="KN">Saint Kitts and Nevis</option>
          <option value="LC">Saint Lucia</option>
          <option value="VC">Saint Vincent and the Grenadines</option>
          <option value="WS">Samoa</option>
          <option value="SM">San Marino</option>
          <option value="ST">Sao Tome and Principe</option>
          <option value="SA">Saudi Arabia</option>
          <option value="SN">Senegal</option>
          <option value="RS">Serbia</option>
          <option value="SC">Seychelles</option>
          <option value="SL">Sierra Leone</option>
          <option value="SG">Singapore</option>
          <option value="SK">Slovakia</option>
          <option value="SI">Slovenia</option>
          <option value="SB">Solomon Islands</option>
          <option value="SO">Somalia</option>
          <option value="ZA">South Africa</option>
          <option value="SS">South Sudan</option>
          <option value="ES">Spain</option>
          <option value="LK">Sri Lanka</option>
          <option value="SD">Sudan</option>
          <option value="SR">Suriname</option>
          <option value="SE">Sweden</option>
          <option value="CH">Switzerland</option>
          <option value="SY">Syria</option>
          <option value="TW">Taiwan</option>
          <option value="TJ">Tajikistan</option>
          <option value="TZ">Tanzania</option>
          <option value="TH">Thailand</option>
          <option value="TL">Timor-Leste</option>
          <option value="TG">Togo</option>
          <option value="TO">Tonga</option>
          <option value="TT">Trinidad and Tobago</option>
          <option value="TN">Tunisia</option>
          <option value="TR">Turkey</option>
          <option value="TM">Turkmenistan</option>
          <option value="TV">Tuvalu</option>
          <option value="UG">Uganda</option>
          <option value="UA">Ukraine</option>
          <option value="AE">United Arab Emirates</option>
          <option value="GB">United Kingdom</option>
          <option value="US">United States</option>
          <option value="UY">Uruguay</option>
          <option value="UZ">Uzbekistan</option>
          <option value="VU">Vanuatu</option>
          <option value="VA">Vatican City</option>
          <option value="VE">Venezuela</option>
          <option value="VN">Vietnam</option>
          <option value="YE">Yemen</option>
          <option value="ZM">Zambia</option>
          <option value="ZW">Zimbabwe</option>
          <option value="PS">Palestine</option>
          {/* Add more locations as needed */}
        </select>

        <label htmlFor="age_range">Age Range:</label>
        <div className="age-range-container">
          <select
            id="age_range_min"
            name="age_range_min"
            value={config.age_range_min}
            onChange={handleChange}
          >
            {[...Array(100).keys()].map(age => (
              <option key={age + 1} value={age + 1}>{age + 1}</option>
            ))}
          </select>
          <span className="age-range-separator">to</span>
          <select
            id="age_range_max"
            name="age_range_max"
            value={config.age_range_max}
            onChange={handleChange}
          >
            {[...Array(100).keys()].map(age => (
              <option key={age + 1} value={age + 1}>{age + 1}</option>
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
        <label htmlFor="app_events">Schedule:</label>
        <input
          type="datetime-local"
          id="app_events"
          name="app_events"
          value={config.app_events}
          onChange={handleChange}
        />

        <h3>Ad Level</h3>
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
          <option value="SIGN_UP">Sign Up</option>
          <option value="SUBSCRIBE">Subscribe</option>
          <option value="CONTACT_US">Contact Us</option>
          <option value="GET_OFFER">Get Offer</option>
          <option value="GET_QUOTE">Get Quote</option>
          <option value="DOWNLOAD">Download</option>
          <option value="ORDER_NOW">Order Now</option>
          <option value="BOOK_NOW">Book Now</option>
          <option value="WATCH_MORE">Watch More</option>
          <option value="APPLY_NOW">Apply Now</option>
          <option value="BUY_TICKETS">Buy Tickets</option>
          <option value="GET_SHOWTIMES">Get Showtimes</option>
          <option value="LISTEN_NOW">Listen Now</option>
          <option value="PLAY_GAME">Play Game</option>
          <option value="REQUEST_TIME">Request Time</option>
          <option value="SEE_MENU">See Menu</option>
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
};

export default ConfigForm;

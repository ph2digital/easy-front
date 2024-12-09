import React, { useState } from 'react';
import './styles/Settings.css';
import { fetchUserPages } from '../services/api'; // Import fetchUserPages
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const mockSettings = [
  { id: '1', name: 'Account Information', description: 'Manage your account details', enabled: true },
  { id: '2', name: 'Security', description: 'Update your security settings', enabled: true },
  { id: '3', name: 'Notifications', description: 'Configure your notification preferences', enabled: false },
  { id: '4', name: 'Billing', description: 'Manage your billing information', enabled: true },
  { id: '5', name: 'Integrations', description: 'Connect with third-party services', enabled: false },
  { id: '6', name: 'Privacy', description: 'Adjust your privacy settings', enabled: true },
];

const mockPostCreation = () => {
  console.log('Mock post created');
  alert('Post created successfully!');
};

const UserPreferences: React.FC<{ settings: any[], toggleSetting: (id: string) => void }> = ({ settings, toggleSetting }) => {
  return (
    <ul>
      {settings.map((setting) => (
        <li key={setting.id} className="setting-item">
          <span>{setting.name}</span>: {setting.description}
          <button onClick={() => toggleSetting(setting.id)}>
            {setting.enabled ? 'Disable' : 'Enable'}
          </button>
        </li>
      ))}
    </ul>
  );
};

const NotificationSettings: React.FC = () => {
  return (
    <div className="notification-settings">
      <h2>Notification Settings</h2>
      {/* Add notification settings implementation here */}
    </div>
  );
};

const Settings: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [settings, setSettings] = useState(mockSettings);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset settings?')) {
      console.log('Settings reset');
      setSuccessMessage('Settings have been successfully reset.');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
    }
  };

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
    setSuccessMessage('Setting has been successfully toggled.');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
  };

  const handleFetchUserPages = async () => {
    const accessToken = 'mockAccessToken'; // Replace with actual access token
    const pages = await fetchUserPages(accessToken);
    console.log('Fetched user pages:', pages);
    alert(`Fetched user pages: ${pages.map((page: any) => page.name).join(', ')}`);
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      <UserPreferences settings={settings} toggleSetting={toggleSetting} />
      <NotificationSettings />
      <button className="reset-button" onClick={handleReset}>Reset Settings</button>
      <button onClick={handleFetchUserPages}>Fetch User Pages</button>
      <button onClick={() => navigate('/create-post')}>Create New Post</button> {/* Add button to navigate */}
      <button className="create-post-button" onClick={mockPostCreation}>Create New Post</button> {/* Mock post creation */}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default Settings;

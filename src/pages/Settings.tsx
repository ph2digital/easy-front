// src/pages/Settings.tsx
import React, { useState } from 'react';
import './styles/Settings.css';

const mockSettings = [
  { id: '1', name: 'Account Information', description: 'Manage your account details', enabled: true },
  { id: '2', name: 'Security', description: 'Update your security settings', enabled: true },
  { id: '3', name: 'Notifications', description: 'Configure your notification preferences', enabled: false },
  { id: '4', name: 'Billing', description: 'Manage your billing information', enabled: true },
  { id: '5', name: 'Integrations', description: 'Connect with third-party services', enabled: false },
  { id: '6', name: 'Privacy', description: 'Adjust your privacy settings', enabled: true },
];

const Settings: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [settings, setSettings] = useState(mockSettings);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset settings?')) {
      console.log('Settings reset');
      setSuccessMessage('Settings have been successfully reset.');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
    }
  };

  const handleEditSetting = (id: string) => {
    const newDescription = prompt('Enter new description:');
    if (newDescription) {
      setSettings(settings.map(setting => 
        setting.id === id ? { ...setting, description: newDescription } : setting
      ));
      setSuccessMessage('Setting has been successfully edited.');
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

  return (
    <div className="settings">
      <h1>Settings</h1>
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
      <button className="reset-button" onClick={handleReset}>Reset Settings</button>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default Settings;

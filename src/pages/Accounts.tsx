// src/components/Accounts.tsx

import React, { useState } from 'react';
import AccountConnection from '../components/account/AccountConnection';
import AccountStatus from '../components/account/AccountStatus';
import './styles/Accounts.css';

const mockPages = [
  { id: '1', name: 'Page 1', icon: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Page 2', icon: 'https://via.placeholder.com/50' },
  { id: '3', name: 'Page 3', icon: 'https://via.placeholder.com/50' },
];

const mockAdAccounts = [
  { id: '1', name: 'Ad Account 1', type: 'Facebook Ads' },
  { id: '2', name: 'Ad Account 2', type: 'Instagram Ads' },
  { id: '3', name: 'Ad Account 3', type: 'Facebook Ads' },
];

const Accounts: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [pages] = useState(mockPages);
  const [adAccounts] = useState(mockAdAccounts);

  const handleConnectPage = () => {
    console.log('Connect new page');
    setSuccessMessage('New page has been successfully connected.');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
  };

  return (
    <div className="accounts" id="accounts-page">
      <h1 className="accounts-title">Conectar Contas</h1>
      <AccountConnection pages={pages} onConnectPage={handleConnectPage} />
      <AccountStatus adAccounts={adAccounts} />
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default Accounts;



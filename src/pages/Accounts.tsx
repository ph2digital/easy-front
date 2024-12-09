// src/components/Accounts.tsx

import React, { useState } from 'react';
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
  const [pages, setPages] = useState(mockPages);
  const [adAccounts, setAdAccounts] = useState(mockAdAccounts);

  const handleConnectPage = () => {
    console.log('Connect new page');
    setSuccessMessage('New page has been successfully connected.');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
  };

  return (
    <div className="accounts" id="accounts-page">
      <h1 className="accounts-title">Conectar Contas</h1>
      <div className="pages-section">
        <h2 className="pages-title">Páginas Conectadas</h2>
        <ul className="pages-list">
          {pages.map((page) => (
            <li key={page.id} className="page-item" id={`page-item-${page.id}`}>
              <img src={page.icon} alt={page.name} className="page-icon" />
              <span className="page-name">{page.name}</span>
            </li>
          ))}
        </ul>
        <button className="connect-page-button" onClick={handleConnectPage}>Conectar Página</button>
      </div>
      <div className="ad-accounts-section">
        <h2 className="ad-accounts-title">Contas de Anúncios Conectadas</h2>
        <ul className="ad-accounts-list">
          {adAccounts.map((account) => (
            <li key={account.id} className="ad-account-item" id={`ad-account-item-${account.id}`}>
              <span className="ad-account-name">{account.name}</span> ({account.type})
            </li>
          ))}
        </ul>
      </div>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default Accounts;



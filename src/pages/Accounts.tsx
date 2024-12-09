// src/components/Accounts.tsx

import React, { useState, useEffect } from 'react';
import AccountConnection from '../components/account/AccountConnection';
import AccountStatus from '../components/account/AccountStatus';
import './styles/Accounts.css';
import { getMockPages, getMockAdAccounts } from '../services/mockData';

const Accounts: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [pages, setPages] = useState<{ id: string; name: string; icon: string; }[]>([]);
  const [adAccounts, setAdAccounts] = useState<{ id: string; name: string; type: string; icon: string; }[]>([]);
  const [loading, setLoading] = useState(true);

  const handleConnectPage = async () => {
    console.log('Connect new page');
    setSuccessMessage('New page has been successfully connected.');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
  };

  const handleLinkAdAccount = async () => {
    console.log('Link new ad account');
    setSuccessMessage('New ad account has been successfully linked.');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
  };

  const fetchData = async () => {
    setLoading(true);
    const fetchedPages = getMockPages();
    const fetchedAdAccounts = getMockAdAccounts();
    setPages(fetchedPages);
    setAdAccounts(fetchedAdAccounts);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="accounts" id="accounts-page">
      <h1 className="accounts-title">Conectar Contas</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <AccountConnection pages={pages} onConnectPage={handleConnectPage} />
          <AccountStatus adAccounts={adAccounts} onLinkAdAccount={handleLinkAdAccount} />
          {successMessage && <div className="success-message">{successMessage}</div>}
        </>
      )}
    </div>
  );
};

export default Accounts;



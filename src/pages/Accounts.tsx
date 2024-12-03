// src/components/Accounts.tsx

import React, { useState } from 'react';
import './styles/Accounts.css';

const mockAccounts = [
  { id: '1', name: 'Google Ads Account 1', type: 'Google Ads' },
  { id: '2', name: 'Facebook Ads Account 1', type: 'Facebook Ads' },
  { id: '3', name: 'Google Ads Account 2', type: 'Google Ads' },
];

const Accounts: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [accounts, setAccounts] = useState(mockAccounts);

  const handleAddAccount = () => {
    if (window.confirm('Are you sure you want to add a new account?')) {
      console.log('Add new account');
      setSuccessMessage('New account has been successfully added.');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
    }
  };

  const handleShareCampaign = () => {
    console.log('Share campaign structure');
    setSuccessMessage('Campaign structure has been successfully shared.');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
  };

  const handleManageBudgets = () => {
    console.log('Manage multi-account budgets');
    setSuccessMessage('Multi-account budgets management opened.');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
  };

  const handleEditAccount = (id: string) => {
    const newName = prompt('Enter new account name:');
    if (newName) {
      setAccounts(accounts.map(account => 
        account.id === id ? { ...account, name: newName } : account
      ));
      setSuccessMessage('Account has been successfully edited.');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
    }
  };

  return (
    <div className="accounts">
      <h1>Cadastrar Contas</h1>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>
            <span>{account.name}</span> ({account.type})
            <button onClick={() => handleEditAccount(account.id)}>Edit</button>
          </li>
        ))}
      </ul>
      <button className="add-account-button" onClick={handleAddAccount}>Add New Account</button>
      <button className="share-campaign-button" onClick={handleShareCampaign}>Share Campaign Structure</button>
      <button className="manage-budgets-button" onClick={handleManageBudgets}>Manage Multi-Account Budgets</button>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default Accounts;



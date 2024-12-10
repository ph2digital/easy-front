// src/components/Accounts.tsx

import React, { useState, useEffect } from 'react';
import AccountConnection from '../components/account/AccountConnection';
import AccountStatus from '../components/account/AccountStatus';
import './styles/Accounts.css';
import { getMockPages, getMockAdAccounts, activateAdAccount, deactivateAdAccount, addAdAccount, removeAdAccount } from '../services/mockData';

const Accounts: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [pages, setPages] = useState<{ id: string; name: string; icon: string; }[]>([]);
  const [adAccounts, setAdAccounts] = useState<{ id: string; name: string; type: string; icon: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState('');
  const [newAccountIcon, setNewAccountIcon] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

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

  const handleActivateAccount = (accountId: string) => {
    activateAdAccount(accountId);
    fetchData();
  };

  const handleDeactivateAccount = (accountId: string) => {
    deactivateAdAccount(accountId);
    fetchData();
  };

  const handleAddAccountClick = () => {
    setShowCreatePopup(true);
  };

  const handleCloseCreatePopup = () => {
    setShowCreatePopup(false);
  };

  const handleCreateNewAccount = () => {
    const newAccount = { id: `${adAccounts.length + 1}`, name: newAccountName, type: newAccountType, icon: newAccountIcon };
    addAdAccount(newAccount);
    setSuccessMessage('New ad account has been successfully created.');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
    setShowCreatePopup(false);
    fetchData();
  };

  const handleRemoveAccount = (accountId: string) => {
    removeAdAccount(accountId);
    fetchData();
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
          <AccountStatus
            adAccounts={adAccounts}
            onLinkAdAccount={handleLinkAdAccount}
            onActivateAccount={handleActivateAccount}
            onDeactivateAccount={handleDeactivateAccount}
            onRemoveAccount={handleRemoveAccount}
          />
          {successMessage && <div className="success-message">{successMessage}</div>}
          <button className="add-account-button" onClick={handleAddAccountClick}>Adicionar Conta de Anúncio</button>
          {showCreatePopup && (
            <div className="popup">
              <div className="popup-content">
                <h3>Criar Nova Conta de Anúncio</h3>
                <input
                  type="text"
                  placeholder="Nome da Conta"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Tipo da Conta"
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="URL do Ícone"
                  value={newAccountIcon}
                  onChange={(e) => setNewAccountIcon(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Nome da Empresa"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Endereço da Empresa"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
                <button onClick={handleCreateNewAccount}>Criar</button>
                <button onClick={handleCloseCreatePopup}>Fechar</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Accounts;



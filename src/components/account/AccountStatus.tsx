import React, { useState } from 'react';
import { addAdAccount } from '../../services/mockData';

interface AccountStatusProps {
  adAccounts: any[];
  onLinkAdAccount: () => void;
  onActivateAccount: (accountId: string) => void;
  onDeactivateAccount: (accountId: string) => void;
  onRemoveAccount: (accountId: string) => void;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ adAccounts, onLinkAdAccount, onActivateAccount, onDeactivateAccount, onRemoveAccount }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState('');
  const [newAccountIcon, setNewAccountIcon] = useState('');

  const handleLinkAdAccountClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCreateNewAccountClick = () => {
    setShowCreatePopup(true);
  };

  const handleCloseCreatePopup = () => {
    setShowCreatePopup(false);
  };

  const handleCreateNewAccount = () => {
    const newAccount = { id: `${adAccounts.length + 1}`, name: newAccountName, type: newAccountType, icon: newAccountIcon };
    addAdAccount(newAccount);
    onLinkAdAccount();
    setShowCreatePopup(false);
    setShowPopup(false);
  };

  const handleToggleActivation = (accountId: string, isActive: boolean) => {
    if (isActive) {
      onDeactivateAccount(accountId);
    } else {
      onActivateAccount(accountId);
    }
  };

  return (
    <div className="ad-accounts-section">
      <h2 className="ad-accounts-title">Contas de Anúncios Conectadas</h2>
      <ul className="ad-accounts-list">
        {adAccounts.map((account) => (
          <li key={account.id} className="ad-account-item" id={`ad-account-item-${account.id}`}>
            <img src={account.icon} alt={account.name} className="ad-account-icon" />
            <span className="ad-account-name">{account.name}</span> ({account.type})
            <button onClick={() => handleToggleActivation(account.id, account.isActive)}>
              {account.isActive ? 'Desativar' : 'Ativar'}
            </button>
            <button onClick={() => onRemoveAccount(account.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <button className="link-ad-account-button" onClick={handleLinkAdAccountClick}>Vincular Conta de Anúncio</button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Vincular Nova Conta de Anúncio</h3>
            {/* Add options for ad accounts here */}
            <button onClick={onLinkAdAccount}>Vincular</button>
            <button onClick={handleCreateNewAccountClick}>Criar Nova Conta</button>
            <button onClick={handleClosePopup}>Fechar</button>
          </div>
        </div>
      )}
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
            <button onClick={handleCreateNewAccount}>Criar</button>
            <button onClick={handleCloseCreatePopup}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountStatus;
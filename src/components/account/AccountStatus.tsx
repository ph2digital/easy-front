import React from 'react';

interface AccountStatusProps {
  adAccounts: any[];
  onLinkAdAccount: () => void;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ adAccounts, onLinkAdAccount }) => {
  return (
    <div className="ad-accounts-section">
      <h2 className="ad-accounts-title">Contas de Anúncios Conectadas</h2>
      <ul className="ad-accounts-list">
        {adAccounts.map((account) => (
          <li key={account.id} className="ad-account-item" id={`ad-account-item-${account.id}`}>
            <img src={account.icon} alt={account.name} className="ad-account-icon" />
            <span className="ad-account-name">{account.name}</span> ({account.type})
          </li>
        ))}
      </ul>
      <button className="link-ad-account-button" onClick={onLinkAdAccount}>Vincular Conta de Anúncio</button>
    </div>
  );
};

export default AccountStatus;
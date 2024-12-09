
import React from 'react';

interface AccountStatusProps {
  adAccounts: any[];
}

const AccountStatus: React.FC<AccountStatusProps> = ({ adAccounts }) => {
  return (
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
  );
};

export default AccountStatus;
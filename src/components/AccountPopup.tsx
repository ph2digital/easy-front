import React from 'react';
import './styles/AccountPopup.css';

interface AccountPopupProps {
  googleAccounts: any[];
  facebookAccounts: any[];
  handleAccountClick: (accountId: string) => Promise<void>;
  handleFacebookLogin: () => Promise<void>;
  loadingGoogleAccounts: boolean;
  loadingFacebookAccounts: boolean;
}

const AccountPopup: React.FC<AccountPopupProps> = ({
  googleAccounts,
  facebookAccounts,
  handleAccountClick,
  handleFacebookLogin,
  loadingGoogleAccounts,
  loadingFacebookAccounts,
}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button onClick={handleFacebookLogin}>Vincular Facebook Ads</button>
        <h3>Contas Vinculadas</h3>
        <div className="account-table">
          <h4>Google Ads</h4>
          {loadingGoogleAccounts ? (
            <p>Carregando contas do Google Ads...</p>
          ) : (
            <ul>
              {googleAccounts.map((account) => (
                <li key={account.account_id} onClick={() => handleAccountClick(account.account_id)}>
                  {account.account_id}
                </li>
              ))}
            </ul>
          )}
          <h4>Facebook Ads</h4>
          {loadingFacebookAccounts ? (
            <p>Carregando contas do Facebook Ads...</p>
          ) : (
            <ul>
              {facebookAccounts.map((account) => (
                <li key={account.account_id} onClick={() => handleAccountClick(account.account_id)}>
                  {account.account_id}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPopup;
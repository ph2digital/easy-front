import React from 'react';
import './styles/AccountPopup.css';

interface AccountPopupProps {
  googleAccounts: any[];
  facebookAccounts: any[];
  handleAccountClick: (accountId: string) => void;
  handleLinkAccount: (platform: string) => void;
  handleFacebookLogin: () => void;
  setShowPopup: (show: boolean) => void;
  loadingGoogleAccounts: boolean;
  loadingFacebookAccounts: boolean;
  activeCustomers: any[];
  toggleAccountStatus: (accountId: string) => void;
}

const AccountPopup: React.FC<AccountPopupProps> = ({
  googleAccounts,
  facebookAccounts,
  handleAccountClick,
  handleLinkAccount,
  handleFacebookLogin,
  setShowPopup,
  loadingGoogleAccounts,
  loadingFacebookAccounts,
  activeCustomers,
  toggleAccountStatus
}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={() => setShowPopup(false)}>×</button>
        <h2>Vincular Contas</h2>
        <div className="link-buttons">
          <button onClick={() => handleLinkAccount('google')}>Vincular Google Ads</button>
          <button onClick={handleFacebookLogin}>Vincular Facebook Ads</button>
        </div>
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
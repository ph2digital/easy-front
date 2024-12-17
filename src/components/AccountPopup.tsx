import React from 'react';
import './styles/AccountPopup.css';

interface AccountPopupProps {
  googleAccounts: any[];
  facebookAccounts: any[];
  activeCustomers: any[];
  handleAccountClick: (accountId: string) => void;
  handleLinkAccount: (platform: string) => void;
  handleFacebookLogin: () => void;
  setShowPopup: (show: boolean) => void;
  loadingGoogleAccounts: boolean;
  loadingFacebookAccounts: boolean;
  toggleAccountStatus: (accountId: string, platform: string) => void;
}

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const AccountPopup: React.FC<AccountPopupProps> = ({
  googleAccounts,
  facebookAccounts,
  activeCustomers,
  handleAccountClick,
  handleLinkAccount,
  handleFacebookLogin,
  setShowPopup,
  loadingGoogleAccounts,
  loadingFacebookAccounts,
  toggleAccountStatus,
}) => {
  const renderAccountList = (accounts: any[], platform: string) => (
    <ul>
      {accounts.map((account) => (
        <li key={`${platform}-${account.customer_id || account.account_id}`}>
          <div>ID do Cliente: {account.customer_id || account.account_id}</div>
          <div>Tipo: {account.type}</div>
          <div>Está Ativo: {account.is_active ? 'Sim' : 'Não'}</div>
          <button onClick={() => handleAccountClick(account.customer_id || account.account_id)}>Ativar</button>

        </li>
      ))}
    </ul>
  );

  const renderCustomerList = (customers: any[], platform: string) => (
    <ul>
      {customers.map((customer) => (
        <li key={customer.id}>
          <div>Nome: {customer.name}</div>
          <button
            className={`toggle-button ${customer.is_active ? 'active' : 'inactive'}`}
            onClick={() => toggleAccountStatus(customer.id, platform)}
          >
            {customer.is_active ? 'Ativado' : 'Desativado'}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={() => setShowPopup(false)}>X</button>
        <h2>Vincule Suas Contas de Anúncios</h2>
        <p>Por favor, vincule suas contas do Google Ads ou Facebook Ads para continuar.</p>
        {googleAccounts.length > 0 && (
          <div>
            <h3>Contas do Google Ads</h3>
            {renderAccountList(googleAccounts, 'google_ads')}
          </div>
        )}
        {facebookAccounts.length > 0 && (
          <div>
            <h3>Contas do Facebook Ads</h3>
            <table className="account-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Nome da Empresa</th>
                  <th>Valor Gasto</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {facebookAccounts.map((account) => (
                  <tr key={`facebook-${account.account_id}`}>
                    <td>{account.account_id}</td>
                    <td>{account.accountDetails?.name || account.account_id}</td>
                    <td>{account.accountDetails?.business_name || 'N/A'}</td>
                    <td>{formatCurrency(account.accountDetails?.amount_spent || 0, account.accountDetails?.currency || 'USD')}</td>
                    <td>
                      <button onClick={() => handleAccountClick(account.account_id)}>Ativar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
       
      </div>
    </div>
  );
};

export default AccountPopup;
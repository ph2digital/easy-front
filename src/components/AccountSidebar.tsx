import React from 'react';
import './styles/AccountSidebar.css';

interface AccountSidebarProps {
  selectedAccount: string | null;
  setSelectedAccount: (customer_id: string) => void;
  activeCustomers: any[];
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ selectedAccount, setSelectedAccount, activeCustomers }) => {
  const googleAccounts = activeCustomers.filter(account => account.type === 'google_ads');
  const facebookAccounts = activeCustomers.filter(account => account.type === 'meta_ads');

  const handleAccountClick = (customer_id: string) => {
    setSelectedAccount(customer_id);
    localStorage.setItem('selectedCustomer', customer_id);
  };

  return (
    <div className="account-sidebar">
      <h2>Contas Vinculadas</h2>
      <div className="account-list">
        <h3>Google Ads</h3>
        <ul>
          {googleAccounts.map((account) => (
            <li
              key={`google-${account.id}`}
              className={selectedAccount === account.id ? 'selected' : ''}
              onClick={() => handleAccountClick(account.customer_id)}
            >
              {account.accountdetails_name || account.accountdetails_business_name || account.customer_id}
            </li>
          ))}
        </ul>
        <h3>Facebook Ads</h3>
        <ul>
          {facebookAccounts.map((account) => (
            <li
              key={`facebook-${account.id}`}
              className={selectedAccount === account.id ? 'selected' : ''}
              onClick={() => handleAccountClick(account.customer_id)}
            >
              {account.accountdetails_name || account.accountdetails_business_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccountSidebar;
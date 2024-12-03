import React, { useEffect } from 'react';
import './styles/AccountSidebar.css';

interface AccountSidebarProps {
  googleAccounts: any[];
  facebookAccounts: any[];
  selectedAccount: string | null;
  setSelectedAccount: (accountId: string) => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ googleAccounts, facebookAccounts, selectedAccount, setSelectedAccount }) => {
  useEffect(() => {
    console.log('AccountSidebar - Google Accounts:', googleAccounts);
    console.log('AccountSidebar - Facebook Accounts:', facebookAccounts);
  }, [googleAccounts, facebookAccounts]);

  return (
    <div className="account-sidebar">
      <h3>Contas Vinculadas</h3>
      <div className="account-list">
        <h4>Facebook Ads</h4>
        <ul>
          {facebookAccounts.map((account) => (
            <li
              key={`facebook-${account.account_id}`}
              className={selectedAccount === account.account_id ? 'selected' : ''}
              onClick={() => setSelectedAccount(account.account_id)}
            >
              {account.accountDetails.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccountSidebar;
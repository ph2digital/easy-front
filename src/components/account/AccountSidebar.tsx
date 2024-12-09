import React, { useEffect, useState } from 'react';
import '../styles/AccountSidebar.css';
import { getMockGoogleAdsAccounts, getMockFacebookAdAccounts } from '../../services/mockData'; // Import mock data

interface AccountSidebarProps {
  selectedAccount: string | null;
  setSelectedAccount: (accountId: string) => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ selectedAccount, setSelectedAccount }) => {
  const [googleAccounts, setGoogleAccounts] = useState<any[]>([]);
  const [facebookAccounts, setFacebookAccounts] = useState<any[]>([]);

  useEffect(() => {
    const googleAdsAccounts = getMockGoogleAdsAccounts().customerIds.map(id => ({ customer_id: id.customer_id, type: id.type, is_active: id.is_active }));
    const facebookAdsAccounts = getMockFacebookAdAccounts().customerIds.map(id => ({ customer_id: id.customer_id, type: id.type, is_active: id.is_active }));
    setGoogleAccounts(googleAdsAccounts);
    setFacebookAccounts(facebookAdsAccounts);
  }, []);

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
              key={`facebook-${account.customer_id}`}
              className={selectedAccount === account.customer_id ? 'selected' : ''}
              onClick={() => setSelectedAccount(account.customer_id)}
            >
              {account.customer_id}
            </li>
          ))}
        </ul>
        <h4>Google Ads</h4>
        <ul>
          {googleAccounts.map((account) => (
            <li
              key={`google-${account.customer_id}`}
              className={selectedAccount === account.customer_id ? 'selected' : ''}
              onClick={() => setSelectedAccount(account.customer_id)}
            >
              {account.customer_id || 'N/A'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccountSidebar;
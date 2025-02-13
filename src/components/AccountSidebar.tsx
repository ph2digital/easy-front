import React, { useState, useRef, useCallback } from 'react';
import './styles/AccountSidebar.css';
import GoogleAdsLogo from '../assets/Logo Google Ads.svg';
import GoogleAdsLogoIluminado from '../assets/Logo Google Ads-iluminado.svg';
import MetaAdsLogo from '../assets/Logo Meta Ads.svg';
import MetaAdsLogoIluminado from '../assets/Logo Meta Ads-iluminado.svg';

interface AccountSidebarProps {
  selectedAccount: string | null;
  setSelectedAccount: (customer_id: string) => void;
  activeCustomers: any[];
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ selectedAccount, setSelectedAccount, activeCustomers }) => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const accountGridRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);

  const googleAccounts = activeCustomers.filter(account => account.type === 'google_ads');
  const facebookAccounts = activeCustomers.filter(account => account.type === 'meta_ads');

  const handleAccountClick = (customer_id: string) => {
    setSelectedAccount(customer_id);
    localStorage.setItem('selectedCustomer', customer_id);
  };

  const getAccountInitials = (account: any): string => {
    const name = account.accountdetails_name || account.accountdetails_business_name || account.customer_id;
    return name.substring(0, 2).toUpperCase();
  };

  const handleChannelToggle = (channel: string) => {
    setSelectedChannel(prevChannel => prevChannel === channel ? null : channel);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!accountGridRef.current) return;
    
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || !accountGridRef.current) return;
      
      const deltaY = startYRef.current - moveEvent.clientY;
      startYRef.current = moveEvent.clientY;
      
      accountGridRef.current.scrollTop += deltaY;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div className="account-sidebar">
      <div className="account-list">
        {/* Google Ads Channel */}
        <div className="channel-section">
          <div 
            className="channel-button"
            onClick={() => handleChannelToggle('google')}
            aria-label="Toggle Google Ads Accounts"
            role="button"
          >
            <img 
              src={selectedChannel === 'google' ? GoogleAdsLogoIluminado : GoogleAdsLogo} 
              alt="Google Ads" 
              className="channel-logo" 
            />
          </div>
          {selectedChannel === 'google' && (
            <div 
              ref={accountGridRef}
              className="account-grid"
              onMouseDown={handleMouseDown}
              aria-label="Google Ads Accounts"
            >
              {googleAccounts.map((account) => (
                <div
                  key={`google-${account.id}`}
                  className={`account-square ${selectedAccount === account.id ? 'selected' : ''}`}
                  onClick={() => handleAccountClick(account.customer_id)}
                  aria-label={`Select Google Ads Account ${account.customer_id}`}
                  role="button"
                >
                  {getAccountInitials(account)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Facebook Ads Channel */}
        <div className="channel-section">
          <div 
            className="channel-button"
            onClick={() => handleChannelToggle('facebook')}
            aria-label="Toggle Meta Ads Accounts"
            role="button"
          >
            <img 
              src={selectedChannel === 'facebook' ? MetaAdsLogoIluminado : MetaAdsLogo} 
              alt="Meta Ads" 
              className="channel-logo" 
            />
          </div>
          {selectedChannel === 'facebook' && (
            <div 
              ref={accountGridRef}
              className="account-grid"
              onMouseDown={handleMouseDown}
              aria-label="Meta Ads Accounts"
            >
              {facebookAccounts.map((account) => (
                <div
                  key={`facebook-${account.id}`}
                  className={`account-square ${selectedAccount === account.id ? 'selected' : ''}`}
                  onClick={() => handleAccountClick(account.customer_id)}
                  aria-label={`Select Meta Ads Account ${account.customer_id}`}
                  role="button"
                >
                  {getAccountInitials(account)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;
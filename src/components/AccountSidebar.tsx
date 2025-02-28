import React, { useState, useRef, useEffect } from 'react';
import './styles/AccountSidebar.css';
import GoogleAdsLogo from '../assets/Logo Google Ads.svg';
import MetaAdsLogo from '../assets/Logo Meta Ads.svg';
import MetaAdsLogoIluminado from '../assets/Logo Meta Ads-iluminado.svg';
import { Settings, Plus, User, ChevronRight, Menu } from 'lucide-react';
import { selectCustomers, fetchCustomers } from '../store/customersSlice';
import { useAppDispatch, useAppSelector } from '../store';
import { selectProfileImage } from '../store/authSlice';
import ConversationList from './ConversationList';
import type { Thread } from '../store/threadsSlice';

interface Customer {
  id: string;
  customer_id: string;
  type: 'google_ads' | 'meta_ads';
  is_active: boolean;
  accountdetails_name: string | null;
  accountdetails_business_name: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface AccountSidebarProps {
  selectedAccount: string | null;
  setSelectedAccount: (customerId: string) => void;
  onSelectConversation: (thread: Thread | null) => void;
  currentThread: Thread | null;
}

const ITEMS_PER_PAGE = 4;

const AccountSidebar: React.FC<AccountSidebarProps> = ({
  selectedAccount,
  setSelectedAccount,
  onSelectConversation,
  currentThread
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [hoveredAccountName, setHoveredAccountName] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({
    google: 0,
    facebook: 0
  });
  const [isConversationListOpen, setIsConversationListOpen] = useState(false);

  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const profileImage = useAppSelector(selectProfileImage);

  useEffect(() => {
    const userId = '3893aa0b-650d-430a-b6db-62da3be1633a';
    dispatch(fetchCustomers(userId));
  }, [dispatch]);

  const googleAccounts = customers.filter(account => account.type === 'google_ads' && account.is_active);
  const facebookAccounts = customers.filter(account => account.type === 'meta_ads' && account.is_active);

  const handleNextPage = (channel: string) => {
    const accounts = channel === 'google' ? googleAccounts : facebookAccounts;
    const maxPage = Math.ceil(accounts.length / ITEMS_PER_PAGE) - 1;
    setCurrentPage(prev => ({
      ...prev,
      [channel]: prev[channel] >= maxPage ? 0 : prev[channel] + 1
    }));
  };

  const getPageAccounts = (accounts: Customer[], channel: string) => {
    const startIndex = currentPage[channel] * ITEMS_PER_PAGE;
    return accounts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const handleAccountClick = (customer: Customer) => {
    localStorage.setItem('selectedCustomer', customer.customer_id);
    localStorage.setItem('selectedCustomerName', getAccountName(customer));
    localStorage.setItem('selectedCustomerType', customer.type);
    localStorage.setItem('customerGestor', customer.user_id);
    setSelectedAccount(customer.customer_id);
  };

  const getAccountInitials = (account: Customer): string => {
    const name = account.accountdetails_name || account.accountdetails_business_name || account.customer_id;
    return name.substring(0, 2).toUpperCase();
  };

  const getAccountName = (account: Customer): string => {
    return account.accountdetails_name || account.accountdetails_business_name || account.customer_id;
  };

  const handleMouseEnter = (accountName: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setHoveredAccountName(accountName);
    setTooltipPosition({ top: rect.top, left: rect.left + rect.width + 8 });
    
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setHoveredAccountName(null);
  };

  const addNewAccount = () => {
    alert('Adicionar nova conta');
  };

  const openSystemSettings = () => {
    alert('Abrir configurações do sistema');
  };

  const openProfileSettings = () => {
    alert('Abrir configurações de perfil');
  };

  return (
    <div className="account-sidebar">
      <button 
        className="menu-button"
        onClick={() => setIsConversationListOpen(true)}
      >
        <Menu size={24} />
      </button>

      <ConversationList
        isOpen={isConversationListOpen}
        onClose={() => setIsConversationListOpen(false)}
        onSelectConversation={onSelectConversation}
        currentThread={currentThread}
      />

      <div className="account-section">
        <div className="channel-section">
          <div 
            className={`channel-header ${selectedChannel === 'google' ? 'active' : ''}`}
            onClick={() => setSelectedChannel(selectedChannel === 'google' ? null : 'google')}
            data-channel="google"
          >
            <img
              src={GoogleAdsLogo}
              alt="Google Ads"
              className="channel-logo"
              style={{ width: '32px', height: '32px' }}
            />
          </div>
          {selectedChannel === 'google' && (
            <div className="accounts-list">
              {getPageAccounts(googleAccounts, 'google').map((account) => (
                <div
                  key={account.id}
                  className={`account-block ${selectedAccount === account.customer_id ? 'selected' : ''}`}
                  onClick={() => handleAccountClick(account)}
                  onMouseEnter={(e) => handleMouseEnter(getAccountName(account), e)}
                  onMouseLeave={handleMouseLeave}
                  data-type="google_ads"
                >
                  {getAccountInitials(account)}
                  {hoveredAccountName === getAccountName(account) && (
                    <div className="tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                      {hoveredAccountName}
                    </div>
                  )}
                </div>
              ))}
              {googleAccounts.length > ITEMS_PER_PAGE && (
                <div className="next-page-button" onClick={() => handleNextPage('google')}>
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="channel-section">
          <div 
            className={`channel-header ${selectedChannel === 'facebook' ? 'active' : ''}`}
            onClick={() => setSelectedChannel(selectedChannel === 'facebook' ? null : 'facebook')}
            data-channel="facebook"
          >
            <img
              src={selectedChannel === 'facebook' ? MetaAdsLogoIluminado : MetaAdsLogo}
              alt="Meta Ads"
              className="channel-logo"
              style={{ width: '32px', height: '32px' }}
            />
          </div>
          {selectedChannel === 'facebook' && (
            <div className="accounts-list">
              {getPageAccounts(facebookAccounts, 'facebook').map((account) => (
                <div
                  key={account.id}
                  className={`account-block ${selectedAccount === account.customer_id ? 'selected' : ''}`}
                  onClick={() => handleAccountClick(account)}
                  onMouseEnter={(e) => handleMouseEnter(getAccountName(account), e)}
                  onMouseLeave={handleMouseLeave}
                  data-type="meta_ads"
                >
                  {getAccountInitials(account)}
                  {hoveredAccountName === getAccountName(account) && (
                    <div className="tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                      {hoveredAccountName}
                    </div>
                  )}
                </div>
              ))}
              {facebookAccounts.length > ITEMS_PER_PAGE && (
                <div className="next-page-button" onClick={() => handleNextPage('facebook')}>
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="account-sidebar-footer">
        <button className="action-button" onClick={addNewAccount}>
          <Plus size={20} />
        </button>
        <button className="action-button" onClick={openSystemSettings}>
          <Settings size={20} />
        </button>
        <button className="action-button" onClick={openProfileSettings}>
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-image" />
          ) : (
            <User size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default AccountSidebar;